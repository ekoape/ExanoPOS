export const fmtRp = (n) => "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n || 0));

export const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const isSameDay = (iso, ref = new Date()) => {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
};

export const isSameMonth = (iso, ref = new Date()) => {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
};

export const downloadRecapCSV = (transactions) => {
  const header = ["Invoice", "Tanggal", "Tipe", "Pelanggan", "Item", "Subtotal", "Diskon", "PPN", "Total", "Pembayaran", "Kasir"];
  const rows = transactions.map((t) => [
    t.id,
    fmtDateTime(t.date),
    t.type,
    t.customer,
    t.items.map((i) => `${i.name} x${i.qty}`).join("; "),
    t.subtotal,
    t.discount,
    t.tax,
    t.total,
    t.payment,
    t.cashier,
  ]);
  const totalRow = ["", "", "", "", "TOTAL OMSET", "", "", "", transactions.reduce((s, t) => s + t.total, 0), "", ""];
  const csv = [header, ...rows, totalRow]
    .map((r) => r.map((c) => `"${String(c ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rekap-omset-exapos-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
