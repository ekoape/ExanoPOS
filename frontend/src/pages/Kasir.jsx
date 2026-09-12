import { useMemo, useState } from "react";
import {
  Search, Plus, Minus, Trash2, ShoppingCart, Coffee, Smartphone, Globe,
  Banknote, QrCode, CreditCard, AlertTriangle, History, Printer,
} from "lucide-react";
import { toast } from "sonner";
import { usePos } from "@/context/PosContext";
import { fmtRp } from "@/utils/format";
import ReceiptModal from "@/components/ReceiptModal";

const tabs = [
  { key: "physical", label: "Product", icon: Coffee, testId: "pos-tab-physical" },
  { key: "digital", label: "Product Digital", icon: Smartphone, testId: "pos-tab-digital" },
  { key: "online", label: "Product Online", icon: Globe, testId: "pos-tab-online" },
];

const catStyle = {
  physical: { tile: "bg-blue-50 text-blue-700", icon: Coffee },
  digital: { tile: "bg-purple-50 text-purple-700", icon: Smartphone },
  online: { tile: "bg-emerald-50 text-emerald-700", icon: Globe },
};

const paymentMethods = [
  { key: "Tunai", label: "Cash / Tunai", icon: Banknote, testId: "payment-method-cash" },
  { key: "QRIS", label: "QRIS", icon: QrCode, testId: "payment-method-qris" },
  { key: "Transfer", label: "Transfer Bank", icon: CreditCard, testId: "payment-method-transfer" },
];

