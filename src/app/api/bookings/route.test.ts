import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

const { prismaMock, txMock } = vi.hoisted(() => {
  const txMock = {
    booking: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  };
  const prismaMock = {
    service: { findUnique: vi.fn() },
    business: { findFirst: vi.fn() },
    user: { findUnique: vi.fn() },
    booking: { count: vi.fn() },
    $transaction: vi.fn(),
  };
  return { prismaMock, txMock };
});

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => ({ auth: vi.fn(async () => null) }));

function postRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const basePayload = {
  serviceId: "svc1",
  staffId: "staff1",
  date: "2026-08-03",
  customerName: "山田花子",
  customerEmail: "hanako@example.com",
};

// Existing booking: staff1 is booked 10:00–11:00
const existingBooking = {
  id: "bk1",
  staffId: "staff1",
  startTime: "10:00",
  endTime: "11:00",
  status: "CONFIRMED",
};

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.service.findUnique.mockResolvedValue({
    id: "svc1",
    name: "カット",
    duration: 60,
    price: 5000,
    active: true,
  });
  prismaMock.business.findFirst.mockResolvedValue({ id: "biz1" });
  prismaMock.user.findUnique.mockResolvedValue(null);
  prismaMock.$transaction.mockImplementation(
    async (fn: (tx: typeof txMock) => Promise<unknown>) => fn(txMock)
  );
  txMock.booking.findMany.mockResolvedValue([existingBooking]);
  txMock.booking.create.mockImplementation(
    async ({ data }: { data: Record<string, unknown> }) => ({
      id: "bk_new",
      ...data,
    })
  );
});

describe("POST /api/bookings — double booking prevention", () => {
  it("rejects a booking that overlaps an existing one (409, no create)", async () => {
    const res = await POST(postRequest({ ...basePayload, time: "10:30" }));

    expect(res.status).toBe(409);
    expect(txMock.booking.create).not.toHaveBeenCalled();
  });

  it("rejects a booking for the exact same slot (409)", async () => {
    const res = await POST(postRequest({ ...basePayload, time: "10:00" }));

    expect(res.status).toBe(409);
    expect(txMock.booking.create).not.toHaveBeenCalled();
  });

  it("creates a non-overlapping booking (201)", async () => {
    const res = await POST(postRequest({ ...basePayload, time: "13:00" }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(txMock.booking.create).toHaveBeenCalledTimes(1);
    expect(body.startTime).toBe("13:00");
    expect(body.endTime).toBe("14:00");
    expect(body.status).toBe("CONFIRMED");
  });

  it("allows a booking starting exactly when the existing one ends (boundary)", async () => {
    const res = await POST(postRequest({ ...basePayload, time: "11:00" }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.startTime).toBe("11:00");
    expect(body.endTime).toBe("12:00");
  });

  it("allows a booking ending exactly when the existing one starts (boundary)", async () => {
    const res = await POST(postRequest({ ...basePayload, time: "09:00" }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.startTime).toBe("09:00");
    expect(body.endTime).toBe("10:00");
  });

  it("runs the conflict check in a Serializable transaction scoped to active bookings", async () => {
    await POST(postRequest({ ...basePayload, time: "13:00" }));

    expect(prismaMock.$transaction).toHaveBeenCalledWith(
      expect.any(Function),
      { isolationLevel: "Serializable" }
    );
    expect(txMock.booking.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          staffId: "staff1",
          status: { in: ["CONFIRMED", "PENDING"] },
        }),
      })
    );
  });

  it("returns 409 when the transaction fails with a serialization conflict (P2034)", async () => {
    prismaMock.$transaction.mockRejectedValue(
      Object.assign(new Error("Transaction failed due to a write conflict"), {
        code: "P2034",
      })
    );

    const res = await POST(postRequest({ ...basePayload, time: "13:00" }));

    expect(res.status).toBe(409);
  });
});
