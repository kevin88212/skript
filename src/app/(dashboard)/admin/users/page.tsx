import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/admin/UsersClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard");

  const [rawUsers, branches] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: "asc" },
      include: { branch: true },
    }),
    prisma.branch.findMany({ orderBy: { name: "asc" } }),
  ]);

  const users = rawUsers.map(({ passwordHash: _, ...u }) => u);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Benutzerverwaltung</h1>
      <UsersClient users={users as any} branches={branches} currentUserId={session.user.id} />
    </div>
  );
}
