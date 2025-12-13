// lib/calculos-legales.ts
import { Beneficiario, ResultadoCalculoHerencia } from './types';

/**
 * Calcula la distribución de herencia según el Código Civil chileno (simplificado)
 * 
 * Regla básica:
 * - 50% para herederos forzosos (legítima)
 * - 50% libre disposición (mejoras + cuarta libre)
 */
export function calcularDistribucionHerencia(
  beneficiarios: Beneficiario[],
  totalBienes: number
): ResultadoCalculoHerencia {
  
  // Identificar herederos forzosos
  const herederosForzosos = beneficiarios.filter(b => b.esHerederoForzoso);
  const otrosBeneficiarios = beneficiarios.filter(b => !b.esHerederoForzoso);
  
  // Cálculo simplificado
  const legitima = totalBienes * 0.5; // 50% para herederos forzosos
  const libreDisposicion = totalBienes * 0.5; // 50% libre
  
  const distribucion = beneficiarios.map(beneficiario => {
    let monto = 0;
    
    if (beneficiario.esHerederoForzoso) {
      // Herederos forzosos se reparten la legítima según porcentaje
      const porcentajeDeLegitima = beneficiario.porcentaje / 
        herederosForzosos.reduce((sum, b) => sum + b.porcentaje, 0);
      monto = legitima * porcentajeDeLegitima;
    } else {
      // Otros beneficiarios reciben de la libre disposición
      const porcentajeDeLibre = beneficiario.porcentaje / 
        otrosBeneficiarios.reduce((sum, b) => sum + b.porcentaje, 0);
      monto = libreDisposicion * porcentajeDeLibre;
    }
    
    return {
      beneficiario: beneficiario.nombre,
      monto: Math.round(monto),
      porcentaje: beneficiario.porcentaje,
    };
  });
  
  return {
    totalBienes,
    legitima: Math.round(legitima),
    mejorasYLibre: Math.round(libreDisposicion),
    distribucion,
  };
}

/**
 * Valida que la distribución cumpla requisitos legales básicos
 */
export function validarDistribucionLegal(beneficiarios: Beneficiario[]): {
  valido: boolean;
  errores: string[];
} {
  const errores: string[] = [];
  
  // Verificar suma de porcentajes
  const sumaTotal = beneficiarios.reduce((sum, b) => sum + b.porcentaje, 0);
  if (Math.abs(sumaTotal - 100) > 0.01) {
    errores.push('La suma de porcentajes debe ser 100%');
  }
  
  // Verificar que herederos forzosos tengan al menos 50%
  const herederosForzosos = beneficiarios.filter(b => b.esHerederoForzoso);
  if (herederosForzosos.length > 0) {
    const sumaForzosos = herederosForzosos.reduce((sum, b) => sum + b.porcentaje, 0);
    if (sumaForzosos < 50) {
      errores.push('Los herederos forzosos deben recibir al menos el 50% de la herencia');
    }
  }
  
  return {
    valido: errores.length === 0,
    errores,
  };
}
