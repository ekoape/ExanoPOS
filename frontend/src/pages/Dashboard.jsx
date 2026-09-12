import { useState } from "react";
import { TrendingUp, Wallet, CalendarDays, ReceiptText, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { usePos } from "@/context/PosContext";
import { fmtRp, fmtDateTime, isSameDay, isSameMonth, downloadRecapCSV } from "@/utils/format";
import ReceiptModal from "@/components/ReceiptModal";

const typeBadge = {
  physical: "bg-blue-50 text-blue-700 border-blue-200",
  digital: "bg-purple-50 text-purple-700 border-purple-200",
  online: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
const typeLabel = { physical: "Produk Fisik", digital: "Produk Digital", online: "Produk Online" };
const payBadge = {
  Tunai: "bg-emerald-50 text-emerald-700",
  QRIS: "bg-indigo-50 text-indigo-700",
  Transfer: "bg-amber-50 text-amber-700",
};

export default function Dashboard() {
  const { transactions } = usePos();
  const [reprintTx, setReprintTx] = useState(null);

  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const omsetHariIni = transactions.filter((t) => isSameDay(t.date, now)).reduce((s, t) => s + t.total, 0);
  const omsetKemarin = transactions.filter((t) => isSameDay(t.date, yesterday)).reduce((s, t) => s + t.total, 0);
  const omsetBulanIni = transactions.filter((t) => isSameMonth(t.date, now)).reduce((s, t) => s + t.total, 0);
  const trend = omsetKemarin > 0 ? ((omsetHariIni - omsetKemarin) / omsetKemarin) * 100 : null;

  const cards = [
    { testId: "summary-card-daily", icon: Wallet, label: "Omset Hari Ini", value: omsetHariIni, accent: "bg-blue-700", trend },
    { testId: "summary-card-monthly", icon: CalendarDays, label: "Omset Bulan Ini", value: omsetBulanIni, accent: "bg-indigo-600" },
    { testId: "summary-card-total", icon: ReceiptText, label: "Total Transaksi", value: transactions.length, accent: "bg-emerald-600", isCount: true },
  ];

  const handleExport = () => {
    downloadRecapCSV(transactions);
    toast.success("Rekap omset berhasil diunduh (CSV)");
  };

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Rekap omset dan histori penjualan terbaru</p>
        </div>
        <button
          data-testid="export-recap-button"
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Download className="h-4 w-4" /> Unduh Rekap (Excel/CSV)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.testId}
            data-testid={c.testId}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{c.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.accent}`}>
                <c.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className={`mt-3 font-mono text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl ${c.isCount ? "" : "text-blue-700"}`}>
              {c.isCount ? c.value : fmtRp(c.value)}
            </p>
            {c.trend !== undefined && c.trend !== null && (
              <p className={`mt-2 flex items-center gap-1 text-xs font-semibold ${c.trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                <TrendingUp className="h-3.5 w-3.5" />
                {c.trend >= 0 ? "+" : ""}
                {c.trend.toFixed(1)}% vs kemarin
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-slate-800">Histori Penjualan Terbaru</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {transactions.length} transaksi
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="sales-history-table">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3 font-medium sm:px-6">Invoice</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Pelanggan / Tipe</th>
                <th className="px-5 py-3 font-medium">Pembayaran</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 text-right font-medium sm:px-6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50" data-testid={`sales-row-${t.id}`}>
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-700 sm:px-6">{t.id}</td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{fmtDateTime(t.date)}</td>
                  <td className="px-5 py-3.5">
                    <p className="max-w-[180px] truncate text-slate-700">{t.customer}</p>
                    <span className={`mt-0.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${typeBadge[t.type]}`}>
                      {typeLabel[t.type]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payBadge[t.payment]}`}>{t.payment}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono font-semibold text-slate-900">{fmtRp(t.total)}</td>
                  <td className="px-5 py-3.5 text-right sm:px-6">
                    <button
                      data-testid={`reprint-receipt-${t.id}`}
                      onClick={() => setReprintTx(t)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      <Printer className="h-3.5 w-3.5" /> Cetak Ulang Struk
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reprintTx && <ReceiptModal transaction={reprintTx} onClose={() => setReprintTx(null)} />}
    </div>
  );
}
