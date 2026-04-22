import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [suppliers, products, inventory, sales] = await Promise.all([
      db.execute("SELECT COUNT(*) as c FROM suppliers"),
      db.execute("SELECT COUNT(*) as c FROM products"),
      db.execute("SELECT SUM(current_stock) as total, COUNT(*) as rows FROM inventory"),
      db.execute("SELECT COUNT(DISTINCT order_number) as orders, SUM(quantity * unit_price) as revenue FROM sales"),
    ]);
    const lowStock = await db.execute("SELECT COUNT(*) as c FROM inventory WHERE current_stock <= optimal_stock");
    const pendingOrders = await db.execute("SELECT COUNT(DISTINCT order_number) as c FROM sales WHERE status = '受注'");
    return {
      suppliers: Number(suppliers.rows[0].c),
      products: Number(products.rows[0].c),
      totalStock: Number(inventory.rows[0].total) || 0,
      inventoryRows: Number(inventory.rows[0].rows),
      orders: Number(sales.rows[0].orders),
      revenue: Number(sales.rows[0].revenue) || 0,
      lowStock: Number(lowStock.rows[0].c),
      pendingOrders: Number(pendingOrders.rows[0].c),
    };
  } catch {
    return null;
  }
}

export default async function Dashboard() {
  const stats = await getStats();

  if (!stats) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-2xl font-bold mb-4">👟 靴卸売 販売在庫管理</h1>
        <p className="text-gray-600 mb-6">データベースが未設定です。下のボタンでテーブル作成とサンプルデータの投入を行います。</p>
        <form action="/api/seed" method="POST">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors">
            データベースを初期設定する
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4">※ .env に TURSO_DATABASE_URL と TURSO_AUTH_TOKEN を設定してください</p>
      </div>
    );
  }

  const cards = [
    { label: "仕入先", value: `${stats.suppliers} 社`, icon: "🏢", href: "/suppliers", color: "bg-teal-50 border-teal-200" },
    { label: "商品数", value: `${stats.products} 点`, icon: "👟", href: "/products", color: "bg-purple-50 border-purple-200" },
    { label: "在庫総数", value: `${stats.totalStock.toLocaleString()} 足`, icon: "📦", href: "/inventory", color: "bg-blue-50 border-blue-200" },
    { label: "受注件数", value: `${stats.orders} 件`, icon: "🧾", href: "/sales", color: "bg-orange-50 border-orange-200" },
  ];

  const alerts = [
    { label: "要発注（在庫不足）", value: `${stats.lowStock} 件`, color: stats.lowStock > 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50" },
    { label: "未出荷の受注", value: `${stats.pendingOrders} 件`, color: stats.pendingOrders > 0 ? "text-amber-600 bg-amber-50" : "text-green-600 bg-green-50" },
    { label: "売上合計", value: `¥${stats.revenue.toLocaleString()}`, color: "text-blue-700 bg-blue-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`block p-5 rounded-xl border ${c.color} hover:shadow-md transition-shadow`}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="text-xl font-bold mt-1">{c.value}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">アラート・サマリー</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {alerts.map((a) => (
          <div key={a.label} className={`p-4 rounded-xl ${a.color}`}>
            <div className="text-sm opacity-70">{a.label}</div>
            <div className="text-2xl font-bold mt-1">{a.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="font-bold mb-2">初期設定</h2>
        <p className="text-sm text-gray-500 mb-3">サンプルデータを再投入する場合はこちら（既存データがある場合はスキップされます）</p>
        <form action="/api/seed" method="POST">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
            サンプルデータ投入
          </button>
        </form>
      </div>
    </div>
  );
}
