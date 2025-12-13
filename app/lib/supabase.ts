// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Testamento = {
  id: string;
  user_id: string;
  nombre: string;
  apellido: string;
  rut: string;
  fecha_nacimiento: string;
  estado_civil: string;
  direccion: string;
  ciudad: string;
  bienes: string;
  beneficiarios: string;
  instrucciones_especiales?: string;
  created_at: string;
  updated_at: string;
};