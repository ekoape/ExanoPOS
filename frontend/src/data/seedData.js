export const defaultSettings = {
  storeName: "Toko Exano Tech",
  address: "Jl. Teknologi Raya No. 88, Jakarta Selatan 12190",
  phone: "021-555-0199",
  receiptFooter: "Terima kasih telah berbelanja di Toko Exano Tech!",
  watermark: "Powered by PT Exano Technology Solution",
};

export const seedUsers = [
  { id: "u1", name: "Admin Exano", email: "exanoadm@gmail.com", password: "Exano#2026!", role: "Admin", active: true },
  { id: "u2", name: "Kasir EXAPOS", email: "kasir@exapos.id", password: "Kasir#2026!", role: "Kasir", active: true },
  { id: "u3", name: "Manager EXAPOS", email: "manager@exapos.id", password: "Manager#2026!", role: "Manager", active: true },
];

export const seedProducts = [
  // Physical
  { id: "p1", code: "PHY-001", name: "Kopi Espresso", category: "physical", price: 18000, stock: 40, minStock: 10 },
  { id: "p2", code: "PHY-002", name: "Cafe Latte", category: "physical", price: 24000, stock: 35, minStock: 10 },
  { id: "p3", code: "PHY-003", name: "Cappuccino", category: "physical", price: 25000, stock: 28, minStock: 10 },
  { id: "p4", code: "PHY-004", name: "Matcha Latte", category: "physical", price: 26000, stock: 8, minStock: 10 },
  { id: "p5", code: "PHY-005", name: "Croissant Butter", category: "physical", price: 20000, stock: 25, minStock: 8 },
  { id: "p6", code: "PHY-006", name: "Kentang Goreng", category: "physical", price: 18000, stock: 30, minStock: 10 },
  { id: "p7", code: "PHY-007", name: "Kaos Polos EXA", category: "physical", price: 75000, stock: 15, minStock: 5 },
  { id: "p8", code: "PHY-008", name: "Tumbler Exano", category: "physical", price: 95000, stock: 4, minStock: 5 },
  // Digital
  { id: "d1", code: "DIG-001", name: "Pulsa 25.000", category: "digital", price: 27000, stock: 999, minStock: 0 },
  { id: "d2", code: "DIG-002", name: "Pulsa 50.000", category: "digital", price: 52000, stock: 999, minStock: 0 },
  { id: "d3", code: "DIG-003", name: "Pulsa 100.000", category: "digital", price: 102000, stock: 999, minStock: 0 },
  { id: "d4", code: "DIG-004", name: "Paket Data 10GB", category: "digital", price: 55000, stock: 999, minStock: 0 },
  { id: "d5", code: "DIG-005", name: "Paket Data 25GB", category: "digital", price: 110000, stock: 999, minStock: 0 },
  { id: "d6", code: "DIG-006", name: "Token PLN 50.000", category: "digital", price: 51500, stock: 999, minStock: 0 },
  { id: "d7", code: "DIG-007", name: "Token PLN 100.000", category: "digital", price: 101500, stock: 999, minStock: 0 },
  { id: "d8", code: "DIG-008", name: "Voucher Game 100K", category: "digital", price: 108000, stock: 999, minStock: 0 },
  // Online
  { id: "o1", code: "ONL-001", name: "Bundling Kopi + Croissant", category: "online", price: 40000, stock: 12, minStock: 5 },
  { id: "o2", code: "ONL-002", name: "Keyboard Wireless", category: "online", price: 185000, stock: 6, minStock: 3 },
  { id: "o3", code: "ONL-003", name: "Mouse Bluetooth", category: "online", price: 95000, stock: 9, minStock: 3 },
  { id: "o4", code: "ONL-004", name: "Hoodie EXA Signature", category: "online", price: 210000, stock: 3, minStock: 5 },
];

const daysAgo = (n, hour = 10, minute = 15) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const todayStamp = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
};

