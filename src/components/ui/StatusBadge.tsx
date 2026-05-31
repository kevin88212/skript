import { OrderStatus } from "@prisma/client";
import { getStatusLabel, getStatusColor } from "@/lib/utils";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
