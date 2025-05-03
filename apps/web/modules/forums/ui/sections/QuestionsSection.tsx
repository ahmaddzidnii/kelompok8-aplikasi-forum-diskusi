"use client";
import {
  QuestionCard,
  QuestionCardSkeleton,
} from "@/modules/question/ui/components/QuestionCard";
import { useState, useEffect } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const data = [
  {
    id: 1,
    title: "Apa itu React?",
    category: "Teknologi",
  },
  {
    id: 2,
    title: "Apa itu Next.js?",
    category: "Teknologi",
  },
];

const simulateApiCall = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 50);
  });

export const QuestionsSection = () => {
  return (
    <Suspense fallback={<QuestionCardSkeleton />}>
      <ErrorBoundary fallback={<div>Terjadi kesalahan saat memuat data</div>}>
        <QuestionsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const QuestionsSectionSuspense = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    simulateApiCall()
      .then((data) => {
        setQuestions(data as any[]);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <div>Terjadi kesalahan saat memuat data</div>;
  }

  if (loading) {
    return Array.from({ length: 2 }).map((_, index) => (
      <QuestionCardSkeleton key={index} />
    ));
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {questions.map((question) => (
        <QuestionCard key={question.id} />
      ))}
    </div>
  );
};
