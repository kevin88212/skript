import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const allowed = ["ADMIN", "HAUPTFILIALE"].includes(session.user.role);
  if (!allowed) redirect("/dashboard");

  const [orders, branches] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        branch: true,
        user: true,
        orderItems: true,
      },
    }),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Alle Bestellungen</h1>
      <AdminOrdersClient orders={orders as any} branches={branches} />
    </div>
  );
}
