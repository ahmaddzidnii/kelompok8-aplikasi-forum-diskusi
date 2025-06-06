"use client";

import { SearchIcon, Filter } from "lucide-react";
import { useQueryStates, parseAsString, parseAsInteger } from "nuqs";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { reports } from "./data";
import Link from "next/link";

export default function Home() {
  const [queryStates, setQueryStates] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    sortField: parseAsString.withDefault(""),
    sortDirection: parseAsString.withDefault("asc"),
    itemsPerPage: parseAsInteger.withDefault(10),
    status: parseAsString.withDefault("all"),
    type: parseAsString.withDefault("all"),
  });

  const { page, search, sortField, sortDirection, itemsPerPage, status, type } =
    queryStates;

  // Filter data berdasarkan search, status, dan type
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      search === "" ||
      report.content.toLowerCase().includes(search.toLowerCase()) ||
      report.id.toString().includes(search);

    const matchesStatus = status === "all" || report.status === status;

    const matchesType = type === "all" || report.reportType === type;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);

  // Pagination untuk data
  const paginatedReports = filteredReports.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setQueryStates({
        sortDirection: sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setQueryStates({
        sortField: field,
        sortDirection: "asc",
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    setQueryStates({ page: newPage });
  };

  const handleSearchChange = (value: string) => {
    setQueryStates({
      search: value,
      page: 1, // Reset ke halaman pertama saat mencari
    });
  };

  const handleItemsPerPageChange = (value: number) => {
    setQueryStates({
      itemsPerPage: value,
      page: 1, // Reset ke halaman pertama saat mengubah item per halaman
    });
  };

  const handleStatusChange = (value: string) => {
    setQueryStates({
      status: value,
      page: 1, // Reset ke halaman pertama saat filter
    });
  };

  const handleTypeChange = (value: string) => {
    setQueryStates({
      type: value,
      page: 1, // Reset ke halaman pertama saat filter
    });
  };

  const formatDistanceToNow = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "Kemarin";
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`;
    return `${Math.floor(diffInDays / 30)} bulan lalu`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header dengan Pencarian dan Pengurutan */}
      <div className="fixed left-0 right-0 top-0 z-10 border-b bg-white pl-[210px] shadow-sm">
        <div className="px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Laporan</h1>
          </div>

          {/* Bar Pencarian dan Filter */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Input Pencarian */}
            <div className="relative max-w-md flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari laporan..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Kontrol Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Status */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="new">Baru</option>
                  <option value="in-review">Sedang Ditinjau</option>
                  <option value="resolved">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>

              {/* Filter Tipe */}
              <div className="flex items-center gap-2">
                <select
                  value={type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="spam">Spam</option>
                  <option value="hate-speech">Ujaran Kebencian</option>
                  <option value="inappropriate">Tidak Pantas</option>
                  <option value="misinformation">Informasi Salah</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              {/* Dropdown Pengurutan */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Tipe Konten:</span>
                <select
                  value={sortField}
                  onChange={(e) => handleSort(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Pilih tipe</option>
                  <option value="question">Pertanyaan</option>
                  <option value="answers">Jawaban</option>
                  <option value="comments">Komentar</option>
                </select>

                {sortField && (
                  <button
                    onClick={() =>
                      setQueryStates({
                        sortDirection: sortDirection === "asc" ? "desc" : "asc",
                      })
                    }
                    className="rounded p-1 hover:bg-gray-100"
                  >
                    {sortDirection === "asc" ? (
                      <FaChevronUp className="h-4 w-4" />
                    ) : (
                      <FaChevronDown className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Area Konten */}
      <div className="mx-auto px-6 pb-20 pt-32">
        {/* Tabel Laporan */}
        <div className="rounded-lg bg-white shadow">
          {filteredReports.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              Tidak ada laporan yang sesuai dengan filter Anda
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              {/* Header Tabel */}
              <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                <div className="col-span-1">ID</div>
                <div className="col-span-1">Tipe</div>
                <div className="col-span-5">Konten</div>
                <div className="col-span-2">Tipe Laporan</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Tanggal</div>
              </div>

              {/* Baris Data */}
              <div className="divide-y divide-gray-200">
                {paginatedReports.map((report) => (
                  <Link href={`/admin/reports/${report.id}`} key={report.id}>
                    <div className="grid cursor-pointer grid-cols-12 px-4 py-3 hover:bg-gray-50">
                      <div className="col-span-1 font-mono text-sm">
                        #{report.id}
                      </div>
                      <div className="col-span-1">
                        <ContentTypeBadge type={report.contentType} />
                      </div>
                      <div className="col-span-5 truncate pr-2 text-sm">
                        {report.isDeleted ? (
                          <span className="italic text-gray-500">
                            Konten dihapus
                          </span>
                        ) : report.isHidden ? (
                          <span className="italic text-gray-500">
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
                      <div className="col-span-1 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(report.date))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer dengan Pagination */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white pl-[210px] shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Info Hasil */}
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Menampilkan {startItem} sampai {endItem} dari {totalItems} hasil
              </span>
            </div>

            {/* Kontrol Pagination */}
            <div className="flex items-center gap-2">
              {/* Tombol Sebelumnya */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sebelumnya
              </button>

              {/* Nomor Halaman */}
              <div className="flex">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`border-b border-r border-t px-3 py-2 text-sm font-medium ${
                        page === pageNum
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Tombol Selanjutnya */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>

            {/* Selector item per halaman */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Tampilkan</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="rounded border border-gray-300 px-2 py-1 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>per halaman</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Badge Components
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
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${variants[status] || ""}`}
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
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${variants[type] || ""}`}
    >
      {labels[type] || type}
    </span>
  );
}

function ContentTypeBadge({ type }: { type: string }) {
  const variants: Record<string, string> = {
    question: "bg-blue-100 text-blue-800 border-blue-200",
    answer: "bg-green-100 text-green-800 border-green-200",
    comment: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const labels: Record<string, string> = {
    question: "Pertanyaan",
    answer: "Jawaban",
    comment: "Komentar",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${variants[type] || ""}`}
    >
      {labels[type] || type}
    </span>
  );
}
