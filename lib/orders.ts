import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { isMissingSchemaError, prisma } from "@/lib/db";
import { sendStudioLetter } from "@/lib/email";
import { formatNaira } from "@/lib/money";
import { site } from "@/lib/site";

export type OrderDraft = {
  name: string;
  email: string;
  phone?: string;
  city: string;
  address: string;
  note: string;
  lines: {
    productId: string;
    name: string;
    priceNaira: number;
    quantity: number;
    imageUrl: string;
  }[];
};

export async function placeOrder(draft: OrderDraft) {
  const totalNaira = draft.lines.reduce(
    (sum, line) => sum + line.priceNaira * line.quantity,
    0,
  );
  const order = await prisma.order.create({
    data: {
      name: draft.name,
      email: draft.email,
      phone: draft.phone ?? null,
      city: draft.city,
      address: draft.address,
      note: draft.note,
      status: "new",
      totalNaira,
      items: {
        create: draft.lines.map((line) => ({
          productId: line.productId,
          name: line.name,
          priceNaira: line.priceNaira,
          quantity: line.quantity,
          imageUrl: line.imageUrl,
        })),
      },
    },
    include: { items: true },
  });

  const letter = orderLetter(order);
  try {
    const folder = path.join(process.cwd(), ".data", "mailbox");
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, `order-${order.id}.txt`), letter, "utf8");
  } catch (error) {
    console.warn("Order mailbox copy could not be written.", error);
  }

  await sendStudioLetter({
    to: process.env.STUDIO_INBOX_EMAIL || site.email,
    subject: `New shop order — ${order.items.length} piece${order.items.length === 1 ? "" : "s"} — ${order.city}`,
    text: letter,
  });

  return order;
}

export async function listOrders() {
  try {
    return await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }
    throw error;
  }
}

export async function getOrder(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return null;
    }
    throw error;
  }
}

export async function markOrderStatus(id: string, status: "new" | "confirmed" | "closed") {
  return prisma.order.update({
    where: { id },
    data: { status },
  });
}

function orderLetter(order: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  address: string;
  note: string;
  totalNaira: number;
  items: { name: string; quantity: number; priceNaira: number }[];
}): string {
  return [
    `${site.legalName}`,
    `A shop order ${new Date().toISOString().slice(0, 10)}`,
    "",
    `Order: ${order.id}`,
    `From: ${order.name} <${order.email}>`,
    order.phone ? `Telephone: ${order.phone}` : null,
    `City: ${order.city}`,
    `Address: ${order.address}`,
    "",
    "Pieces",
    ...order.items.map(
      (item) =>
        `- ${item.quantity} × ${item.name} — ${formatNaira(item.priceNaira)} each`,
    ),
    "",
    `Total: ${formatNaira(order.totalNaira)}`,
    "",
    "Note",
    order.note || "(none)",
    "",
    "This is an order to confirm, not a payment. Write back with availability and how to settle.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
