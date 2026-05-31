import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BranchesClient } from "@/components/admin/BranchesClient";

export default async function BranchesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true, orders: true } } },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Filialverwaltung</h1>
      <BranchesClient branches={branches as any} />
    </div>
  );
}
