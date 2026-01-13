'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20"></div>
        
        <div className="relative max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full mb-6 border border-green-400/30">
              <CheckCircle2 className="w-10 h-10 text-green-300" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">¡Cuenta creada!</h2>
            <p className="text-blue-100 mb-6">Tu cuenta ha sido creada exitosamente</p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Redirigiendo al dashboard...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20"></div>
      
      {/* Formas decorativas */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-md w-full">
        {/* Card con glassmorphism */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Crea tu cuenta</h1>
            <p className="text-blue-100">Comienza a proteger a tu familia hoy</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
            <div className="space-y-2 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                <span>Guarda tus testamentos en la nube</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                <span>Edita cuando quieras, sin costo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                <span>Acceso desde cualquier dispositivo</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="text-xs text-white/60 mt-1.5">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-600 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70">¿Ya tienes cuenta?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="block w-full bg-white/10 backdrop-blur-sm text-white py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all text-center border border-white/20"
          >
            Iniciar Sesión
          </Link>

          {/* Security Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white/80 border border-white/20">
              <Shield className="w-4 h-4" />
              <span>Datos protegidos con encriptación</span>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-white/70 hover:text-white text-sm transition inline-flex items-center gap-2">
              ← Volver al inicio
            </Link>
          </div>
        </div>

        {/* Extra Info */}
        <p className="text-center text-white/60 text-sm mt-6">
          Al crear una cuenta, aceptas nuestros términos de servicio y política de privacidad
        </p>
      </div>
    </div>
  );
}