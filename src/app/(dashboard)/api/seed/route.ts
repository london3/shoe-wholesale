import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await db.batch([
      `CREATE TABLE IF NOT EXISTS suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        payment_terms TEXT,
        notes TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        brand TEXT,
        category TEXT,
        type TEXT,
        sizes TEXT,
        colors TEXT,
        retail_price INTEGER DEFAULT 0,
        cost_price INTEGER DEFAULT 0,
        wholesale_price INTEGER DEFAULT 0,
        supplier_code TEXT,
        supplier_name TEXT,
        status TEXT DEFAULT '販売中'
      )`,
      `CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_code TEXT NOT NULL,
        product_name TEXT,
        size TEXT,
        color TEXT,
        current_stock INTEGER DEFAULT 0,
        optimal_stock INTEGER DEFAULT 0,
        location TEXT,
        last_in_date TEXT,
        last_out_date TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL,
        order_date TEXT,
        customer_name TEXT,
        customer_contact TEXT,
        customer_phone TEXT,
        product_code TEXT,
        product_name TEXT,
        size TEXT,
        color TEXT,
        quantity INTEGER DEFAULT 0,
        unit_price INTEGER DEFAULT 0,
        status TEXT DEFAULT '受注',
        delivery_date TEXT,
        notes TEXT
      )`,
    ]);

    const suppCount = await db.execute("SELECT COUNT(*) as c FROM suppliers");
    if (Number(suppCount.rows[0].c) === 0) {
      await db.batch([
        { sql: "INSERT INTO suppliers (code,name,contact_person,phone,email,address,payment_terms,notes) VALUES (?,?,?,?,?,?,?,?)", args: ["S001","東京シューズ株式会社","田中太郎","03-1234-5678","tanaka@tokyo-shoes.co.jp","東京都台東区浅草1-2-3","月末締め翌月払い","主力仕入先"] },
        { sql: "INSERT INTO suppliers (code,name,contact_person,phone,email,address,payment_terms,notes) VALUES (?,?,?,?,?,?,?,?)", args: ["S002","オオサカレザー株式会社","山本花子","06-9876-5432","yamamoto@osaka-leather.co.jp","大阪府大阪市中央区本町4-5-6","月末締め翌月払い","革靴専門"] },
        { sql: "INSERT INTO suppliers (code,name,contact_person,phone,email,address,payment_terms,notes) VALUES (?,?,?,?,?,?,?,?)", args: ["S003","株式会社フットウェアジャパン","佐藤健一","045-111-2222","sato@footwear-jp.co.jp","神奈川県横浜市中区海岸通7-8-9","20日締め翌月払い","スニーカー中心"] },
        { sql: "INSERT INTO suppliers (code,name,contact_person,phone,email,address,payment_terms,notes) VALUES (?,?,?,?,?,?,?,?)", args: ["S004","九州靴工房","中村美咲","092-333-4444","nakamura@kyushu-kutsu.co.jp","福岡県福岡市博多区博多駅前10-11","都度払い","小ロット対応可"] },
        { sql: "INSERT INTO suppliers (code,name,contact_person,phone,email,address,payment_terms,notes) VALUES (?,?,?,?,?,?,?,?)", args: ["S005","イタリアインポート株式会社","鈴木一郎","03-5555-6666","suzuki@italia-import.co.jp","東京都港区南青山12-13-14","月末締め翌々月払い","インポート革靴"] },
      ]);

      await db.batch([
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-001","クラシックビジネスシューズ","東京シューズ","メンズ","ビジネス","24.5/25.0/25.5/26.0/26.5/27.0","ブラック/ブラウン",15000,6000,9000,"S001","東京シューズ株式会社","販売中"] },
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-002","レディースパンプス エレガント","オオサカレザー","レディース","パンプス","22.0/22.5/23.0/23.5/24.0/24.5","ブラック/ベージュ/レッド",12000,4800,7200,"S002","オオサカレザー株式会社","販売中"] },
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-003","デイリースニーカー ライト","フットウェアJP","メンズ","スニーカー","25.0/25.5/26.0/26.5/27.0/27.5/28.0","ホワイト/ネイビー/グレー",8800,3500,5300,"S003","株式会社フットウェアジャパン","販売中"] },
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-004","キッズスニーカー アクティブ","フットウェアJP","キッズ","スニーカー","18.0/19.0/20.0/21.0/22.0","レッド/ブルー/ピンク",5500,2200,3300,"S003","株式会社フットウェアジャパン","販売中"] },
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-005","イタリアンレザーローファー","イタリアインポート","メンズ","ローファー","25.0/25.5/26.0/26.5/27.0","ダークブラウン/ブラック",28000,11200,16800,"S005","イタリアインポート株式会社","販売中"] },
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-006","ショートブーツ ウィンター","オオサカレザー","レディース","ブーツ","22.5/23.0/23.5/24.0/24.5","ブラック/ダークブラウン",18000,7200,10800,"S002","オオサカレザー株式会社","入荷待ち"] },
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-007","ウォーキングシューズ コンフォート","九州靴工房","メンズ","ウォーキング","24.5/25.0/25.5/26.0/26.5/27.0","ブラック/ブラウン/ネイビー",9800,3900,5900,"S004","九州靴工房","販売中"] },
        { sql: "INSERT INTO products (code,name,brand,category,type,sizes,colors,retail_price,cost_price,wholesale_price,supplier_code,supplier_name,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", args: ["SH-008","レディースローヒールパンプス","東京シューズ","レディース","パンプス","22.0/22.5/23.0/23.5/24.0","ブラック/ネイビー/ベージュ",10000,4000,6000,"S001","東京シューズ株式会社","販売中"] },
      ]);

      const invData = [
        ["SH-001","クラシックビジネスシューズ","25.0","ブラック",45,20,"倉庫A","2026-04-10","2026-04-18"],
        ["SH-001","クラシックビジネスシューズ","25.5","ブラック",30,20,"倉庫A","2026-04-10","2026-04-17"],
        ["SH-001","クラシックビジネスシューズ","26.0","ブラウン",12,15,"倉庫A","2026-03-25","2026-04-15"],
        ["SH-002","レディースパンプス エレガント","23.0","ブラック",25,15,"倉庫B","2026-04-05","2026-04-20"],
        ["SH-002","レディースパンプス エレガント","23.5","ベージュ",8,15,"倉庫B","2026-03-20","2026-04-19"],
        ["SH-002","レディースパンプス エレガント","24.0","レッド",5,10,"倉庫B","2026-03-15","2026-04-18"],
        ["SH-003","デイリースニーカー ライト","26.0","ホワイト",60,30,"倉庫A","2026-04-12","2026-04-20"],
        ["SH-003","デイリースニーカー ライト","27.0","ネイビー",18,20,"倉庫A","2026-04-01","2026-04-16"],
        ["SH-004","キッズスニーカー アクティブ","20.0","レッド",40,25,"倉庫C","2026-04-08","2026-04-15"],
        ["SH-004","キッズスニーカー アクティブ","19.0","ブルー",3,15,"倉庫C","2026-03-10","2026-04-20"],
        ["SH-005","イタリアンレザーローファー","26.0","ダークブラウン",10,10,"倉庫A","2026-04-15","2026-04-19"],
        ["SH-005","イタリアンレザーローファー","26.5","ブラック",7,10,"倉庫A","2026-04-15","2026-04-18"],
        ["SH-007","ウォーキングシューズ コンフォート","25.5","ブラック",35,20,"倉庫B","2026-04-11","2026-04-17"],
        ["SH-007","ウォーキングシューズ コンフォート","26.0","ネイビー",22,20,"倉庫B","2026-04-11","2026-04-14"],
        ["SH-008","レディースローヒールパンプス","23.0","ブラック",28,20,"倉庫B","2026-04-09","2026-04-19"],
        ["SH-008","レディースローヒールパンプス","23.5","ネイビー",15,15,"倉庫B","2026-04-09","2026-04-16"],
        ["SH-008","レディースローヒールパンプス","22.5","ベージュ",4,10,"倉庫B","2026-03-18","2026-04-20"],
      ];
      await db.batch(invData.map(r => ({
        sql: "INSERT INTO inventory (product_code,product_name,size,color,current_stock,optimal_stock,location,last_in_date,last_out_date) VALUES (?,?,?,?,?,?,?,?,?)",
        args: r,
      })));

      const salesData = [
        ["ORD-0001","2026-04-01","靴のマルヤマ 渋谷店","丸山浩二","03-1111-2222","SH-001","クラシックビジネスシューズ","25.0","ブラック",10,9000,"入金済","2026-04-05",""],
        ["ORD-0001","2026-04-01","靴のマルヤマ 渋谷店","丸山浩二","03-1111-2222","SH-001","クラシックビジネスシューズ","25.5","ブラック",8,9000,"入金済","2026-04-05",""],
        ["ORD-0002","2026-04-03","セレクトショップ KAZE","風間裕子","045-333-4444","SH-002","レディースパンプス エレガント","23.0","ブラック",6,7200,"入金済","2026-04-07",""],
        ["ORD-0002","2026-04-03","セレクトショップ KAZE","風間裕子","045-333-4444","SH-005","イタリアンレザーローファー","26.0","ダークブラウン",3,16800,"入金済","2026-04-07","定番商品として"],
        ["ORD-0003","2026-04-08","ABCシューズ 横浜店","岡田修一","045-555-6666","SH-003","デイリースニーカー ライト","26.0","ホワイト",20,5300,"出荷済","2026-04-12","新店オープン用"],
        ["ORD-0003","2026-04-08","ABCシューズ 横浜店","岡田修一","045-555-6666","SH-004","キッズスニーカー アクティブ","20.0","レッド",15,3300,"出荷済","2026-04-12",""],
        ["ORD-0004","2026-04-10","ファミリー靴店 たかはし","高橋恵美","048-777-8888","SH-007","ウォーキングシューズ コンフォート","25.5","ブラック",5,5900,"出荷済","2026-04-14",""],
        ["ORD-0004","2026-04-10","ファミリー靴店 たかはし","高橋恵美","048-777-8888","SH-008","レディースローヒールパンプス","23.0","ブラック",8,6000,"出荷済","2026-04-14",""],
        ["ORD-0005","2026-04-15","靴のマルヤマ 新宿店","丸山浩二","03-2222-3333","SH-001","クラシックビジネスシューズ","26.0","ブラウン",5,9000,"受注","2026-04-22",""],
        ["ORD-0005","2026-04-15","靴のマルヤマ 新宿店","丸山浩二","03-2222-3333","SH-003","デイリースニーカー ライト","27.0","ネイビー",10,5300,"受注","2026-04-22",""],
        ["ORD-0006","2026-04-18","セレクトショップ KAZE","風間裕子","045-333-4444","SH-002","レディースパンプス エレガント","23.5","ベージュ",4,7200,"受注","2026-04-25","追加発注"],
        ["ORD-0006","2026-04-18","セレクトショップ KAZE","風間裕子","045-333-4444","SH-008","レディースローヒールパンプス","22.5","ベージュ",6,6000,"受注","2026-04-25",""],
        ["ORD-0007","2026-04-20","スポーツワールド川崎","松本大輔","044-999-0000","SH-003","デイリースニーカー ライト","26.0","ホワイト",30,5300,"受注","2026-04-28","大量注文"],
        ["ORD-0007","2026-04-20","スポーツワールド川崎","松本大輔","044-999-0000","SH-004","キッズスニーカー アクティブ","19.0","ブルー",12,3300,"受注","2026-04-28",""],
      ];
      await db.batch(salesData.map(r => ({
        sql: "INSERT INTO sales (order_number,order_date,customer_name,customer_contact,customer_phone,product_code,product_name,size,color,quantity,unit_price,status,delivery_date,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        args: r,
      })));
    }

    return NextResponse.json({ message: "データベースの初期設定が完了しました" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
