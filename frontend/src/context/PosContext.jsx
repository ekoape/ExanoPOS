import { createContext, useContext, useEffect, useState } from "react";
import { defaultSettings, seedUsers, seedProducts, buildSeedTransactions } from "@/data/seedData";

const PosContext = createContext(null);

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const persist = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full — ignore */
  }
};

export const PosProvider = ({ children }) => {
  const [products, setProducts] = useState(() => load("exapos_products", seedProducts));
  const [transactions, setTransactions] = useState(() => load("exapos_transactions", buildSeedTransactions()));
  const [users, setUsers] = useState(() => load("exapos_users", seedUsers));
  const [settings, setSettings] = useState(() => load("exapos_settings", defaultSettings));
  const [currentUser, setCurrentUser] = useState(() => load("exapos_auth", null));

  useEffect(() => persist("exapos_products", products), [products]);
  useEffect(() => persist("exapos_transactions", transactions), [transactions]);
  useEffect(() => persist("exapos_users", users), [users]);
  useEffect(() => persist("exapos_settings", settings), [settings]);
  useEffect(() => persist("exapos_auth", currentUser), [currentUser]);

  const login = (username, password) => {
    const user = users.find(
      (u) => (u.email.toLowerCase() === username.toLowerCase() || u.name.toLowerCase() === username.toLowerCase()) && u.password === password
    );
    if (!user) return { ok: false, error: "Username atau password salah" };
    if (!user.active) return { ok: false, error: "Akun dinonaktifkan. Hubungi Admin." };
    const { password: _pw, ...safeUser } = user;
    setCurrentUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const logout = () => setCurrentUser(null);

  const nextInvoiceId = () => {
    const d = new Date();
    const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const count = transactions.filter((t) => t.id.includes(stamp)).length + 1;
    return `INV-${stamp}-${String(count).padStart(3, "0")}`;
  };

  const addTransaction = (tx) => {
    const full = { ...tx, id: nextInvoiceId(), date: new Date().toISOString() };
    setTransactions((prev) => [full, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const item = tx.items.find((i) => i.productId === p.id);
        if (!item || p.category === "digital") return p;
        return { ...p, stock: Math.max(0, p.stock - item.qty) };
      })
    );
    return full;
  };

  const addProduct = (p) => setProducts((prev) => [...prev, { ...p, id: "p" + Date.now() }]);
  const updateProduct = (id, patch) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const deleteProduct = (id) => setProducts((prev) => prev.filter((p) => p.id !== id));

  const addUser = (u) => setUsers((prev) => [...prev, { ...u, id: "u" + Date.now(), active: true }]);
  const updateUser = (id, patch) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const saveSettings = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

  return (
    <PosContext.Provider
      value={{
        products, transactions, users, settings, currentUser,
        login, logout, addTransaction,
        addProduct, updateProduct, deleteProduct,
        addUser, updateUser, deleteUser, saveSettings,
      }}
    >
      {children}
    </PosContext.Provider>
  );
};

export const usePos = () => useContext(PosContext);
