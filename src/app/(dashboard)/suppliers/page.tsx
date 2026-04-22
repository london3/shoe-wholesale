"use client";
import { useEffect, useState } from "react";

type Supplier = {
  id: number; code: string; name: string; contact_person: string;
  phone: string; email: string; address: string; payment_terms: string; notes: string;
};

const empty: Omit<Supplier, "id"> = { code: "", name: "", contact_person: "", phone: "", email: "", address: "", payment_terms: "月末締め翌月払い", notes: "" };
const termOptions = ["月末締め翌月払い", "20日締め翌月払い", "月末締め翌々月払い", "都度払い"];

function Field({ label, value, onChange, type = "text", className = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>
  );
}

export default function SuppliersPage() {
  const [data, setData] = useState<Supplier[]>([]);
  const [form, setForm] = useState<any>({ ...empty });
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => fetch("/api/suppliers").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.code || !form.name) return alert("仕入先コードと仕入先名は必須です");
    const method = editing !== null ? "PUT" : "POST";
    const body = editing !== null ? { ...form, id: editing } : form;
    await fetch("/api/suppliers", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setForm({ ...empty }); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: number) => {
    if (!confirm("削除しますか？")) return;
    await fetch("/api/suppliers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const edit = (s: Supplier) => {
    setForm({ code: s.code, name: s.name, contact_person: s.contact_person, phone: s.phone, email: s.email, address: s.address, payment_terms: s.payment_terms, notes: s.notes });
    setEditing(s.id); setShowForm(true);
  };

  const u = (field: string) => (v: string) => setForm((p: any) => ({ ...p, [field]: v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🏢 仕入先管理</h1>
        <button onClick={() => { setForm({ ...empty }); setEditing(null); setShowForm(!showForm); }}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700">
          {showForm ? "✕ 閉じる" : "＋ 新規登録"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border p-5 mb-6">
          <h2 className="font-bold mb-4">{editing !== null ? "仕入先を編集" : "仕入先を新規登録"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="仕入先コード" value={form.code} onChange={u("code")} />
            <Field label="仕入先名" value={form.name} onChange={u("name")} />
            <Field label="担当者名" value={form.contact_person} onChange={u("contact_person")} />
            <Field label="電話番号" value={form.phone} onChange={u("phone")} />
            <Field label="メールアドレス" value={form.email} onChange={u("email")} type="email" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">取引条件</label>
              <select value={form.payment_terms} onChange={e => setForm((p: any) => ({ ...p, payment_terms: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                {termOptions.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <Field label="住所" value={form.address} onChange={u("address")} className="md:col-span-2" />
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

      {loading ? <p className="text-gray-400">読み込み中...</p> : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>{["コード","仕入先名","担当者","電話番号","メール","取引条件","操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-600">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {data.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.code}</td>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.contact_person}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3 text-xs">{s.email}</td>
                  <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{s.payment_terms}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => edit(s)} className="text-blue-600 hover:underline text-xs mr-3">編集</button>
                    <button onClick={() => del(s.id)} className="text-red-500 hover:underline text-xs">削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="p-8 text-center text-gray-400">データがありません</p>}
        </div>
      )}
    </div>
  );
}
