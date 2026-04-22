import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "📊" },
  { href: "/suppliers", label: "仕入先管理", icon: "🏢" },
  { href: "/products", label: "商品管理", icon: "👟" },
  { href: "/inventory", label: "在庫管理", icon: "📦" },
  { href: "/sales", label: "販売管理", icon: "🧾" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-slate-800 text-white flex-shrink-0 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold">👟 靴卸売管理</h1>
          <p className="text-xs text-slate-400 mt-1">販売在庫管理システム</p>
        </div>
        <nav className="p-2 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t border-slate-700">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
