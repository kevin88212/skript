import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewOrderForm } from "@/components/orders/NewOrderForm";
import { redirect } from "next/navigation";

export default async function NewOrderPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  if (!session.user.branchId) {
    return (
      <div className="card p-8 text-center text-gray-500 max-w-lg mx-auto mt-8">
        <p className="font-medium">Keine Filiale zugewiesen</p>
        <p className="text-sm mt-1">
          Bitte wenden Sie sich an den Administrator, um Ihrer Filiale zugewiesen zu werden.
        </p>
      </div>
    );
  }

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { active: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Neue Bestellung</h1>
      <NewOrderForm categories={categories} />
    </div>
  );
}
