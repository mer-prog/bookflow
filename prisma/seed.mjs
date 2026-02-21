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

  const customer = await prisma.user.create({
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

  // Create services
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

  // Create staff
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
  // Kenta: Cut, Color, Perm
  for (const service of [services[0], services[1], services[3]]) {
    await prisma.staffService.create({
      data: { staffId: staffMembers[1].id, serviceId: service.id },
    });
  }
  // Hanako: Treatment, Head Spa, Cut
  for (const service of [services[0], services[2], services[4]]) {
    await prisma.staffService.create({
      data: { staffId: staffMembers[2].id, serviceId: service.id },
    });
  }

  // Create bookings for the next 7 days
  const now = new Date();
  const bookingsData = [
    { serviceIdx: 0, staffIdx: 0, customerId: customer.id, customerName: "田中花子", customerEmail: "customer@bloom.com", customerPhone: "090-3333-4444", dayOffset: 0, startTime: "10:00", endTime: "11:00", status: "CONFIRMED", cancelRisk: "LOW" },
    { serviceIdx: 1, staffIdx: 1, customerId: customer2.id, customerName: "山田太郎", customerEmail: "yamada@example.com", customerPhone: "090-5555-6666", dayOffset: 0, startTime: "11:00", endTime: "12:30", status: "CONFIRMED", cancelRisk: "MEDIUM" },
    { serviceIdx: 2, staffIdx: 2, customerId: null, customerName: "佐々木優子", customerEmail: "yuko@example.com", customerPhone: "090-7777-8888", dayOffset: 0, startTime: "14:00", endTime: "14:45", status: "PENDING", cancelRisk: "HIGH" },
    { serviceIdx: 3, staffIdx: 0, customerId: customer.id, customerName: "田中花子", customerEmail: "customer@bloom.com", customerPhone: "090-3333-4444", dayOffset: 1, startTime: "10:00", endTime: "12:00", status: "CONFIRMED", cancelRisk: "LOW" },
    { serviceIdx: 4, staffIdx: 2, customerId: null, customerName: "高橋健", customerEmail: "takahashi@example.com", customerPhone: "090-9999-0000", dayOffset: 1, startTime: "15:00", endTime: "16:00", status: "PENDING", cancelRisk: "MEDIUM" },
    { serviceIdx: 0, staffIdx: 1, customerId: customer2.id, customerName: "山田太郎", customerEmail: "yamada@example.com", customerPhone: "090-5555-6666", dayOffset: 2, startTime: "13:00", endTime: "14:00", status: "CONFIRMED", cancelRisk: "LOW" },
    { serviceIdx: 1, staffIdx: 0, customerId: null, customerName: "中村麻衣", customerEmail: "nakamura@example.com", customerPhone: "080-1111-2222", dayOffset: 2, startTime: "16:00", endTime: "17:30", status: "CANCELLED", cancelRisk: "HIGH" },
    { serviceIdx: 2, staffIdx: 2, customerId: customer.id, customerName: "田中花子", customerEmail: "customer@bloom.com", customerPhone: "090-3333-4444", dayOffset: 3, startTime: "11:00", endTime: "11:45", status: "CONFIRMED", cancelRisk: "MEDIUM" },
    { serviceIdx: 4, staffIdx: 0, customerId: null, customerName: "小林拓也", customerEmail: "kobayashi@example.com", customerPhone: "070-3333-4444", dayOffset: 4, startTime: "10:00", endTime: "11:00", status: "CONFIRMED", cancelRisk: "LOW" },
    { serviceIdx: 3, staffIdx: 1, customerId: customer2.id, customerName: "山田太郎", customerEmail: "yamada@example.com", customerPhone: "090-5555-6666", dayOffset: 5, startTime: "14:00", endTime: "16:00", status: "COMPLETED", cancelRisk: "LOW" },
  ];

  for (const b of bookingsData) {
    const bookingDate = new Date(now);
    bookingDate.setDate(bookingDate.getDate() + b.dayOffset);
    bookingDate.setHours(0, 0, 0, 0);

    const createdAt = new Date(bookingDate);
    if (b.cancelRisk === "HIGH") {
      createdAt.setHours(createdAt.getHours() - 1);
    } else if (b.cancelRisk === "MEDIUM") {
      createdAt.setDate(createdAt.getDate() - 1);
    } else {
      createdAt.setDate(createdAt.getDate() - 5);
    }

    await prisma.booking.create({
      data: {
        businessId: business.id,
        serviceId: services[b.serviceIdx].id,
        staffId: staffMembers[b.staffIdx].id,
        customerId: b.customerId,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        customerPhone: b.customerPhone,
        date: bookingDate,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
        cancelRisk: b.cancelRisk,
        createdAt: createdAt,
      },
    });
  }

  console.log("Seed data created successfully!");
  console.log(`Business: ${business.name}`);
  console.log(`Services: ${services.length}`);
  console.log(`Staff: ${staffMembers.length}`);
  console.log(`Bookings: ${bookingsData.length}`);
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
