import { prisma } from "@/lib/prisma";
import { Questions, User } from "@prisma/client";

type QuestionWithUser = Questions & {
  user: User;
};

export async function getRecommendedQuestions({
  userId,
  limit = 10,
  categoryId,
  cursor,
  includePopular = true,
  includeTrending = true,
  timeframe = "week", // "day", "week", "month", "all"
}: {
  userId?: string;
  limit?: number;
  categoryId?: string;
  cursor?: string;
  includePopular?: boolean;
  includeTrending?: boolean;
  timeframe?: "day" | "week" | "month" | "all";
}): Promise<{
  questions: QuestionWithUser[];
  nextCursor: string | null;
}> {
  let excludeQuestionIds: string[] = [];
  let userInterests: string[] = [];
  let userPreferences: Record<string, number> = {};

  // Menentukan rentang waktu untuk trending/populer
  const dateFilter = getDateFilterByTimeframe(timeframe);

  if (userId) {
    // 1. Mendapatkan pertanyaan yang sudah diinteraksi oleh user
    const interacted = await prisma.answer.findMany({
      where: {
        OR: [
          { savedAnswers: { some: { userId } } },
          { upvotesAnswer: { some: { userId } } },
          { userId },
        ],
      },
      select: {
        questionId: true,
        qusetion: {
          // Menyesuaikan dengan model yang ada (typo di schema)
          select: {
            questionCategory: {
              select: {
                categoryId: true,
              },
            },
          },
        },
      },
    });

    excludeQuestionIds = interacted.map((i) => i.questionId);

    // 2. Mendapatkan preferensi kategori pengguna
    const categoryCounts: Record<string, number> = {};
    interacted.forEach((interaction) => {
      interaction.qusetion?.questionCategory.forEach((qc) => {
        if (!qc.categoryId) return;
        categoryCounts[qc.categoryId] =
          (categoryCounts[qc.categoryId] || 0) + 1;
      });
    });

    // Menghitung skor preferensi berdasarkan interaksi
    const totalInteractions =
      Object.values(categoryCounts).reduce((sum, count) => sum + count, 0) || 1;
    userPreferences = Object.fromEntries(
      Object.entries(categoryCounts).map(([catId, count]) => [
        catId,
        count / totalInteractions,
      ]),
    );

    // 3. Mendapatkan kategori yang diminati pengguna (top 5)
    userInterests = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([catId]) => catId);
  }

  // 4. Mendapatkan pertanyaan populer (banyak jawaban)
  const popularQuestions = includePopular
    ? await getPopularQuestions({
        limit: Math.floor(limit / 3),
        excludeQuestionIds,
        categoryId,
        dateFilter,
      })
    : [];

  // 5. Mendapatkan pertanyaan trending (jawaban/upvote terbaru)
  const trendingQuestions = includeTrending
    ? await getTrendingQuestions({
        limit: Math.floor(limit / 3),
        excludeQuestionIds: [
          ...excludeQuestionIds,
          ...popularQuestions.map((q) => q.questionId),
        ],
        categoryId,
        dateFilter,
      })
    : [];

  // Menggabungkan IDs yang sudah diambil
  const combinedExcludeIds = [
    ...excludeQuestionIds,
    ...popularQuestions.map((q) => q.questionId),
    ...trendingQuestions.map((q) => q.questionId),
  ];

  // 6. Query pertanyaan yang dipersonalisasi
  const recommendedLimit =
    limit - popularQuestions.length - trendingQuestions.length;
  let personalizedQuestions: any[] = [];

  if (recommendedLimit > 0) {
    if (userId && userInterests.length > 0) {
      // Query berdasarkan minat pengguna
      personalizedQuestions = await prisma.questions.findMany({
        where: {
          questionId: { notIn: combinedExcludeIds },
          questionCategory: {
            some: {
              categoryId: { in: userInterests },
            },
          },
        },
        take: recommendedLimit + 1,
        ...(cursor
          ? {
              cursor: { questionId: cursor },
              skip: 1,
            }
          : {}),
        orderBy: [{ createdAt: "desc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              organization: true,
            },
          },
          questionCategory: {
            include: { category: true },
          },
          // Menggunakan _count untuk mendapatkan jumlah jawaban
          _count: {
            select: {
              answer: true,
            },
          },
        },
      });
    } else {
      // Fallback: pertanyaan terbaru jika tidak ada personalisasi
      personalizedQuestions = await prisma.questions.findMany({
        where: {
          questionId: { notIn: combinedExcludeIds },
          ...(categoryId
            ? {
                questionCategory: {
                  some: { categoryId },
                },
              }
            : {}),
        },
        take: recommendedLimit + 1,
        ...(cursor
          ? {
              cursor: { questionId: cursor },
              skip: 1,
            }
          : {}),
        orderBy: [{ createdAt: "desc" }],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              organization: true,
            },
          },
          questionCategory: {
            include: { category: true },
          },
          _count: {
            select: {
              answer: true,
            },
          },
        },
      });
    }
  }

  // 7. Menggabungkan semua hasil
  let allQuestions = [
    ...popularQuestions,
    ...trendingQuestions,
    ...personalizedQuestions,
  ];

  // 8. Menyusun ulang hasil berdasarkan skor relevansi jika ada preferensi pengguna
  if (userId && Object.keys(userPreferences).length > 0) {
    allQuestions = allQuestions
      .map((question) => {
        // Hitung skor relevansi berdasarkan kecocokan kategori dengan preferensi pengguna
        let relevanceScore = 0;
        question.questionCategory.forEach((qCat: any) => {
          if (userPreferences[qCat.categoryId]) {
            relevanceScore += userPreferences[qCat.categoryId];
          }
        });

        // Tambahkan faktor freshness (pertanyaan baru lebih diutamakan)
        const ageInDays = Math.max(
          1,
          (Date.now() - new Date(question.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const freshnessScore = 1 / Math.sqrt(ageInDays);

        // Tambahkan faktor engagement
        const engagementScore = (question._count?.answer || 0) * 0.5;

        // Skor akhir
        const finalScore =
          relevanceScore * 0.6 + freshnessScore * 0.3 + engagementScore * 0.1;

        return {
          ...question,
          _relevanceScore: finalScore,
        };
      })
      .sort((a, b) => b._relevanceScore - a._relevanceScore);
  }

  // 9. Diversifikasi hasil (memastikan tidak semua pertanyaan dari kategori yang sama)
  allQuestions = diversifyResults(allQuestions);

  // Menentukan cursor berikutnya
  const questions = allQuestions.slice(0, limit);
  const nextCursor =
    allQuestions.length > limit ? allQuestions[limit - 1]?.questionId : null;

  return {
    questions,
    nextCursor,
  };
}

// Fungsi pendukung untuk mendapatkan pertanyaan populer
async function getPopularQuestions({
  limit = 3,
  excludeQuestionIds = [],
  categoryId,
  dateFilter,
}: {
  limit: number;
  excludeQuestionIds: string[];
  categoryId?: string;
  dateFilter: any;
}) {
  return prisma.questions.findMany({
    where: {
      questionId: { notIn: excludeQuestionIds },
      createdAt: dateFilter,
      ...(categoryId
        ? {
            questionCategory: {
              some: { categoryId },
            },
          }
        : {}),
    },
    take: limit,
    orderBy: [
      {
        answer: {
          _count: "desc",
        },
      },
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          organization: true,
        },
      },
      questionCategory: {
        include: { category: true },
      },
      _count: {
        select: {
          answer: true,
        },
      },
    },
  });
}

