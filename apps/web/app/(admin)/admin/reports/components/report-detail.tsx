"use client";

import { AlertCircle, Flag, MessageSquare, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import type { Report } from "../data";
import { formatDate } from "../utils";

interface ReportDetailProps {
  report: Report;
  onResolve: (id: number, action: string) => void;
  onHide: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ReportDetail({
  report,
  onResolve,
  onHide,
  onDelete,
}: ReportDetailProps) {
  const contentTypeIcons = {
    question: <MessageSquare className="h-5 w-5" />,
    answer: <MessageSquare className="h-5 w-5" />,
    comment: <MessageSquare className="h-5 w-5" />,
  };

  const reportTypeLabels: Record<string, string> = {
    "hate-speech": "Ujaran Kebencian",
    inappropriate: "Konten Tidak Pantas",
    misinformation: "Informasi Salah",
    spam: "Spam",
    other: "Lainnya",
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-6 md:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {
                  contentTypeIcons[
                    report.contentType as keyof typeof contentTypeIcons
                  ]
                }
                <CardTitle className="capitalize">
                  {report.contentType === "question"
                    ? "Pertanyaan"
                    : report.contentType === "answer"
                      ? "Jawaban"
                      : report.contentType === "comment"
                        ? "Komentar"
                        : report.contentType}{" "}
                  #{report.contentId}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(report.date)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tanggal dilaporkan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardDescription>
              Dilaporkan karena{" "}
              <span className="font-medium">
                {reportTypeLabels[report.reportType] || report.reportType}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Konten
                </h3>
                <div className="rounded-md bg-muted p-4">
                  {report.isDeleted ? (
                    <p className="italic text-muted-foreground">
                      Konten ini telah dihapus
                    </p>
                  ) : report.isHidden ? (
                    <p className="italic text-muted-foreground">
                      Konten ini telah disembunyikan
                    </p>
                  ) : (
                    <p>{report.content}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Penulis Asli
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{report.author}</p>
                    <p className="text-sm text-muted-foreground">
                      ID Pengguna: {report.authorId}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Konteks
                </h3>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm">
                    {report.context || "Tidak ada konteks tambahan"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Alasan Laporan
                </h3>
                <div className="rounded-md bg-muted p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Flag className="h-4 w-4 text-red-500" />
                    <span className="font-medium">
                      {reportTypeLabels[report.reportType] || report.reportType}
                    </span>
                  </div>
                  <p>{report.reportReason}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Dilaporkan Oleh
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{report.reportedBy}</p>
                    <p className="text-sm text-muted-foreground">
                      ID Pengguna: {report.reportedById}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Moderasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium">Aksi Konten</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onHide(report.id)}
                  disabled={report.isHidden || report.isDeleted}
                >
                  Sembunyikan Konten
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDelete(report.id)}
                  disabled={report.isDeleted}
                >
                  Hapus Konten
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-medium">Aksi Laporan</h3>
              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => onResolve(report.id, "resolve")}
                  disabled={report.status === "resolved"}
                >
                  Tandai Selesai
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onResolve(report.id, "reject")}
                  disabled={report.status === "rejected"}
                >
                  Tolak Laporan
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <div className="mb-2 flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">
                Semua aksi di sini akan dicatat dan tidak dapat dibatalkan.
              </span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium capitalize">
                  {report.status === "new"
                    ? "Baru"
                    : report.status === "in-review"
                      ? "Sedang Ditinjau"
                      : report.status === "resolved"
                        ? "Selesai"
                        : report.status === "rejected"
                          ? "Ditolak"
                          : report.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  ID Laporan
                </span>
                <span className="font-medium">#{report.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ID Konten</span>
                <span className="font-medium">#{report.contentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Tanggal Laporan
                </span>
                <span className="font-medium">{formatDate(report.date)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
