import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CollectionListClient } from "@/components/admin/CollectionListClient";

export default async function CollectionListPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const allowed = ["ADMIN", "HAUPTFILIALE"].includes(session.user.role);
  if (!allowed) redirect("/dashboard");

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between no-print">
        <h1 className="text-xl font-bold text-gray-900">Sammelliste</h1>
        <button onClick={() => window.print()} className="btn-secondary text-sm">
          🖨️ Drucken
        </button>
      </div>
      <CollectionListClient defaultDate={today} />
    </div>
  );
}
