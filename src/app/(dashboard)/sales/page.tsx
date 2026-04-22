"use client";
import { useEffect, useState } from "react";

type Sale = {
  id: number; order_number: string; order_date: string; customer_name: string;
  customer_contact: string; customer_phone: string; product_code: string; product_name: string;
  size: string; color: string; quantity: number; unit_price: number;
  status: string; delivery_date: string; notes: string;
};

const empty = {
  order_number: "", order_date: "", customer_name: "", customer_contact: "", customer_phone: "",
  product_code: "", product_name: "", size: "", color: "", quantity: 0, unit_price: 0,
  status: "受注", delivery_date: "", notes: "",
};
const statusList = ["受注", "出荷済", "入金済", "キャンセル"];
const statusColor: Record<string, string> = {
  "受注": "bg-blue-100 text-blue-800", "出荷済": "bg-amber-100 text-amber-800",
  "入金済": "bg-green-100 text-green-800", "キャンセル": "bg-red-100 text-red-800",
};

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

export default function SalesPage() {
  const [data, setData] = useState<Sale[]>([]);
  const [form, setForm] = useState<any>({ ...empty });
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterText, setFilterText] = useState("");

  const load = () => fetch("/api/sales").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.order_number || !form.customer_name) return alert("受注番号と得意先名は必須です");
    const method = editing !== null ? "PUT" : "POST";
    const body = editing !== null ? { ...form, id: editing } : form;
    await fetch("/api/sales", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setForm({ ...empty }); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch("/api/sales", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const edit = (s: Sale) => {
    const { id, ...rest } = s;
    setForm(rest); setEditing(id); setShowForm(true);
  };

  const filtered = data.filter(s => {
    if (filterStatus && s.status !== filterStatus) return false;
    if (filterText && !s.customer_name?.includes(filterText) && !s.order_number?.includes(filterText) && !s.product_name?.includes(filterText)) return false;
    return true;
  });

  const totalRevenue = filtered.reduce((sum, s) => sum + Number(s.quantity) * Number(s.unit_price), 0);

  const orderGroups = filtered.reduce<Record<string, Sale[]>>((acc, s) => {
    (acc[s.order_number] = acc[s.order_number] || []).push(s);
    return acc;
  }, {});

  const u = (field: string) => (v: string) => setForm((p: any) => ({ ...p, [field]: v }));
  const uNum = (field: string) => (v: string) => setForm((p: any) => ({ ...p, [field]: Number(v) || 0 }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">🧾 販売管理</h1>
          <p className="text-sm text-gray-500 mt-1">売上合計: ¥{totalRevenue.toLocaleString()}</p>
        </div>
        <button onClick={() => { setForm({ ...empty }); setEditing(null); setShowForm(!showForm); }}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700">
          {showForm ? "✕ 閉じる" : "＋ 新規登録"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-6">
          <h2 className="font-bold mb-4">{editing !== null ? "販売データを編集" : "販売データを新規登録"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="受注番号" value={form.order_number} onChange={u("order_number")} />
            <Field label="受注日" value={form.order_date} onChange={u("order_date")} type="date" />
            <Field label="得意先名" value={form.customer_name} onChange={u("customer_name")} />
            <Field label="得意先担当者" value={form.customer_contact} onChange={u("customer_contact")} />
            <Field label="連絡先" value={form.customer_phone} onChange={u("customer_phone")} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
              <select value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                {statusList.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <Field label="商品コード" value={form.product_code} onChange={u("product_code")} />
            <Field label="商品名" value={form.product_name} onChange={u("product_name")} />
            <Field label="サイズ" value={form.size} onChange={u("size")} />
            <Field label="カラー" value={form.color} onChange={u("color")} />
            <Field label="数量" value={form.quantity} onChange={uNum("quantity")} type="number" />
            <Field label="単価" value={form.unit_price} onChange={uNum("unit_price")} type="number" />
            <Field label="納品予定日" value={form.delivery_date} onChange={u("delivery_date")} type="date" />
            <Field label="備考" value={form.notes} onChange={u("notes")} className="md:col-span-2" />
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
        <input type="text" placeholder="🔍 得意先・受注番号・商品で検索..." value={filterText} onChange={e => setFilterText(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-72" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">全ステータス</option>
          {statusList.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <p className="text-gray-400">読み込み中...</p> : (
        <div className="space-y-4">
          {Object.entries(orderGroups).map(([orderNum, items]) => {
            const first = items[0];
            const orderTotal = items.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_price), 0);
            return (
              <div key={orderNum} className="bg-white rounded-xl border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm">{orderNum}</span>
                    <span className="text-xs text-gray-500">{first.order_date}</span>
                    <span className="text-sm font-medium">{first.customer_name}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColor[first.status] || "bg-gray-100"}`}>{first.status}</span>
                  </div>
                  <span className="font-bold text-sm">合計: ¥{orderTotal.toLocaleString()}</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b">
                      {["商品コード","商品名","サイズ","カラー","数量","単価","小計","納品予定","備考","操作"].map(h => (
                        <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(s => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-mono text-xs">{s.product_code}</td>
                        <td className="px-3 py-2">{s.product_name}</td>
                        <td className="px-3 py-2">{s.size}</td>
                        <td className="px-3 py-2">{s.color}</td>
                        <td className="px-3 py-2 text-right">{Number(s.quantity)}</td>
                        <td className="px-3 py-2 text-right">¥{Number(s.unit_price).toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-medium">¥{(Number(s.quantity) * Number(s.unit_price)).toLocaleString()}</td>
                        <td className="px-3 py-2 text-xs">{s.delivery_date}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{s.notes}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <button onClick={() => edit(s)} className="text-blue-600 hover:underline text-xs mr-2">編集</button>
                          <button onClick={() => del(s.id)} className="text-red-500 hover:underline text-xs">削除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
          {Object.keys(orderGroups).length === 0 && <p className="p-8 text-center text-gray-400">データがありません</p>}
        </div>
      )}
    </div>
  );
}
