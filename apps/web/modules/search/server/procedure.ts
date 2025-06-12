import { prisma } from "@/lib/prisma";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";

export const searchRouter = createTRPCRouter({
  getResultsCount: publicProcedure
    .input(
      z.object({
        q: z.string().min(1, "Query must not be empty"),
      }),
    )
    .query(async ({ input }) => {
      const { q } = input;
      console.log(q);

      // Split query into words and create search conditions
      const searchTerms = q.trim().split(/\s+/);
      const queryWithoutSpaces = q.replace(/\s+/g, "");

      const getQuestionsCountPromise = prisma.question.count({
        where: {
          OR: [
            // Original search with spaces
            { content: { contains: q, mode: "insensitive" } },
            // Search without spaces
            { content: { contains: queryWithoutSpaces, mode: "insensitive" } },
            // Search for all terms (each word must be present)
            {
              AND: searchTerms.map((term) => ({
                content: { contains: term, mode: "insensitive" },
              })),
            },
          ],
        },
      });

      const getUsersCountPromise = prisma.user.count({
        where: {
          OR: [
            // Name searches
            { name: { contains: q, mode: "insensitive" } },
            { name: { contains: queryWithoutSpaces, mode: "insensitive" } },
            {
              AND: searchTerms.map((term) => ({
                name: { contains: term, mode: "insensitive" },
              })),
            },
            // Username searches
            { username: { contains: q, mode: "insensitive" } },
            { username: { contains: queryWithoutSpaces, mode: "insensitive" } },
            {
              AND: searchTerms.map((term) => ({
                username: { contains: term, mode: "insensitive" },
              })),
            },
          ],
        },
      });

      const [questions, users] = await Promise.all([
        getQuestionsCountPromise,
        getUsersCountPromise,
      ]);

      return {
        questions,
        users,
      };
    }),
  getSearchResults: publicProcedure
    .input(
      z.object({
        q: z.string().min(1, "Query must not be empty"),
        type: z.enum(["questions", "users"]).default("questions"),
      }),
    )
    .query(async ({ input }) => {
      const { q, type } = input;

      // Split query into words and create search conditions
      const searchTerms = q.trim().split(/\s+/);
      const queryWithoutSpaces = q.replace(/\s+/g, "");

      if (type === "questions") {
        const questions = await prisma.question.findMany({
          where: {
            OR: [
              // Original search with spaces
              { content: { contains: q, mode: "insensitive" } },
              // Search without spaces
              {
                content: { contains: queryWithoutSpaces, mode: "insensitive" },
              },
              // Search for all terms (each word must be present)
              {
                AND: searchTerms.map((term) => ({
                  content: { contains: term, mode: "insensitive" },
                })),
              },
            ],
          },
          include: {
            user: {
              select: {
                username: true,
                name: true,
                image: true,
                organization: true,
              },
            },
            questionCategories: {
              select: {
                category: {
                  select: {
                    categoryId: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          questions: questions,
          users: [],
        };
      } else {
        const users = await prisma.user.findMany({
          where: {
            OR: [
              // Name searches
              { name: { contains: q, mode: "insensitive" } },
              { name: { contains: queryWithoutSpaces, mode: "insensitive" } },
              {
                AND: searchTerms.map((term) => ({
                  name: { contains: term, mode: "insensitive" },
                })),
              },
              // Username searches
              { username: { contains: q, mode: "insensitive" } },
              {
                username: { contains: queryWithoutSpaces, mode: "insensitive" },
              },
              {
                AND: searchTerms.map((term) => ({
                  username: { contains: term, mode: "insensitive" },
                })),
              },
            ],
          },
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return {
          questions: [],
          users: users,
        };
      }
    }),
});
