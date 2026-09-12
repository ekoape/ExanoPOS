import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Store, ShieldCheck, Zap, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { usePos } from "@/context/PosContext";

const rolePresets = [
  { role: "Admin", email: "admin@exapos.id", password: "admin123" },
  { role: "Kasir", email: "kasir@exapos.id", password: "kasir123" },
  { role: "Manager", email: "manager@exapos.id", password: "manager123" },
];

export default function Login() {
  const { login, settings } = usePos();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = (preset) => {
    setActivePreset(preset.role);
    setUsername(preset.email);
    setPassword(preset.password);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      const res = login(username.trim(), password);
      setLoading(false);
      if (res.ok) {
        toast.success(`Selamat datang, ${res.user.name}!`);
        navigate(res.user.role === "Kasir" ? "/kasir" : "/");
      } else {
        setError(res.error);
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <div className="hidden flex-1 flex-col justify-between bg-[#0F172A] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <Store className="h-7 w-7 text-white" />
          </div>
          <p className="font-heading text-2xl font-extrabold tracking-tight text-white">EXAPOS</p>
        </div>
        <div>
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
            Kasir modern untuk
            <br />
            <span className="text-blue-400">bisnis Anda.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            Kelola penjualan fisik, produk digital, dan pesanan online dalam satu sistem Point of Sale yang cepat dan andal.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { icon: Zap, text: "Checkout cepat dengan kalkulasi kembalian instan" },
              { icon: ReceiptText, text: "Struk thermal & rekap omset sekali klik" },
              { icon: ShieldCheck, text: "Kontrol akses Admin, Kasir, dan Manager" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/15">
                  <f.icon className="h-4 w-4 text-blue-400" />
                </div>
                {f.text}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs font-medium tracking-wider text-slate-600">{settings.watermark}</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 shadow-lg shadow-blue-500/25 lg:hidden">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl" data-testid="login-title">
              EXAPOS
            </h2>
            <p className="mt-1 text-sm text-slate-500" data-testid="login-subtitle">
              Powered by PT Exano Technology Solution
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Masuk sebagai (demo)</p>
            <div className="mb-6 grid grid-cols-3 gap-2">
              {rolePresets.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  data-testid={`login-preset-${p.role.toLowerCase()}`}
                  onClick={() => applyPreset(p)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    activePreset === p.role
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-700"
                  }`}
                >
                  {p.role}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Username / Email</label>
                <input
                  data-testid="login-username-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@exapos.id"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    data-testid="login-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-11 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    data-testid="login-toggle-password"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div data-testid="login-error" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <button
                data-testid="login-submit-button"
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Memproses..." : "Masuk ke EXAPOS"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs font-medium tracking-wider text-slate-400" data-testid="login-watermark">
            {settings.watermark}
          </p>
        </div>
      </div>
    </div>
  );
}