export const buildSeedTransactions = () => [
  {
    id: `INV-${todayStamp()}-003`,
    date: daysAgo(0, 14, 32),
    customer: "Walk-in Customer",
    type: "physical",
    cashier: "Sari Wulandari",
    items: [
      { productId: "p2", name: "Cafe Latte", price: 24000, qty: 2 },
      { productId: "p5", name: "Croissant Butter", price: 20000, qty: 1 },
    ],
    subtotal: 68000, discount: 0, tax: 7480, total: 75480,
    payment: "QRIS", paid: 75480, change: 0,
  },
  {
    id: `INV-${todayStamp()}-002`,
    date: daysAgo(0, 11, 5),
    customer: "0812-3456-7890",
    type: "digital",
    cashier: "Sari Wulandari",
    items: [{ productId: "d2", name: "Pulsa 50.000", price: 52000, qty: 1, note: "0812-3456-7890" }],
    subtotal: 52000, discount: 0, tax: 0, total: 52000,
    payment: "Tunai", paid: 60000, change: 8000,
  },
  {
    id: `INV-${todayStamp()}-001`,
    date: daysAgo(0, 9, 18),
    customer: "Shopee Order #SPX8821",
    type: "online",
    cashier: "Andi Pratama",
    items: [{ productId: "o2", name: "Keyboard Wireless", price: 185000, qty: 1 }],
    subtotal: 185000, discount: 10000, tax: 19250, total: 194250,
    payment: "Transfer", paid: 194250, change: 0,
  },
  {
    id: "INV-" + daysAgo(1).slice(0, 10).replaceAll("-", "") + "-002",
    date: daysAgo(1, 16, 44),
    customer: "Walk-in Customer",
    type: "physical",
    cashier: "Sari Wulandari",
    items: [
      { productId: "p1", name: "Kopi Espresso", price: 18000, qty: 3 },
      { productId: "p6", name: "Kentang Goreng", price: 18000, qty: 2 },
    ],
    subtotal: 90000, discount: 0, tax: 9900, total: 99900,
    payment: "Tunai", paid: 100000, change: 100,
  },
  {
    id: "INV-" + daysAgo(1).slice(0, 10).replaceAll("-", "") + "-001",
    date: daysAgo(1, 10, 2),
    customer: "Tokopedia Order #TKP114",
    type: "online",
    cashier: "Andi Pratama",
    items: [{ productId: "o1", name: "Bundling Kopi + Croissant", price: 40000, qty: 2 }],
    subtotal: 80000, discount: 0, tax: 8800, total: 88800,
    payment: "QRIS", paid: 88800, change: 0,
  },
  {
    id: "INV-" + daysAgo(2).slice(0, 10).replaceAll("-", "") + "-004",
    date: daysAgo(2, 19, 21),
    customer: "0813-9876-5432",
    type: "digital",
    cashier: "Sari Wulandari",
    items: [{ productId: "d6", name: "Token PLN 50.000", price: 51500, qty: 1, note: "IDPEL 531234567890" }],
    subtotal: 51500, discount: 0, tax: 0, total: 51500,
    payment: "Tunai", paid: 55000, change: 3500,
  },
  {
    id: "INV-" + daysAgo(2).slice(0, 10).replaceAll("-", "") + "-002",
    date: daysAgo(2, 13, 9),
    customer: "Walk-in Customer",
    type: "physical",
    cashier: "Sari Wulandari",
    items: [
      { productId: "p3", name: "Cappuccino", price: 25000, qty: 2 },
      { productId: "p4", name: "Matcha Latte", price: 26000, qty: 1 },
    ],
    subtotal: 76000, discount: 5000, tax: 7810, total: 78810,
    payment: "QRIS", paid: 78810, change: 0,
  },
  {
    id: "INV-" + daysAgo(4).slice(0, 10).replaceAll("-", "") + "-003",
    date: daysAgo(4, 15, 37),
    customer: "Lazada Order #LZD5541",
    type: "online",
    cashier: "Budi Santoso",
    items: [{ productId: "o4", name: "Hoodie EXA Signature", price: 210000, qty: 1 }],
    subtotal: 210000, discount: 0, tax: 23100, total: 233100,
    payment: "Transfer", paid: 233100, change: 0,
  },
  {
    id: "INV-" + daysAgo(5).slice(0, 10).replaceAll("-", "") + "-001",
    date: daysAgo(5, 8, 55),
    customer: "0857-1122-3344",
    type: "digital",
    cashier: "Sari Wulandari",
    items: [{ productId: "d5", name: "Paket Data 25GB", price: 110000, qty: 1, note: "0857-1122-3344" }],
    subtotal: 110000, discount: 0, tax: 0, total: 110000,
    payment: "Tunai", paid: 110000, change: 0,
  },
  {
    id: "INV-" + daysAgo(7).slice(0, 10).replaceAll("-", "") + "-005",
    date: daysAgo(7, 17, 12),
    customer: "Walk-in Customer",
    type: "physical",
    cashier: "Andi Pratama",
    items: [
      { productId: "p7", name: "Kaos Polos EXA", price: 75000, qty: 2 },
      { productId: "p8", name: "Tumbler Exano", price: 95000, qty: 1 },
    ],
    subtotal: 245000, discount: 15000, tax: 25300, total: 255300,
    payment: "Transfer", paid: 255300, change: 0,
  },
  {
    id: "INV-" + daysAgo(9).slice(0, 10).replaceAll("-", "") + "-002",
    date: daysAgo(9, 12, 48),
    customer: "Walk-in Customer",
    type: "physical",
    cashier: "Sari Wulandari",
    items: [{ productId: "p2", name: "Cafe Latte", price: 24000, qty: 4 }],
    subtotal: 96000, discount: 0, tax: 10560, total: 106560,
    payment: "Tunai", paid: 110000, change: 3440,
  },
  {
    id: "INV-" + daysAgo(12).slice(0, 10).replaceAll("-", "") + "-001",
    date: daysAgo(12, 10, 30),
    customer: "0896-7788-9900",
    type: "digital",
    cashier: "Budi Santoso",
    items: [{ productId: "d8", name: "Voucher Game 100K", price: 108000, qty: 1, note: "User ID: exano_gamer" }],
    subtotal: 108000, discount: 0, tax: 0, total: 108000,
    payment: "QRIS", paid: 108000, change: 0,
  },
];