// Fungsi pendukung untuk mendapatkan pertanyaan trending
async function getTrendingQuestions({
  limit = 3,
  excludeQuestionIds = [],
  categoryId,
  dateFilter,
}: {
  limit: number;
  excludeQuestionIds: string[];
  categoryId?: string;
  dateFilter: any;
}) {
  // Menggunakan aktivitas terbaru (jawaban, upvote) dalam 24 jam terakhir
  const recentActivityTimeframe = {
    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
  };

  return prisma.questions.findMany({
    where: {
      questionId: { notIn: excludeQuestionIds },
      createdAt: dateFilter,
      ...(categoryId
        ? {
            questionCategory: {
              some: { categoryId },
            },
          }
        : {}),
      answer: {
        some: {
          createdAt: recentActivityTimeframe,
        },
      },
    },
    take: limit,
    orderBy: [
      {
        answer: {
          _count: "desc",
        },
      },
      { createdAt: "desc" },
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          organization: true,
        },
      },
      questionCategory: {
        include: { category: true },
      },
      _count: {
        select: {
          answer: true,
        },
      },
    },
  });
}

// Fungsi untuk mendapatkan filter tanggal berdasarkan timeframe
function getDateFilterByTimeframe(timeframe: string) {
  const now = new Date();

  switch (timeframe) {
    case "day":
      return { gte: new Date(now.setDate(now.getDate() - 1)) };
    case "week":
      return { gte: new Date(now.setDate(now.getDate() - 7)) };
    case "month":
      return { gte: new Date(now.setMonth(now.getMonth() - 1)) };
    case "all":
    default:
      return {};
  }
}

// Fungsi untuk mendiversifikasi hasil (mencegah terlalu banyak item dari kategori yang sama)
function diversifyResults(questions: any[]) {
  // Jika sedikit pertanyaan, tidak perlu diversifikasi
  if (questions.length <= 5) return questions;

  const categoryCounts: Record<string, number> = {};
  const MAX_PER_CATEGORY = Math.ceil(questions.length / 3); // Maksimal 1/3 dari total hasil

  return questions.sort((a, b) => {
    // Menghitung kategori yang sudah ada
    const aCategoryIds = a.questionCategory.map((qc: any) => qc.categoryId);
    const bCategoryIds = b.questionCategory.map((qc: any) => qc.categoryId);

    // Cek apakah a memiliki kategori yang sudah terlalu banyak
    const aOverrepresented = aCategoryIds.some(
      (catId: any) => (categoryCounts[catId] || 0) >= MAX_PER_CATEGORY,
    );

    // Cek apakah b memiliki kategori yang sudah terlalu banyak
    const bOverrepresented = bCategoryIds.some(
      (catId: any) => (categoryCounts[catId] || 0) >= MAX_PER_CATEGORY,
    );

    if (aOverrepresented && !bOverrepresented) return 1;
    if (!aOverrepresented && bOverrepresented) return -1;

    // Jika keduanya sama-sama overrepresented atau tidak, gunakan skor relevansi
    return (b._relevanceScore || 0) - (a._relevanceScore || 0);
  });
}

// Fungsi utilitas untuk menghitung waktu baca (untuk menampilkan info tambahan)
export function calculateReadTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
