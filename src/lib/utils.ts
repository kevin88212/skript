import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { OrderStatus } from "@prisma/client";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd.MM.yyyy", { locale: de });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd.MM.yyyy HH:mm", { locale: de });
}

export function formatDateInput(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "yyyy-MM-dd");
}

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    DRAFT: "Entwurf",
    SUBMITTED: "Abgesendet",
    SEEN: "Gesehen",
    IN_PROGRESS: "In Bearbeitung",
    DONE: "Erledigt",
    CANCELLED: "Storniert",
  };
  return labels[status];
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SUBMITTED: "bg-blue-100 text-blue-700",
    SEEN: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-orange-100 text-orange-700",
    DONE: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return colors[status];
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
