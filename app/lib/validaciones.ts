// lib/validaciones.ts
import { z } from 'zod';

// Validar RUT chileno (formato básico)
const validarRUT = (rut: string): boolean => {
  const rutLimpio = rut.replace(/[.-]/g, '');
  if (rutLimpio.length < 8) return false;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvCalculado = 11 - (suma % 11);
  const dvFinal = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
  
  return dv === dvFinal;
};

// Schema para datos personales
export const datosPersonalesSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  rut: z.string().refine(validarRUT, 'RUT inválido'),
  fechaNacimiento: z.string().refine((fecha) => {
    const edad = new Date().getFullYear() - new Date(fecha).getFullYear();
    return edad >= 18;
  }, 'Debes ser mayor de 18 años'),
  estadoCivil: z.enum(['soltero', 'casado', 'viudo', 'divorciado']),
  nacionalidad: z.string().min(2),
  direccion: z.string().min(5),
  ciudad: z.string().min(2),
});

// Schema para bienes
export const bienSchema = z.object({
  id: z.string(),
  tipo: z.enum(['inmueble', 'vehiculo', 'cuenta_bancaria', 'otro']),
  descripcion: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
  valorEstimado: z.number().positive().optional(),
});

// Schema para beneficiarios
export const beneficiarioSchema = z.object({
  id: z.string(),
  nombre: z.string().min(2),
  rut: z.string().refine(validarRUT, 'RUT inválido'),
  relacion: z.enum(['hijo', 'conyuge', 'padre', 'hermano', 'otro']),
  porcentaje: z.number().min(0).max(100),
  esHerederoForzoso: z.boolean(),
});

// Schema completo del testamento
export const testamentoSchema = z.object({
  datosPersonales: datosPersonalesSchema,
  bienes: z.array(bienSchema).min(1, 'Debe agregar al menos un bien'),
  beneficiarios: z.array(beneficiarioSchema)
    .min(1, 'Debe agregar al menos un beneficiario')
    .refine((beneficiarios) => {
      const sumaTotal = beneficiarios.reduce((sum, b) => sum + b.porcentaje, 0);
      return Math.abs(sumaTotal - 100) < 0.01; // Tolerancia por decimales
    }, 'La suma de porcentajes debe ser 100%'),
  instruccionesEspeciales: z.string().optional(),
  fechaCreacion: z.string(),
});

export type DatosPersonalesForm = z.infer<typeof datosPersonalesSchema>;
export type BienForm = z.infer<typeof bienSchema>;
export type BeneficiarioForm = z.infer<typeof beneficiarioSchema>;
export type TestamentoForm = z.infer<typeof testamentoSchema>;
