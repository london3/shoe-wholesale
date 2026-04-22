"use client";
import { useEffect, useState } from "react";

type Product = {
  id: number; code: string; name: string; brand: string; category: string; type: string;
  sizes: string; colors: string; retail_price: number; cost_price: number; wholesale_price: number;
  supplier_code: string; supplier_name: string; status: string;
};

const empty = { code: "", name: "", brand: "", category: "メンズ", type: "ビジネス", sizes: "", colors: "", retail_price: 0, cost_price: 0, wholesale_price: 0, supplier_code: "", supplier_name: "", status: "販売中" };
const categories = ["メンズ", "レディース", "キッズ"];
const types = ["ビジネス", "パンプス", "スニーカー", "ブーツ", "ローファー", "サンダル", "ウォーキング"];
const statuses = ["販売中", "入荷待ち", "廃番"];
const statusColor: Record<string, string> = { "販売中": "bg-green-100 text-green-800", "入荷待ち": "bg-amber-100 text-amber-800", "廃番": "bg-red-100 text-red-800" };

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

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [form, setForm] = useState<any>({ ...empty });
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = () => fetch("/api/products").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.code || !form.name) return alert("商品コードと商品名は必須です");
    const method = editing !== null ? "PUT" : "POST";
    const body = editing !== null ? { ...form, id: editing } : form;
    await fetch("/api/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setForm({ ...empty }); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const edit = (p: Product) => {
    const { id, ...rest } = p;
    setForm(rest); setEditing(id); setShowForm(true);
  };

  const filtered = data.filter(p =>
    !filter || p.name.includes(filter) || p.code.includes(filter) || p.brand.includes(filter) || p.category.includes(filter)
  );

  const u = (field: string) => (v: string) => setForm((p: any) => ({ ...p, [field]: v }));
  const uNum = (field: string) => (v: string) => setForm((p: any) => ({ ...p, [field]: Number(v) || 0 }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">👟 商品管理</h1>
        <button onClick={() => { setForm({ ...empty }); setEditing(null); setShowForm(!showForm); }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
          {showForm ? "✕ 閉じる" : "＋ 新規登録"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-6">
          <h2 className="font-bold mb-4">{editing !== null ? "商品を編集" : "商品を新規登録"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="商品コード" value={form.code} onChange={u("code")} />
            <Field label="商品名" value={form.name} onChange={u("name")} />
            <Field label="ブランド" value={form.brand} onChange={u("brand")} />
            <Select label="カテゴリ" value={form.category} onChange={u("category")} options={categories} />
            <Select label="種類" value={form.type} onChange={u("type")} options={types} />
            <Select label="ステータス" value={form.status} onChange={u("status")} options={statuses} />
            <Field label="サイズ展開（/区切り）" value={form.sizes} onChange={u("sizes")} className="md:col-span-2" />
            <Field label="カラー展開（/区切り）" value={form.colors} onChange={u("colors")} />
            <Field label="上代（税抜）" value={form.retail_price} onChange={uNum("retail_price")} type="number" />
            <Field label="下代（仕入価格）" value={form.cost_price} onChange={uNum("cost_price")} type="number" />
            <Field label="卸価格" value={form.wholesale_price} onChange={uNum("wholesale_price")} type="number" />
            <Field label="仕入先コード" value={form.supplier_code} onChange={u("supplier_code")} />
            <Field label="仕入先名" value={form.supplier_name} onChange={u("supplier_name")} />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
              {editing !== null ? "更新" : "登録"}
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="bg-gray-200 px-4 py-2 rounded-lg text-sm">キャンセル</button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input type="text" placeholder="🔍 商品名・コード・ブランドで検索..." value={filter} onChange={e => setFilter(e.target.value)}
          className="w-full md:w-80 border rounded-lg px-3 py-2 text-sm" />
      </div>

      {loading ? <p className="text-gray-400">読み込み中...</p> : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["コード","商品名","カテゴリ","種類","上代","下代","卸価格","仕入先","ステータス","操作"].map(h => (
                <th key={h} className="px-3 py-3 text-left font-medium text-gray-600 whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-3 font-mono text-xs">{p.code}</td>
                  <td className="px-3 py-3 font-medium">{p.name}</td>
                  <td className="px-3 py-3">{p.category}</td>
                  <td className="px-3 py-3">{p.type}</td>
                  <td className="px-3 py-3 text-right">¥{Number(p.retail_price).toLocaleString()}</td>
                  <td className="px-3 py-3 text-right">¥{Number(p.cost_price).toLocaleString()}</td>
                  <td className="px-3 py-3 text-right font-medium">¥{Number(p.wholesale_price).toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs">{p.supplier_name}</td>
                  <td className="px-3 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[p.status] || "bg-gray-100"}`}>{p.status}</span></td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <button onClick={() => edit(p)} className="text-blue-600 hover:underline text-xs mr-3">編集</button>
                    <button onClick={() => del(p.id)} className="text-red-500 hover:underline text-xs">削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-8 text-center text-gray-400">データがありません</p>}
        </div>
      )}
    </div>
  );
}
