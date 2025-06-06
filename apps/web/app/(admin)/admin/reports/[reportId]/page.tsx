"use client";
import React from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportDetail from "../components/report-detail";
import { reports } from "../data";

interface ReportIdPageProps {
  params: {
    reportId: string;
  };
}

const ReportIdPage = ({ params }: ReportIdPageProps) => {
  const router = useRouter();
  const reportId = parseInt(params.reportId);

  // Find the report by ID
  const report = reports.find((r) => r.id === reportId);

  // If report not found, show 404
  if (!report) {
    notFound();
  }

  const handleResolve = (id: number, action: string) => {
    // TODO: Implement resolve functionality
    console.log(`Resolving report ${id} with action: ${action}`);
  };

  // const handleHide = (id: number) => {
  //   // TODO: Implement hide content functionality
  //   console.log(`Hiding content for report ${id}`);
  // };

  const handleDelete = (id: number) => {
    // TODO: Implement delete content functionality
    console.log(`Deleting content for report ${id}`);
  };

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      // Fallback to reports page if no history
      router.push("/admin/reports");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="-ml-2 mb-4 px-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Laporan
        </Button>
        <h1 className="text-2xl font-bold">Detail Laporan #{report.id}</h1>
        <p className="text-muted-foreground">
          Kelola dan tinjau laporan yang masuk dari pengguna
        </p>
      </div>

      <ReportDetail
        report={report}
        onResolve={handleResolve}
        // onHide={handleHide}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ReportIdPage;
