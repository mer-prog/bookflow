import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

const mod = await import("../src/generated/prisma/client.ts");
const PrismaClient = mod.PrismaClient;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.staffService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  // Create business
  const business = await prisma.business.create({
    data: {
      name: "BLOOM Beauty Studio",
      description: "あなたの美しさを咲かせる、トータルビューティーサロン",
      address: "東京都渋谷区神宮前3-15-8",
      phone: "03-1234-5678",
      email: "info@bloom-beauty.jp",
      businessHours: {
        monday: { open: "10:00", close: "19:00", closed: false },
        tuesday: { open: "10:00", close: "19:00", closed: false },
        wednesday: { open: "10:00", close: "19:00", closed: false },
        thursday: { open: "10:00", close: "20:00", closed: false },
        friday: { open: "10:00", close: "20:00", closed: false },
        saturday: { open: "09:00", close: "19:00", closed: false },
        sunday: { open: "09:00", close: "17:00", closed: true },
      },
    },
  });

  // Create users
  const adminPassword = await hash("password123", 12);
  const customerPassword = await hash("password123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@bloom.com",
      password: adminPassword,
      name: "管理者",
      phone: "090-1111-2222",
      role: "ADMIN",
      businessId: business.id,
    },
  });

  // 5 repeater customers
  const customer1 = await prisma.user.create({
    data: {
      email: "customer@bloom.com",
      password: customerPassword,
      name: "田中花子",
      phone: "090-3333-4444",
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "yamada@example.com",
      password: customerPassword,
      name: "山田太郎",
      phone: "090-5555-6666",
      role: "CUSTOMER",
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: "yuko@example.com",
      password: customerPassword,
      name: "佐々木優子",
      phone: "090-7777-8888",
      role: "CUSTOMER",
    },
  });

  const customer4 = await prisma.user.create({
    data: {
      email: "takahashi@example.com",
      password: customerPassword,
      name: "高橋健",
      phone: "090-9999-0000",
      role: "CUSTOMER",
    },
  });

  const customer5 = await prisma.user.create({
    data: {
      email: "nakamura@example.com",
      password: customerPassword,
      name: "中村麻衣",
      phone: "080-1111-2222",
      role: "CUSTOMER",
    },
  });

  // Create services
  // Index: 0=カット(60min), 1=カラー(90min), 2=トリートメント(45min), 3=パーマ(120min), 4=ヘッドスパ(60min)
  const services = await Promise.all([
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "カット",
        description: "似合わせカットで理想のスタイルに。シャンプー・ブロー込み。",
        duration: 60,
        price: 4500,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "カラー",
        description: "豊富なカラーバリエーションで、あなただけのカラーを。",
        duration: 90,
        price: 8000,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "トリートメント",
        description: "髪の内部から補修し、ツヤのある美しい髪へ。",
        duration: 45,
        price: 3500,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "パーマ",
        description: "ダメージレスパーマで自然なウェーブを実現。",
        duration: 120,
        price: 10000,
      },
    }),
    prisma.service.create({
      data: {
        businessId: business.id,
        name: "ヘッドスパ",
        description: "頭皮ケアとリラクゼーションで心身リフレッシュ。",
        duration: 60,
        price: 5000,
      },
    }),
  ]);

  // Service durations for endTime calculation
  const serviceDurations = [60, 90, 45, 120, 60];

  // Create staff
  // Index: 0=田中美咲(all), 1=佐藤健太(カット,カラー,パーマ), 2=鈴木花子(カット,トリートメント,ヘッドスパ)
  const staffMembers = await Promise.all([
    prisma.staff.create({
      data: {
        businessId: business.id,
        name: "田中美咲",
        email: "misaki@bloom-beauty.jp",
      },
    }),
    prisma.staff.create({
      data: {
        businessId: business.id,
        name: "佐藤健太",
        email: "kenta@bloom-beauty.jp",
      },
    }),
    prisma.staff.create({
      data: {
        businessId: business.id,
        name: "鈴木花子",
        email: "hanako@bloom-beauty.jp",
      },
    }),
  ]);

  // Assign services to staff
  // Misaki: all services
  for (const service of services) {
    await prisma.staffService.create({
      data: { staffId: staffMembers[0].id, serviceId: service.id },
    });
  }
  // Kenta: Cut, Color, Perm (indices 0, 1, 3)
  for (const service of [services[0], services[1], services[3]]) {
    await prisma.staffService.create({
      data: { staffId: staffMembers[1].id, serviceId: service.id },
    });
  }
  // Hanako: Cut, Treatment, Head Spa (indices 0, 2, 4)
  for (const service of [services[0], services[2], services[4]]) {
    await prisma.staffService.create({
      data: { staffId: staffMembers[2].id, serviceId: service.id },
    });
  }

  // Helper: calculate endTime from startTime and service duration
  function calcEndTime(startTime, durationMin) {
    const [h, m] = startTime.split(":").map(Number);
    const totalMin = h * 60 + m + durationMin;
    const eh = Math.floor(totalMin / 60);
    const em = totalMin % 60;
    return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
  }

  // =====================================================================
  // 70 bookings data
  // =====================================================================
  // Repeater customers (c1-c5 shorthand):
  //   c1: 田中花子     - 6 bookings, 0 cancellations (loyal)
  //   c2: 山田太郎     - 5 bookings, 2 cancellations (40% cancel rate → HIGH risk)
  //   c3: 佐々木優子   - 4 bookings, 0 cancellations
  //   c4: 高橋健       - 4 bookings, 2 cancellations (50% cancel rate → HIGH risk)
  //   c5: 中村麻衣     - 3 bookings, 0 cancellations
  // One-time customers: 48 bookings (no customerId)
  //
  // Status distribution: CONFIRMED 28, COMPLETED 24, CANCELLED 11, NO_SHOW 7
  // Cancel reasons: 急用のため(3), 体調不良(3), 日程変更のため(3), 無断キャンセル(2)
  // =====================================================================

  const c1 = { id: customer1.id, name: "田中花子", email: "customer@bloom.com", phone: "090-3333-4444" };
  const c2 = { id: customer2.id, name: "山田太郎", email: "yamada@example.com", phone: "090-5555-6666" };
  const c3 = { id: customer3.id, name: "佐々木優子", email: "yuko@example.com", phone: "090-7777-8888" };
  const c4 = { id: customer4.id, name: "高橋健", email: "takahashi@example.com", phone: "090-9999-0000" };
  const c5 = { id: customer5.id, name: "中村麻衣", email: "nakamura@example.com", phone: "080-1111-2222" };

  // One-time customer pool
  const oneTime = [
    { name: "小林拓也", email: "kobayashi@example.com", phone: "070-3333-4444" },
    { name: "伊藤美穂", email: "ito.miho@example.com", phone: "090-2222-3333" },
    { name: "渡辺直人", email: "watanabe@example.com", phone: "080-4444-5555" },
    { name: "加藤さくら", email: "kato.sakura@example.com", phone: "090-6666-7777" },
    { name: "松本翔太", email: "matsumoto@example.com", phone: "070-8888-9999" },
    { name: "吉田千尋", email: "yoshida@example.com", phone: "080-1234-5678" },
    { name: "木村大輝", email: "kimura@example.com", phone: "090-8765-4321" },
    { name: "林真理子", email: "hayashi@example.com", phone: "070-1111-3333" },
    { name: "清水健一", email: "shimizu@example.com", phone: "080-2222-4444" },
    { name: "森田由美", email: "morita@example.com", phone: "090-3333-5555" },
    { name: "岡田雅之", email: "okada@example.com", phone: "070-4444-6666" },
    { name: "藤井恵", email: "fujii@example.com", phone: "080-5555-7777" },
    { name: "西村拓海", email: "nishimura@example.com", phone: "090-6666-8888" },
    { name: "石田あかり", email: "ishida@example.com", phone: "070-7777-9999" },
    { name: "前田大地", email: "maeda@example.com", phone: "080-8888-1111" },
    { name: "上田真由美", email: "ueda@example.com", phone: "090-9999-2222" },
    { name: "村上裕太", email: "murakami@example.com", phone: "070-1111-4444" },
    { name: "太田絵里", email: "ota@example.com", phone: "080-2222-5555" },
    { name: "原田健太郎", email: "harada@example.com", phone: "090-3333-6666" },
    { name: "小川凛", email: "ogawa@example.com", phone: "070-4444-7777" },
    { name: "斉藤舞", email: "saito.mai@example.com", phone: "080-5555-8888" },
    { name: "金子悠人", email: "kaneko@example.com", phone: "090-6666-9999" },
    { name: "池田美月", email: "ikeda@example.com", phone: "070-7777-1111" },
    { name: "山口翼", email: "yamaguchi@example.com", phone: "080-8888-2222" },
    { name: "阿部陽菜", email: "abe@example.com", phone: "090-9999-3333" },
    { name: "橋本蓮", email: "hashimoto@example.com", phone: "070-1234-6789" },
    { name: "野口真帆", email: "noguchi@example.com", phone: "080-2345-7890" },
    { name: "杉山大樹", email: "sugiyama@example.com", phone: "090-3456-8901" },
    { name: "福田沙織", email: "fukuda@example.com", phone: "070-4567-9012" },
    { name: "三浦颯太", email: "miura@example.com", phone: "080-5678-0123" },
    { name: "遠藤花音", email: "endo@example.com", phone: "090-6789-1234" },
    { name: "坂本航", email: "sakamoto@example.com", phone: "070-7890-2345" },
    { name: "菅原莉子", email: "sugawara@example.com", phone: "080-8901-3456" },
    { name: "内田光希", email: "uchida@example.com", phone: "090-9012-4567" },
    { name: "横山詩乃", email: "yokoyama@example.com", phone: "070-0123-5678" },
    { name: "宮崎陸", email: "miyazaki@example.com", phone: "080-1234-6789" },
    { name: "安藤結衣", email: "ando@example.com", phone: "090-2345-7890" },
    { name: "竹内悠斗", email: "takeuchi@example.com", phone: "070-3456-8901" },
    { name: "堀田楓", email: "hotta@example.com", phone: "080-4567-9012" },
    { name: "片山涼太", email: "katayama@example.com", phone: "090-5678-0123" },
    { name: "久保田美咲", email: "kubota@example.com", phone: "070-6789-1234" },
    { name: "河野大和", email: "kawano@example.com", phone: "080-7890-2345" },
    { name: "武田芽依", email: "takeda@example.com", phone: "090-8901-3456" },
    { name: "中島隼人", email: "nakajima@example.com", phone: "070-9012-4567" },
    { name: "今井桃花", email: "imai@example.com", phone: "080-0123-5678" },
    { name: "関口蒼", email: "sekiguchi@example.com", phone: "090-1234-7890" },
    { name: "平田優花", email: "hirata@example.com", phone: "070-2345-8901" },
    { name: "大野柊", email: "ohno@example.com", phone: "080-3456-9012" },
  ];

  let otIdx = 0; // one-time customer index
  function ot() {
    const c = oneTime[otIdx % oneTime.length];
    otIdx++;
    return { id: null, name: c.name, email: c.email, phone: c.phone };
  }

  // Booking data: 70 entries
  // dayOffset: negative = past, 0 = today, positive = future
  // leadTimeDays: how many days before the booking date the reservation was created
  // Staff-service compatibility:
  //   staff 0 (美咲): services 0,1,2,3,4
  //   staff 1 (健太): services 0,1,3
  //   staff 2 (花子): services 0,2,4
  const bookingsData = [
    // ===== PAST: COMPLETED (24 bookings) - days -30 to -1 =====
    // c1 田中花子 - 4 completed (loyal regular)
    { svc: 0, staff: 0, cust: c1, day: -28, time: "10:00", status: "COMPLETED", lead: 7 },
    { svc: 2, staff: 2, cust: c1, day: -21, time: "14:00", status: "COMPLETED", lead: 5 },
    { svc: 1, staff: 0, cust: c1, day: -14, time: "11:00", status: "COMPLETED", lead: 10 },
    { svc: 4, staff: 0, cust: c1, day: -7, time: "15:00", status: "COMPLETED", lead: 3 },
    // c2 山田太郎 - 1 completed
    { svc: 0, staff: 1, cust: c2, day: -25, time: "13:00", status: "COMPLETED", lead: 4 },
    // c3 佐々木優子 - 2 completed
    { svc: 0, staff: 0, cust: c3, day: -26, time: "11:00", status: "COMPLETED", lead: 7 },
    { svc: 2, staff: 2, cust: c3, day: -18, time: "10:00", status: "COMPLETED", lead: 5 },
    // c4 高橋健 - 1 completed
    { svc: 0, staff: 1, cust: c4, day: -22, time: "16:00", status: "COMPLETED", lead: 6 },
    // c5 中村麻衣 - 1 completed
    { svc: 4, staff: 2, cust: c5, day: -20, time: "13:00", status: "COMPLETED", lead: 8 },
    // One-time completed (15 bookings)
    { svc: 0, staff: 0, cust: ot(), day: -30, time: "10:00", status: "COMPLETED", lead: 5 },
    { svc: 1, staff: 1, cust: ot(), day: -29, time: "14:00", status: "COMPLETED", lead: 7 },
    { svc: 2, staff: 2, cust: ot(), day: -27, time: "11:00", status: "COMPLETED", lead: 3 },
    { svc: 0, staff: 1, cust: ot(), day: -24, time: "10:00", status: "COMPLETED", lead: 6 },
    { svc: 4, staff: 0, cust: ot(), day: -23, time: "15:00", status: "COMPLETED", lead: 4 },
    { svc: 3, staff: 0, cust: ot(), day: -19, time: "10:00", status: "COMPLETED", lead: 14 },
    { svc: 0, staff: 2, cust: ot(), day: -17, time: "13:00", status: "COMPLETED", lead: 5 },
    { svc: 1, staff: 0, cust: ot(), day: -16, time: "11:00", status: "COMPLETED", lead: 8 },
    { svc: 2, staff: 2, cust: ot(), day: -13, time: "14:00", status: "COMPLETED", lead: 3 },
    { svc: 0, staff: 1, cust: ot(), day: -11, time: "16:00", status: "COMPLETED", lead: 2 },
    { svc: 4, staff: 2, cust: ot(), day: -9, time: "10:00", status: "COMPLETED", lead: 7 },
    { svc: 0, staff: 0, cust: ot(), day: -6, time: "11:00", status: "COMPLETED", lead: 4 },
    { svc: 1, staff: 1, cust: ot(), day: -4, time: "13:00", status: "COMPLETED", lead: 6 },
    { svc: 3, staff: 1, cust: ot(), day: -3, time: "10:00", status: "COMPLETED", lead: 10 },

    // ===== PAST: CANCELLED (11 bookings) - days -30 to -1 =====
    // c2 山田太郎 - 2 cancelled (cancel history → HIGH risk)
    { svc: 1, staff: 0, cust: c2, day: -20, time: "17:00", status: "CANCELLED", lead: 1, cancelReason: "急用のため" },
    { svc: 3, staff: 1, cust: c2, day: -10, time: "14:00", status: "CANCELLED", lead: 2, cancelReason: "体調不良" },
    // c4 高橋健 - 2 cancelled (cancel history → HIGH risk)
    { svc: 0, staff: 0, cust: c4, day: -15, time: "18:00", status: "CANCELLED", lead: 0, cancelReason: "無断キャンセル" },
    { svc: 1, staff: 1, cust: c4, day: -8, time: "11:00", status: "CANCELLED", lead: 1, cancelReason: "日程変更のため" },
    // One-time cancelled (7 bookings)
    { svc: 0, staff: 2, cust: ot(), day: -27, time: "15:00", status: "CANCELLED", lead: 3, cancelReason: "急用のため" },
    { svc: 2, staff: 0, cust: ot(), day: -22, time: "10:00", status: "CANCELLED", lead: 5, cancelReason: "体調不良" },
    { svc: 1, staff: 1, cust: ot(), day: -18, time: "16:00", status: "CANCELLED", lead: 2, cancelReason: "日程変更のため" },
    { svc: 0, staff: 0, cust: ot(), day: -14, time: "14:00", status: "CANCELLED", lead: 1, cancelReason: "体調不良" },
    { svc: 4, staff: 2, cust: ot(), day: -12, time: "11:00", status: "CANCELLED", lead: 4, cancelReason: "急用のため" },
    { svc: 3, staff: 0, cust: ot(), day: -5, time: "10:00", status: "CANCELLED", lead: 0, cancelReason: "無断キャンセル" },
    { svc: 0, staff: 1, cust: ot(), day: -2, time: "17:00", status: "CANCELLED", lead: 2, cancelReason: "日程変更のため" },

    // ===== PAST: NO_SHOW (7 bookings) - days -30 to -1 =====
    { svc: 0, staff: 0, cust: ot(), day: -28, time: "18:00", status: "NO_SHOW", lead: 0 },
    { svc: 1, staff: 1, cust: ot(), day: -23, time: "11:00", status: "NO_SHOW", lead: 1 },
    { svc: 2, staff: 2, cust: ot(), day: -19, time: "14:00", status: "NO_SHOW", lead: 3 },
    { svc: 0, staff: 0, cust: ot(), day: -16, time: "17:00", status: "NO_SHOW", lead: 0 },
    { svc: 4, staff: 0, cust: ot(), day: -11, time: "10:00", status: "NO_SHOW", lead: 2 },
    { svc: 0, staff: 2, cust: ot(), day: -7, time: "15:00", status: "NO_SHOW", lead: 1 },
    { svc: 3, staff: 1, cust: ot(), day: -3, time: "14:00", status: "NO_SHOW", lead: 0 },

    // ===== FUTURE: CONFIRMED (28 bookings) - days 0 to +7 =====
    // c1 田中花子 - 2 confirmed (loyal regular, continuing visits)
    { svc: 0, staff: 0, cust: c1, day: 1, time: "10:00", status: "CONFIRMED", lead: 7 },
    { svc: 2, staff: 2, cust: c1, day: 5, time: "14:00", status: "CONFIRMED", lead: 10 },
    // c2 山田太郎 - 2 confirmed (HIGH risk due to 40% cancel rate)
    // lead=1 → <24h → +25pts; cancelRate 40% → +35pts = 60 → HIGH
    { svc: 0, staff: 1, cust: c2, day: 0, time: "17:00", status: "CONFIRMED", lead: 1 },
    // lead=2 → <72h → +10pts; cancelRate 40% → +35pts; Friday → +10pts; 18:00→ +15pts = 70 → HIGH
    { svc: 1, staff: 0, cust: c2, day: 3, time: "18:00", status: "CONFIRMED", lead: 2 },
    // c3 佐々木優子 - 2 confirmed
    { svc: 4, staff: 2, cust: c3, day: 2, time: "11:00", status: "CONFIRMED", lead: 5 },
    { svc: 0, staff: 0, cust: c3, day: 6, time: "13:00", status: "CONFIRMED", lead: 8 },
    // c4 高橋健 - 1 confirmed (HIGH risk due to 50% cancel rate)
    // lead=1 → +25pts; cancelRate 50% → +35pts = 60 → HIGH
    { svc: 3, staff: 0, cust: c4, day: 1, time: "10:00", status: "CONFIRMED", lead: 1 },
    // c5 中村麻衣 - 2 confirmed
    { svc: 0, staff: 2, cust: c5, day: 3, time: "11:00", status: "CONFIRMED", lead: 6 },
    { svc: 2, staff: 0, cust: c5, day: 7, time: "15:00", status: "CONFIRMED", lead: 4 },
    // One-time confirmed (19 bookings)
    { svc: 0, staff: 0, cust: ot(), day: 0, time: "10:00", status: "CONFIRMED", lead: 3 },
    { svc: 1, staff: 1, cust: ot(), day: 0, time: "14:00", status: "CONFIRMED", lead: 5 },
    { svc: 2, staff: 2, cust: ot(), day: 0, time: "11:00", status: "CONFIRMED", lead: 4 },
    { svc: 4, staff: 0, cust: ot(), day: 1, time: "15:00", status: "CONFIRMED", lead: 7 },
    { svc: 0, staff: 1, cust: ot(), day: 1, time: "13:00", status: "CONFIRMED", lead: 2 },
    { svc: 0, staff: 2, cust: ot(), day: 2, time: "10:00", status: "CONFIRMED", lead: 6 },
    { svc: 3, staff: 1, cust: ot(), day: 2, time: "14:00", status: "CONFIRMED", lead: 12 },
    { svc: 1, staff: 0, cust: ot(), day: 3, time: "10:00", status: "CONFIRMED", lead: 8 },
    { svc: 2, staff: 2, cust: ot(), day: 3, time: "16:00", status: "CONFIRMED", lead: 3 },
    { svc: 0, staff: 0, cust: ot(), day: 4, time: "11:00", status: "CONFIRMED", lead: 5 },
    { svc: 4, staff: 2, cust: ot(), day: 4, time: "13:00", status: "CONFIRMED", lead: 9 },
    { svc: 0, staff: 1, cust: ot(), day: 5, time: "10:00", status: "CONFIRMED", lead: 4 },
    { svc: 1, staff: 0, cust: ot(), day: 5, time: "16:00", status: "CONFIRMED", lead: 7 },
    { svc: 3, staff: 0, cust: ot(), day: 6, time: "10:00", status: "CONFIRMED", lead: 14 },
    { svc: 0, staff: 2, cust: ot(), day: 6, time: "15:00", status: "CONFIRMED", lead: 3 },
    { svc: 2, staff: 0, cust: ot(), day: 7, time: "11:00", status: "CONFIRMED", lead: 6 },
    { svc: 0, staff: 1, cust: ot(), day: 7, time: "14:00", status: "CONFIRMED", lead: 5 },
    { svc: 4, staff: 0, cust: ot(), day: 7, time: "10:00", status: "CONFIRMED", lead: 8 },
    { svc: 1, staff: 1, cust: ot(), day: 4, time: "11:00", status: "CONFIRMED", lead: 10 },
  ];

  // Verify count
  const statusCounts = { CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0 };
  for (const b of bookingsData) {
    statusCounts[b.status]++;
  }
  console.log("Status distribution:", statusCounts);
  console.log(`Total bookings: ${bookingsData.length}`);

  // Create bookings
  const now = new Date();
  for (const b of bookingsData) {
    const bookingDate = new Date(now);
    bookingDate.setDate(bookingDate.getDate() + b.day);
    bookingDate.setHours(0, 0, 0, 0);

    // Skip Sundays (business is closed) - shift to next day
    if (bookingDate.getDay() === 0) {
      bookingDate.setDate(bookingDate.getDate() + 1);
    }

    const endTime = calcEndTime(b.time, serviceDurations[b.svc]);

    // Calculate createdAt based on lead time
    const createdAt = new Date(bookingDate);
    if (b.lead === 0) {
      // Same-day booking: a few hours before the appointment
      const hour = parseInt(b.time.split(":")[0]);
      createdAt.setHours(Math.max(hour - 2, 8), 0, 0, 0);
    } else {
      createdAt.setDate(createdAt.getDate() - b.lead);
      createdAt.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0);
    }

    await prisma.booking.create({
      data: {
        businessId: business.id,
        serviceId: services[b.svc].id,
        staffId: staffMembers[b.staff].id,
        customerId: b.cust.id,
        customerName: b.cust.name,
        customerEmail: b.cust.email,
        customerPhone: b.cust.phone,
        date: bookingDate,
        startTime: b.time,
        endTime: endTime,
        status: b.status,
        cancelReason: b.cancelReason || null,
        createdAt: createdAt,
      },
    });
  }

  console.log("Seed data created successfully!");
  console.log(`Business: ${business.name}`);
  console.log(`Services: ${services.length}`);
  console.log(`Staff: ${staffMembers.length}`);
  console.log(`Bookings: ${bookingsData.length}`);
  console.log("Repeater customers: 5 (田中花子, 山田太郎, 佐々木優子, 高橋健, 中村麻衣)");
  console.log("Users: admin@bloom.com / customer@bloom.com (password: password123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
