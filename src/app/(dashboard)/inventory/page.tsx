"use client";
import { useEffect, useState } from "react";

type Inventory = {
  id: number; product_code: string; product_name: string; size: string; color: string;
  current_stock: number; optimal_stock: number; location: string; last_in_date: string; last_out_date: string;
};

const empty = { product_code: "", product_name: "", size: "", color: "", current_stock: 0, optimal_stock: 0, location: "倉庫A", last_in_date: "", last_out_date: "" };
const locations = ["倉庫A", "倉庫B", "倉庫C"];

function Field({ label, value, onChange, type = "text", className = "" }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>
  );
}

export default function InventoryPage() {
  const [data, setData] = useState<Inventory[]>([]);
  const [form, setForm] = useState<any>({ ...empty });
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterAlert, setFilterAlert] = useState(false);
  const [filterText, setFilterText] = useState("");

  const load = () => fetch("/api/inventory").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.product_code) return alert("商品コードは必須です");
    const method = editing !== null ? "PUT" : "POST";
    const body = editing !== null ? { ...form, id: editing } : form;
    await fetch("/api/inventory", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setForm({ ...empty }); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch("/api/inventory", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const edit = (inv: Inventory) => {
    const { id, ...rest } = inv;
    setForm(rest); setEditing(id); setShowForm(true);
  };

  const filtered = data.filter(inv => {
    if (filterAlert && Number(inv.current_stock) > Number(inv.optimal_stock)) return false;
    if (filterText && !inv.product_name?.includes(filterText) && !inv.product_code?.includes(filterText)) return false;
    return true;
  });

  const lowStockCount = data.filter(inv => Number(inv.current_stock) <= Number(inv.optimal_stock)).length;

  const u = (field: string) => (v: string) => setForm((p: any) => ({ ...p, [field]: v }));
  const uNum = (field: string) => (v: string) => setForm((p: any) => ({ ...p, [field]: Number(v) || 0 }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">📦 在庫管理</h1>
          {lowStockCount > 0 && <p className="text-sm text-red-500 mt-1">⚠ 要発注: {lowStockCount} 件</p>}
        </div>
        <button onClick={() => { setForm({ ...empty }); setEditing(null); setShowForm(!showForm); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          {showForm ? "✕ 閉じる" : "＋ 新規登録"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-6">
          <h2 className="font-bold mb-4">{editing !== null ? "在庫を編集" : "在庫を新規登録"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="商品コード" value={form.product_code} onChange={u("product_code")} />
            <Field label="商品名" value={form.product_name} onChange={u("product_name")} />
            <Field label="サイズ" value={form.size} onChange={u("size")} />
            <Field label="カラー" value={form.color} onChange={u("color")} />
            <Field label="現在庫数" value={form.current_stock} onChange={uNum("current_stock")} type="number" />
            <Field label="適正在庫数" value={form.optimal_stock} onChange={uNum("optimal_stock")} type="number" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">保管場所</label>
              <select value={form.location} onChange={e => setForm((p: any) => ({ ...p, location: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                {locations.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <Field label="最終入庫日" value={form.last_in_date} onChange={u("last_in_date")} type="date" />
            <Field label="最終出庫日" value={form.last_out_date} onChange={u("last_out_date")} type="date" />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
              {editing !== null ? "更新" : "登録"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">キャンセル</button>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4 flex-wrap">
        <input type="text" placeholder="🔍 商品名・コードで検索..." value={filterText} onChange={e => setFilterText(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-64" />
        <button onClick={() => setFilterAlert(!filterAlert)}
          className={`px-4 py-2 rounded-lg text-sm border ${filterAlert ? "bg-red-50 border-red-300 text-red-700" : "bg-white"}`}>
          {filterAlert ? "⚠ 要発注のみ表示中" : "要発注のみ表示"}
        </button>
      </div>

      {loading ? <p className="text-gray-400">読み込み中...</p> : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["コード","商品名","サイズ","カラー","現在庫数","適正在庫","ステータス","保管場所","最終入庫","最終出庫","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const low = Number(inv.current_stock) <= Number(inv.optimal_stock);
                return (
                  <tr key={inv.id} className={`border-b hover:bg-gray-50 ${low ? "bg-red-50" : ""}`}>
                    <td className="px-3 py-3 font-mono text-xs">{inv.product_code}</td>
                    <td className="px-3 py-3 font-medium">{inv.product_name}</td>
                    <td className="px-3 py-3">{inv.size}</td>
                    <td className="px-3 py-3">{inv.color}</td>
                    <td className="px-3 py-3 text-right font-bold">{Number(inv.current_stock)}</td>
                    <td className="px-3 py-3 text-right">{Number(inv.optimal_stock)}</td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${low ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {low ? "要発注" : "適正"}
                      </span>
                    </td>
                    <td className="px-3 py-3">{inv.location}</td>
                    <td className="px-3 py-3 text-xs">{inv.last_in_date}</td>
                    <td className="px-3 py-3 text-xs">{inv.last_out_date}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button onClick={() => edit(inv)} className="text-blue-600 hover:underline text-xs mr-3">編集</button>
                      <button onClick={() => del(inv.id)} className="text-red-500 hover:underline text-xs">削除</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-8 text-center text-gray-400">データがありません</p>}
        </div>
      )}
    </div>
  );
}