const CheckoutModal = ({ total, cart, discount, tax, subtotal, targetNumber, onClose, onSuccess }) => {
  const { addTransaction, currentUser } = usePos();
  const [method, setMethod] = useState("Tunai");
  const [paid, setPaid] = useState(total);

  const change = paid - total;
  const canPay = method !== "Tunai" || paid >= total;

  const selectMethod = (m) => {
    setMethod(m);
    if (m !== "Tunai") setPaid(total);
  };

  const handleConfirm = () => {
    const types = [...new Set(cart.map((i) => i.category))];
    const hasDigital = cart.some((i) => i.category === "digital");
    const tx = addTransaction({
      customer: hasDigital && targetNumber ? targetNumber : "Walk-in Customer",
      type: types.length === 1 ? types[0] : "physical",
      cashier: currentUser.name,
      items: cart.map(({ productId, name, price, qty, note }) => ({ productId, name, price, qty, note })),
      subtotal, discount, tax, total,
      payment: method,
      paid: method === "Tunai" ? paid : total,
      change: method === "Tunai" ? Math.max(0, change) : 0,
    });
    toast.success("Pembayaran Berhasil!");
    onSuccess(tx);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose} data-testid="checkout-modal">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-slate-800">Pembayaran</h3>
        <p className="mt-1 text-sm text-slate-500">Pilih metode pembayaran</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {paymentMethods.map((m) => (
            <button
              key={m.key}
              data-testid={m.testId}
              onClick={() => selectMethod(m.key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition-colors ${
                method === m.key ? "border-blue-700 bg-blue-700 text-white" : "border-slate-300 text-slate-600 hover:border-blue-400"
              }`}
            >
              <m.icon className="h-5 w-5" />
              {m.label}
            </button>
          ))}
        </div>

        {method === "QRIS" && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center" data-testid="qris-simulation">
            <div className="mx-auto grid h-28 w-28 grid-cols-5 gap-0.5 rounded-lg bg-white p-2 shadow-inner">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`rounded-[2px] ${(i * 7 + 3) % 3 === 0 ? "bg-slate-900" : "bg-slate-200"}`} />
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">Scan QRIS · {fmtRp(total)}</p>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-600">Total Tagihan</span>
            <span className="font-mono text-xl font-bold text-blue-700" data-testid="checkout-total">{fmtRp(total)}</span>
          </div>
        </div>

        {method === "Tunai" && (
          <>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Uang Diterima</label>
              <input
                data-testid="paid-amount-input"
                type="number"
                min="0"
                value={paid}
                onChange={(e) => setPaid(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-mono text-lg font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[total, 50000, 100000, 150000, 200000].map((v, i) => (
                <button
                  key={v + "-" + i}
                  data-testid={`quick-cash-${i}`}
                  onClick={() => setPaid(v)}
                  className="rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-blue-500 hover:text-blue-700"
                >
                  {i === 0 ? "Uang Pas" : fmtRp(v)}
                </button>
              ))}
            </div>
          </>
        )}

        <div className={`mt-4 flex items-center justify-between rounded-xl px-4 py-3 ${change >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
          <span className="text-sm font-medium text-slate-600">Kembalian</span>
          <span
            data-testid="checkout-change"
            className={`font-mono text-lg font-bold ${change >= 0 ? "text-emerald-700" : "text-red-600"}`}
          >
            {change >= 0 ? fmtRp(change) : "Kurang " + fmtRp(Math.abs(change))}
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            data-testid="checkout-pay-button"
            onClick={handleConfirm}
            disabled={!canPay}
            className="flex-1 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
          >
            Proses & Cetak Struk
          </button>
          <button
            data-testid="checkout-cancel-button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Kasir() {
  const { products, transactions } = usePos();
  const [tab, setTab] = useState("physical");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [useTax, setUseTax] = useState(true);
  const [targetNumber, setTargetNumber] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [lastTx, setLastTx] = useState(null);

  const filtered = useMemo(
    () => products.filter((p) => p.category === tab && p.name.toLowerCase().includes(search.toLowerCase())),
    [products, tab, search]
  );

  const cartQty = (id) => cart.find((i) => i.productId === id)?.qty || 0;

  const addToCart = (p) => {
    if (p.stock <= 0) {
      toast.error(`Stok ${p.name} habis`);
      return;
    }
    if (p.category !== "digital" && cartQty(p.id) >= p.stock) {
      toast.error(`Stok ${p.name} tidak mencukupi`);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === p.id);
      if (existing) return prev.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          price: p.price,
          qty: 1,
          category: p.category,
          note: p.category === "digital" && targetNumber ? targetNumber : undefined,
        },
      ];
    });
    toast.success(`${p.name} ditambahkan ke keranjang`);
  };

  const changeQty = (id, delta) => {
    const product = products.find((p) => p.id === id);
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.productId !== id) return i;
          const next = i.qty + delta;
          if (product && product.category !== "digital" && next > product.stock) {
            toast.error("Melebihi stok tersedia");
            return i;
          }
          return { ...i, qty: next };
        })
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.productId !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const hasDigital = cart.some((i) => i.category === "digital");
  const taxBase = subtotal - discount;
  const tax = useTax && !hasDigital ? Math.round(taxBase * 0.11) : 0;
  const total = Math.max(0, taxBase + tax);

  const handleSuccess = (tx) => {
    setCheckoutOpen(false);
    setLastTx(tx);
    setCart([]);
    setDiscount(0);
    setTargetNumber("");
  };

  return (
    <div className="flex flex-col gap-6 xl:flex-row" data-testid="kasir-page">
      <div className="min-w-0 flex-1">
        <div className="mb-5">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Kasir</h1>
          <p className="mt-1 text-sm text-slate-500">Pilih produk untuk menambahkan ke keranjang</p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              data-testid={t.testId}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === t.key ? "bg-blue-700 text-white shadow-lg shadow-blue-600/20" : "border border-slate-300 bg-white text-slate-600 hover:border-blue-400"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="pos-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          {tab === "digital" && (
            <input
              data-testid="digital-target-number-input"
              value={targetNumber}
              onChange={(e) => setTargetNumber(e.target.value)}
              placeholder="No. HP / ID Pelanggan tujuan"
              className="rounded-lg border border-purple-300 bg-purple-50 px-4 py-2.5 text-sm outline-none placeholder:text-purple-400 focus:border-purple-500 sm:w-64"
            />
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
            Produk tidak ditemukan
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((p) => {
              const style = catStyle[p.category];
              const lowStock = p.category !== "digital" && p.stock <= p.minStock;
              const outOfStock = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  data-testid={`product-card-${p.id}`}
                  className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${style.tile}`}>
                    <style.icon className="h-7 w-7" />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-slate-800">{p.name}</p>
                  <p className="mt-0.5 font-mono text-base font-bold text-blue-700">{fmtRp(p.price)}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {p.category === "digital" ? (
                      <span className="text-xs font-medium text-slate-400">Selalu tersedia</span>
                    ) : outOfStock ? (
                      <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                        <AlertTriangle className="h-3 w-3" /> Habis
                      </span>
                    ) : lowStock ? (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                        <AlertTriangle className="h-3 w-3" /> Stok {p.stock} (Menipis)
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-500">Stok: {p.stock}</span>
                    )}
                  </div>
                  <button
                    data-testid={`product-add-${p.id}`}
                    onClick={() => addToCart(p)}
                    disabled={outOfStock}
                    className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <aside className="w-full shrink-0 xl:w-[360px]" data-testid="cart-panel">
        <div className="sticky top-20 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <ShoppingCart className="h-4 w-4 text-blue-700" /> Keranjang
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700" data-testid="cart-count">
              {cart.reduce((s, i) => s + i.qty, 0)} item
            </span>
          </div>

          <div className="max-h-[300px] overflow-y-auto px-5 py-3">
            {cart.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">Keranjang kosong</p>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0" data-testid={`cart-item-${item.productId}`}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                    {item.note && <p className="truncate text-[11px] text-purple-500">No: {item.note}</p>}
                    <p className="font-mono text-xs text-slate-500">{fmtRp(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      data-testid={`cart-qty-minus-${item.productId}`}
                      onClick={() => changeQty(item.productId, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center font-mono text-sm font-bold text-slate-800">{item.qty}</span>
                    <button
                      data-testid={`cart-qty-plus-${item.productId}`}
                      onClick={() => changeQty(item.productId, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    data-testid={`cart-remove-${item.productId}`}
                    onClick={() => removeItem(item.productId)}
                    className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 border-t border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <label className="w-20 text-xs font-medium text-slate-500">Diskon (Rp)</label>
              <input
                data-testid="cart-discount-input"
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-sm outline-none focus:border-blue-600"
              />
            </div>
            <label className={`flex items-center gap-2 text-xs font-medium ${hasDigital ? "text-slate-400" : "text-slate-600"}`}>
              <input
                data-testid="cart-tax-toggle"
                type="checkbox"
                checked={useTax && !hasDigital}
                disabled={hasDigital}
                onChange={(e) => setUseTax(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-blue-700"
              />
              PPN 11% {hasDigital && "(tidak berlaku untuk produk digital)"}
            </label>

            <div className="space-y-1.5 border-t border-dashed border-slate-200 pt-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono">{fmtRp(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Diskon</span>
                  <span className="font-mono">- {fmtRp(discount)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>PPN 11%</span>
                  <span className="font-mono">{fmtRp(tax)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1">
                <span className="text-base font-bold text-slate-900">Total</span>
                <span className="font-mono text-2xl font-bold text-blue-700" data-testid="cart-total">{fmtRp(total)}</span>
              </div>
            </div>

            <button
              data-testid="checkout-button"
              onClick={() => {
                setCheckoutOpen(true);
              }}
              disabled={cart.length === 0}
              className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Bayar Sekarang
            </button>

            <div className="border-t border-dashed border-slate-200 pt-3" data-testid="recent-transactions">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <History className="h-3.5 w-3.5" /> 5 Transaksi Terakhir
              </p>
              {transactions.length === 0 ? (
                <p className="py-2 text-center text-xs text-slate-400">Belum ada transaksi</p>
              ) : (
                <div className="space-y-1">
                  {transactions.slice(0, 5).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
                      data-testid={`recent-tx-${t.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-[11px] font-semibold text-slate-700">{t.id}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(t.date).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <span className="whitespace-nowrap font-mono text-xs font-bold text-slate-800">{fmtRp(t.total)}</span>
                      <button
                        data-testid={`recent-tx-reprint-${t.id}`}
                        onClick={() => setLastTx(t)}
                        title="Cetak Ulang Struk"
                        className="rounded-md border border-blue-200 bg-blue-50 p-1.5 text-blue-700 transition-colors hover:bg-blue-100"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {checkoutOpen && (
        <CheckoutModal
          total={total}
          cart={cart}
          discount={discount}
          tax={tax}
          subtotal={subtotal}
          targetNumber={targetNumber}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
      {lastTx && <ReceiptModal transaction={lastTx} onClose={() => setLastTx(null)} />}
    </div>
  );
}
