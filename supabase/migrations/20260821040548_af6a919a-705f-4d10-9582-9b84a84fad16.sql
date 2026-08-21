CREATE TABLE public.expense_locations (
  name text PRIMARY KEY,
  sort_order integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expense_locations TO anon, authenticated;
GRANT ALL ON public.expense_locations TO service_role;
ALTER TABLE public.expense_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to expense_locations" ON public.expense_locations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'Belanja',
  name text NOT NULL,
  expense_date date NOT NULL DEFAULT current_date,
  amount numeric NOT NULL DEFAULT 0,
  invoice_no text,
  notes text,
  location text,
  vendor text,
  dues_name text,
  dues_contact text,
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO anon, authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public full access to expenses" ON public.expenses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER expenses_set_updated_at BEFORE UPDATE ON public.expenses
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX expenses_date_idx ON public.expenses (expense_date DESC);

INSERT INTO public.expense_locations (name, sort_order) VALUES
  ('Kost Putra', 10),
  ('Kost Putri', 20),
  ('Area Umum', 30);