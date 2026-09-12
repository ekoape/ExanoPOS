import { useState } from "react";
import {
  Users, Package, Store, Plus, Pencil, Trash2, X, AlertTriangle, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { usePos } from "@/context/PosContext";
import { fmtRp } from "@/utils/format";

const tabs = [
  { key: "akun", label: "Akses Akun", icon: Users, testId: "settings-tab-akun" },
  { key: "barang", label: "Barang & Stok", icon: Package, testId: "settings-tab-barang" },
  { key: "info", label: "Info Aplikasi POS", icon: Store, testId: "settings-tab-info" },
];

const catBadge = {
  physical: "bg-blue-50 text-blue-700 border-blue-200",
  digital: "bg-purple-50 text-purple-700 border-purple-200",
  online: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
const catLabel = { physical: "Fisik", digital: "Digital", online: "Online" };

const Modal = ({ title, onClose, children, testId }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm" onClick={onClose} data-testid={testId}>
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const inputCls =
  "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

const Field = ({ label, children }) => (
  <div>
    <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
    {children}
  </div>
);

// ---------- Akses Akun ----------
const emptyUser = { name: "", email: "", password: "", role: "Kasir" };

const UsersSection = () => {
  const { users, addUser, updateUser, deleteUser } = usePos();
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', data }
  const [form, setForm] = useState(emptyUser);

  const openAdd = () => {
    setForm(emptyUser);
    setModal({ mode: "add" });
  };
  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: u.password, role: u.role });
    setModal({ mode: "edit", id: u.id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Semua field wajib diisi");
      return;
    }
    if (modal.mode === "add") {
      addUser(form);
      toast.success("Pengguna berhasil ditambahkan");
    } else {
      updateUser(modal.id, form);
      toast.success("Pengguna berhasil diperbarui");
    }
    setModal(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{users.length} akun terdaftar</p>
        <button
          data-testid="add-user-button"
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" /> Tambah Pengguna
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm" data-testid="users-table">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium">Nama</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-100 bg-white last:border-0 hover:bg-slate-50" data-testid={`user-row-${u.id}`}>
                <td className="px-5 py-3.5 font-semibold text-slate-800">{u.name}</td>
                <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      u.role === "Admin"
                        ? "bg-indigo-50 text-indigo-700"
                        : u.role === "Manager"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    data-testid={`user-status-toggle-${u.id}`}
                    onClick={() => {
                      updateUser(u.id, { active: !u.active });
                      toast.success(`Akun ${u.name} ${u.active ? "dinonaktifkan" : "diaktifkan"}`);
                    }}
                    className={`relative h-6 w-11 rounded-full transition-colors ${u.active ? "bg-emerald-500" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${u.active ? "left-[22px]" : "left-0.5"}`}
                    />
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <button
                      data-testid={`user-edit-${u.id}`}
                      onClick={() => openEdit(u)}
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      data-testid={`user-delete-${u.id}`}
                      onClick={() => {
                        deleteUser(u.id);
                        toast.success(`Pengguna ${u.name} dihapus`);
                      }}
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Tambah Pengguna" : "Edit Pengguna"} onClose={() => setModal(null)} testId="user-form-modal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nama Lengkap">
              <input data-testid="user-form-name" className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama karyawan" />
            </Field>
            <Field label="Email">
              <input data-testid="user-form-email" type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exapos.id" />
            </Field>
            <Field label="Password">
              <input data-testid="user-form-password" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password login" />
            </Field>
            <Field label="Role / Hak Akses">
              <select data-testid="user-form-role" className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="Admin">Admin — akses penuh</option>
                <option value="Manager">Manager — dashboard & setting</option>
                <option value="Kasir">Kasir — hanya transaksi</option>
              </select>
            </Field>
            <button data-testid="user-form-submit" type="submit" className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800">
              {modal.mode === "add" ? "Tambah Pengguna" : "Simpan Perubahan"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ---------- Manajemen Barang & Stok ----------
const emptyProduct = { code: "", name: "", category: "physical", price: 0, stock: 0, minStock: 5 };

const InventorySection = () => {
  const { products, addProduct, updateProduct, deleteProduct } = usePos();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [filterCat, setFilterCat] = useState("all");

  const openAdd = () => {
    setForm(emptyProduct);
    setModal({ mode: "add" });
  };
  const openEdit = (p) => {
    setForm({ code: p.code, name: p.name, category: p.category, price: p.price, stock: p.stock, minStock: p.minStock });
    setModal({ mode: "edit", id: p.id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.code || !form.name || form.price <= 0) {
      toast.error("Kode, nama, dan harga wajib diisi dengan benar");
      return;
    }
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), minStock: Number(form.minStock) };
    if (modal.mode === "add") {
      addProduct(payload);
      toast.success("Produk berhasil ditambahkan");
    } else {
      updateProduct(modal.id, payload);
      toast.success("Stok / produk berhasil diperbarui");
    }
    setModal(null);
  };

  const visible = products.filter((p) => filterCat === "all" || p.category === filterCat);
  const lowCount = products.filter((p) => p.category !== "digital" && p.stock <= p.minStock).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {lowCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700" data-testid="low-stock-alert">
            <AlertTriangle className="h-3.5 w-3.5" /> {lowCount} produk stok menipis
          </span>
        )}
        <select
          data-testid="inventory-filter-category"
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
        >
          <option value="all">Semua Kategori</option>
          <option value="physical">Produk Fisik</option>
          <option value="digital">Produk Digital</option>
          <option value="online">Produk Online</option>
        </select>
        <button
          data-testid="add-product-button"
          onClick={openAdd}
          className="ml-auto flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm" data-testid="inventory-table">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3 font-medium">Kode</th>
              <th className="px-5 py-3 font-medium">Nama Produk</th>
              <th className="px-5 py-3 font-medium">Tipe</th>
              <th className="px-5 py-3 text-right font-medium">Harga</th>
              <th className="px-5 py-3 text-right font-medium">Stok</th>
              <th className="px-5 py-3 text-right font-medium">Min. Stok</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => {
              const low = p.category !== "digital" && p.stock <= p.minStock;
              return (
                <tr key={p.id} className="border-b border-slate-100 bg-white last:border-0 hover:bg-slate-50" data-testid={`inventory-row-${p.id}`}>
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-600">{p.code}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{p.name}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${catBadge[p.category]}`}>{catLabel[p.category]}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-right font-mono text-slate-800">{fmtRp(p.price)}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-800">{p.category === "digital" ? "∞" : p.stock}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-500">{p.minStock}</td>
                  <td className="px-5 py-3.5">
                    {p.category === "digital" ? (
                      <span className="text-xs font-medium text-slate-400">Selalu tersedia</span>
                    ) : p.stock <= 0 ? (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">Habis</span>
                    ) : low ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">Menipis</span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">Aman</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button
                        data-testid={`product-edit-${p.id}`}
                        onClick={() => openEdit(p)}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        data-testid={`product-delete-${p.id}`}
                        onClick={() => {
                          deleteProduct(p.id);
                          toast.success(`Produk ${p.name} dihapus`);
                        }}
                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Tambah Produk" : "Edit Produk"} onClose={() => setModal(null)} testId="product-form-modal">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kode Produk">
                <input data-testid="product-form-code" className={inputCls} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="PHY-009" />
              </Field>
              <Field label="Tipe">
                <select data-testid="product-form-category" className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="physical">Fisik</option>
                  <option value="digital">Digital</option>
                  <option value="online">Online</option>
                </select>
              </Field>
            </div>
            <Field label="Nama Produk">
              <input data-testid="product-form-name" className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama produk" />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Harga (Rp)">
                <input data-testid="product-form-price" type="number" min="0" className={inputCls} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </Field>
              <Field label="Stok">
                <input data-testid="product-form-stock" type="number" min="0" className={inputCls} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </Field>
              <Field label="Min. Stok">
                <input data-testid="product-form-minstock" type="number" min="0" className={inputCls} value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
              </Field>
            </div>
            <button data-testid="product-form-submit" type="submit" className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800">
              {modal.mode === "add" ? "Tambah Produk" : "Simpan Perubahan"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

// ---------- Pengaturan Info Aplikasi ----------
const AppInfoSection = () => {
  const { settings, saveSettings } = usePos();
  const [form, setForm] = useState({ ...settings });

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings(form);
    toast.success("Pengaturan aplikasi berhasil disimpan");
  };

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-5" data-testid="app-info-form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama Toko">
          <input data-testid="settings-store-name" className={inputCls} value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
        </Field>
        <Field label="No. Telepon">
          <input data-testid="settings-phone" className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
      </div>
      <Field label="Alamat Lengkap">
        <textarea
          data-testid="settings-address"
          rows={2}
          className={inputCls}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </Field>
      <Field label="Teks Footer Struk">
        <input data-testid="settings-receipt-footer" className={inputCls} value={form.receiptFooter} onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })} />
      </Field>
      <Field label="Watermark Aplikasi">
        <input data-testid="settings-watermark" className={inputCls} value={form.watermark} onChange={(e) => setForm({ ...form, watermark: e.target.value })} />
        <p className="mt-1.5 text-xs text-slate-400">
          Ditampilkan di sidebar, footer halaman, dan bagian bawah struk belanja.
        </p>
      </Field>
      <button data-testid="save-settings-button" type="submit" className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800">
        Simpan Pengaturan
      </button>
    </form>
  );
};

// ---------- Page ----------
export default function Setting() {
  const { currentUser } = usePos();
  const [tab, setTab] = useState("akun");

  if (currentUser?.role === "Kasir") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" data-testid="setting-access-denied">
        <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Akses Ditolak</h2>
          <p className="mt-2 text-sm text-slate-500">
            Menu Setting hanya dapat diakses oleh role Admin atau Manager. Hubungi administrator untuk mengubah hak akses Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="setting-page">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Setting</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola akses akun, barang & stok, serta informasi aplikasi POS</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
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

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        {tab === "akun" && <UsersSection />}
        {tab === "barang" && <InventorySection />}
        {tab === "info" && <AppInfoSection />}
      </div>
    </div>
  );
}
