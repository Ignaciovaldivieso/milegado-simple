// lib/types.ts

export interface DatosPersonales {
  nombre: string;
  apellido: string;
  rut: string;
  fechaNacimiento: string;
  estadoCivil: 'soltero' | 'casado' | 'viudo' | 'divorciado';
  nacionalidad: string;
  direccion: string;
  ciudad: string;
}

export interface Bien {
  id: string;
  tipo: 'inmueble' | 'vehiculo' | 'cuenta_bancaria' | 'otro';
  descripcion: string;
  valorEstimado?: number;
}

export interface Beneficiario {
  id: string;
  nombre: string;
  rut: string;
  relacion: 'hijo' | 'conyuge' | 'padre' | 'hermano' | 'otro';
  porcentaje: number;
  esHerederoForzoso: boolean;
}

export interface Testamento {
  datosPersonales: DatosPersonales;
  bienes: Bien[];
  beneficiarios: Beneficiario[];
  instruccionesEspeciales?: string;
  fechaCreacion: string;
}

export interface ResultadoCalculoHerencia {
  totalBienes: number;
  legitima: number;
  mejorasYLibre: number;
  distribucion: {
    beneficiario: string;
    monto: number;
    porcentaje: number;
  }[];
}
