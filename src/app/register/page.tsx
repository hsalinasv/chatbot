"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsappNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          whatsappNumber: formData.whatsappNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Registro exitoso! Bienvenido a WhatsApp Bot');
        router.push('/dashboard');
      } else {
        setError(data.error || 'Error al registrar el negocio');
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WhatsApp Bot</h1>
              <p className="text-sm text-gray-600">Sistema de Agendamiento</p>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription>
              Registra tu negocio y comienza a automatizar tus citas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Negocio *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ej: Salón Bella Vista"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@negocio.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+52 123 456 7890"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  type="tel"
                  placeholder="+52 123 456 7890"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  Número donde se conectará el chatbot
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            passwordStrength >= level
                              ? passwordStrength <= 2
                                ? 'bg-red-500'
                                : passwordStrength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">
                      {passwordStrength <= 2 && 'Contraseña débil'}
                      {passwordStrength === 3 && 'Contraseña media'}
                      {passwordStrength >= 4 && 'Contraseña fuerte'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center space-x-2">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Las contraseñas coinciden</span>
                      </>
                    ) : (
                      <span className="text-xs text-red-600">Las contraseñas no coinciden</span>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-600 hover:bg-green-700"
                disabled={isLoading || formData.password !== formData.confirmPassword}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-green-900 mb-3">¿Qué obtienes al registrarte?</h3>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Chatbot de WhatsApp personalizado</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Integración con Google Sheets y Calendar</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Panel de control completo</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Soporte técnico incluido</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}