"use client";

import dynamic from "next/dynamic";

const ReactGithubHeatmap = dynamic(
  () =>
    import("@/components/ReactGithubHeatmap/ReactGithubHeatmap").then(
      (mod) => mod.ReactGithubHeatmap,
    ),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  },
);

export const ContributionGraph = () => {
  return <ReactGithubHeatmap />;
};
