"use client";

import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { Search, Filter, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportDetail from "./report-detail";
import { formatDistanceToNow } from "../utils";
import { type Report, reports as initialReports } from "../data";
import { useState } from "react";

export default function ReportsAdmin() {
  const [reports, setReports] = useState<Report[]>(initialReports);

  // Use useQueryStates for multiple URL parameters
  const [queryState, setQueryState] = useQueryStates({
    report: parseAsInteger.withDefault(null as unknown as number),
    search: parseAsString.withDefault(""),
    status: parseAsString.withDefault("all"),
    type: parseAsString.withDefault("all"),
    tab: parseAsString.withDefault("all"),
  });

  // Derive selectedReport from selectedReportId
  const selectedReport = queryState.report
    ? reports.find((r) => r.id === queryState.report) || null
    : null;

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      queryState.search === "" ||
      report.content.toLowerCase().includes(queryState.search.toLowerCase()) ||
      report.id.toString().includes(queryState.search);

    const matchesStatus =
      queryState.status === "all" || report.status === queryState.status;

    const matchesType =
      queryState.type === "all" || report.reportType === queryState.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleResolveReport = (reportId: number, action: string) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? { ...report, status: action === "reject" ? "rejected" : "resolved" }
          : report,
      ),
    );
    setQueryState({ report: null });
  };

  const handleHideContent = (reportId: number) => {
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, isHidden: true } : report,
      ),
    );
  };

  const handleDeleteContent = (reportId: number) => {
    setReports(
      reports.map((report) =>
        report.id === reportId ? { ...report, isDeleted: true } : report,
      ),
    );
  };

  const handleSelectReport = (report: Report) => {
    setQueryState({ report: report.id });
  };

  return (
    <div className="min-w-[1280px] px-2 py-4">
      <h1 className="mb-6 text-2xl font-bold">Manajemen Laporan</h1>

      {selectedReport ? (
        <div>
          <Button
            variant="ghost"
            className="mb-4 pl-0"
            onClick={() => setQueryState({ report: null })}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Laporan
          </Button>
          <ReportDetail
            report={selectedReport}
            onResolve={handleResolveReport}
            onHide={handleHideContent}
            onDelete={handleDeleteContent}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="sticky top-20 z-10 mb-6 rounded-lg border bg-white/95 p-4 shadow-sm backdrop-blur-sm">
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan konten atau ID..."
                  className="pl-8"
                  value={queryState.search}
                  onChange={(e) => setQueryState({ search: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={queryState.status}
                  onValueChange={(value) => setQueryState({ status: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="new">Baru</SelectItem>
                    <SelectItem value="in-review">Sedang Ditinjau</SelectItem>
                    <SelectItem value="resolved">Selesai</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={queryState.type}
                  onValueChange={(value) => setQueryState({ type: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Tipe Laporan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="hate-speech">
                      Ujaran Kebencian
                    </SelectItem>
                    <SelectItem value="inappropriate">Tidak Pantas</SelectItem>
                    <SelectItem value="misinformation">
                      Informasi Salah
                    </SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs and TabsContent must be siblings */}
            <Tabs
              value={queryState.tab}
              onValueChange={(value) => setQueryState({ tab: value })}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="question">Pertanyaan</TabsTrigger>
                <TabsTrigger value="answer">Jawaban</TabsTrigger>
                <TabsTrigger value="comment">Komentar</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <ReportsList
                  reports={
                    queryState.tab === "all"
                      ? filteredReports
                      : filteredReports.filter(
                          (r) => r.contentType === queryState.tab,
                        )
                  }
                  onSelectReport={handleSelectReport}
                />
              </TabsContent>

              <TabsContent value="question" className="mt-4">
                <ReportsList
                  reports={filteredReports.filter(
                    (r) => r.contentType === "question",
                  )}
                  onSelectReport={handleSelectReport}
                />
              </TabsContent>

              <TabsContent value="answer" className="mt-4">
                <ReportsList
                  reports={filteredReports.filter(
                    (r) => r.contentType === "answer",
                  )}
                  onSelectReport={handleSelectReport}
                />
              </TabsContent>

              <TabsContent value="comment" className="mt-4">
                <ReportsList
                  reports={filteredReports.filter(
                    (r) => r.contentType === "comment",
                  )}
                  onSelectReport={handleSelectReport}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportsList({
  reports,
  onSelectReport,
}: {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}) {
  if (reports.length === 0) {
    return (
      <div className="min-w-[1280px] py-10 text-center text-muted-foreground">
        Tidak ada laporan yang sesuai dengan filter Anda
      </div>
    );
  }

  return (
    <div className="min-w-[1280px] overflow-hidden rounded-md border">
      <div className="grid grid-cols-12 bg-muted px-4 py-3 text-sm font-medium">
        <div className="col-span-1">ID</div>
        <div className="col-span-1">Tipe</div>
        <div className="col-span-5">Konten</div>
        <div className="col-span-2">Tipe Laporan</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Tanggal</div>
      </div>
      <div className="divide-y">
        {reports.map((report) => (
          <div
            key={report.id}
            className="grid cursor-pointer grid-cols-12 px-4 py-3 hover:bg-muted/50"
            onClick={() => onSelectReport(report)}
          >
            <div className="col-span-1 font-mono text-sm">#{report.id}</div>
            <div className="col-span-1">
              <Badge variant="outline" className="capitalize">
                {report.contentType === "question"
                  ? "Pertanyaan"
                  : report.contentType === "answer"
                    ? "Jawaban"
                    : report.contentType === "comment"
                      ? "Komentar"
                      : report.contentType}
              </Badge>
            </div>
            <div className="col-span-5 truncate pr-2 text-sm">
              {report.isDeleted ? (
                <span className="italic text-muted-foreground">
                  Konten dihapus
                </span>
              ) : report.isHidden ? (
                <span className="italic text-muted-foreground">
                  Konten disembunyikan
                </span>
              ) : (
                report.content
              )}
            </div>
            <div className="col-span-2">
              <ReportTypeBadge type={report.reportType} />
            </div>
            <div className="col-span-2">
              <StatusBadge status={report.status} />
            </div>
            <div className="col-span-1 text-sm text-muted-foreground">
              {formatDistanceToNow(report.date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    new: "bg-red-100 text-red-800 border-red-200",
    "in-review": "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const labels: Record<string, string> = {
    new: "Baru",
    "in-review": "Sedang Ditinjau",
    resolved: "Selesai",
    rejected: "Ditolak",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[status] || ""}`}
    >
      {labels[status] || status}
    </span>
  );
}

function ReportTypeBadge({ type }: { type: string }) {
  const variants: Record<string, string> = {
    spam: "bg-blue-100 text-blue-800 border-blue-200",
    "hate-speech": "bg-purple-100 text-purple-800 border-purple-200",
    inappropriate: "bg-pink-100 text-pink-800 border-pink-200",
    misinformation: "bg-orange-100 text-orange-800 border-orange-200",
    other: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const labels: Record<string, string> = {
    "hate-speech": "Ujaran Kebencian",
    inappropriate: "Tidak Pantas",
    misinformation: "Informasi Salah",
    spam: "Spam",
    other: "Lainnya",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variants[type] || ""}`}
    >
      {labels[type] || type}
    </span>
  );
}
