import { supabase } from "@/integrations/supabase/client";

export const TENANT_STATUSES = ["Aktif", "Nonaktif"] as const;

export const PAYMENT_METHODS = ["QRIS", "Transfer Bank", "Tunai"] as const;

export const PERIOD_TYPES = [
  { label: "1 Bulan", months: 1 },
  { label: "3 Bulan", months: 3 },
  { label: "6 Bulan", months: 6 },
  { label: "1 Tahun", months: 12 },
] as const;

export type PeriodLabel = (typeof PERIOD_TYPES)[number]["label"];

export function monthsOfPeriod(label: string): number {
  return PERIOD_TYPES.find((p) => p.label === label)?.months ?? 1;
}

export function addMonths(date: string, months: number): string {
  const base = new Date(`${date}T00:00:00`);
  if (Number.isNaN(base.getTime())) return date;
  const day = base.getDate();
  const target = new Date(base.getFullYear(), base.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, "0");
  const d = String(target.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type Tenant = {
  id: string;
  name: string;
  contact: string | null;
  room_number: string | null;
  status: string;
  notes: string | null;
};

export type TenantPayload = Omit<Tenant, "id">;

export type Income = {
  id: string;
  tenant_id: string;
  tenant_name: string;
  room_number: string | null;
  period_type: string;
  period_months: number;
  start_date: string;
  end_date: string | null;
  payment_date: string;
  payment_method: string;
  amount: number;
  notes: string | null;
  attachments: string[];
};

export type IncomePayload = Omit<Income, "id">;

function unwrap<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data as T;
}

export const tenantsQuery = {
  queryKey: ["tenants"] as const,
  queryFn: async (): Promise<Tenant[]> => {
    const rows = unwrap(
      await supabase
        .from("tenants")
        .select("id, name, contact, room_number, status, notes")
        .order("name"),
    ) as Tenant[];
    return rows;
  },
};

export const incomesQuery = {
  queryKey: ["incomes"] as const,
  queryFn: async (): Promise<Income[]> => {
    const rows = unwrap(
      await supabase
        .from("incomes")
        .select(
          "id, tenant_id, tenant_name, room_number, period_type, period_months, start_date, end_date, payment_date, payment_method, amount, notes, attachments",
        )
        .order("payment_date", { ascending: false })
        .order("created_at", { ascending: false }),
    ) as Record<string, unknown>[];
    return rows.map((row) => ({
      ...row,
      amount: Number(row['amount'] ?? 0),
      period_months: Number(row['period_months'] ?? 1),
      attachments: Array.isArray(row['attachments'])
        ? (row['attachments'] as unknown[]).filter((v): v is string => typeof v === "string")
        : [],
    })) as Income[];
  },
};

export async function addTenant(input: TenantPayload) {
  const { error } = await supabase.from("tenants").insert(input as never);
  if (error) throw new Error(error.message);
}

export async function updateTenant(id: string, patch: Partial<TenantPayload>) {
  const { error } = await supabase.from("tenants").update(patch as never).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTenant(id: string) {
  const { error } = await supabase.from("tenants").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addIncome(input: IncomePayload) {
  const { error } = await supabase.from("incomes").insert(input as never);
  if (error) throw new Error(error.message);
}

export async function updateIncome(id: string, patch: Partial<IncomePayload>) {
  const { error } = await supabase.from("incomes").update(patch as never).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteIncome(id: string) {
  const { error } = await supabase.from("incomes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
