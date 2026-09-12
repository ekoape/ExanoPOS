import { Printer, X } from "lucide-react";
import { usePos } from "@/context/PosContext";
import { fmtRp, fmtDateTime } from "@/utils/format";

const DASH = "-".repeat(40);

const Line = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? "text-sm font-bold" : ""}`}>
    <span>{label}</span>
    <span className="tabular-nums">{value}</span>
  </div>
);

export default function ReceiptModal({ transaction, onClose }) {
  const { settings } = usePos();
  if (!transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      data-testid="receipt-modal"
    >
      <div
        className="max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div id="receipt-print-area" className="w-[320px] p-6 font-mono text-xs leading-relaxed tracking-tight text-slate-900">
          <div className="text-center">
            <p className="text-sm font-bold uppercase">{settings.storeName}</p>
            <p>{settings.address}</p>
            <p>Telp: {settings.phone}</p>
          </div>
          <p className="my-2">{DASH}</p>
          <Line label="No. Struk" value={transaction.id} />
          <Line label="Tanggal" value={fmtDateTime(transaction.date)} />
          <Line label="Kasir" value={transaction.cashier} />
          <Line label="Pelanggan" value={transaction.customer} />
          <p className="my-2">{DASH}</p>
          {transaction.items.map((item, idx) => (
            <div key={idx} className="mb-1.5">
              <p>{item.name}</p>
              {item.note && <p className="text-slate-500">  No: {item.note}</p>}
              <div className="flex justify-between">
                <span>
                  {item.qty} x {fmtRp(item.price)}
                </span>
                <span className="tabular-nums">{fmtRp(item.qty * item.price)}</span>
              </div>
            </div>
          ))}
          <p className="my-2">{DASH}</p>
          <Line label="Subtotal" value={fmtRp(transaction.subtotal)} />
          {transaction.discount > 0 && <Line label="Diskon" value={"- " + fmtRp(transaction.discount)} />}
          {transaction.tax > 0 && <Line label="PPN 11%" value={fmtRp(transaction.tax)} />}
          <p className="my-2">{DASH}</p>
          <Line bold label="TOTAL" value={fmtRp(transaction.total)} />
          <Line label={transaction.payment} value={fmtRp(transaction.paid)} />
          <Line label="Kembalian" value={fmtRp(transaction.change)} />
          <p className="my-2">{DASH}</p>
          <p className="text-center">{settings.receiptFooter}</p>
          <p className="mt-2 text-center text-[10px] text-slate-500">{settings.watermark}</p>
        </div>

        <div className="flex gap-2 border-t border-slate-200 p-4 print:hidden">
          <button
            data-testid="receipt-print-button"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          >
            <Printer className="h-4 w-4" /> Cetak Struk
          </button>
          <button
            data-testid="receipt-close-button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4" /> Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
