'use client';

import React, { useState } from 'react';
import './auth.css';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Logo } from '@/components/ui/Logo';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { authService } from '@/lib/services/auth';
import Link from 'next/link';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [registerData, setRegisterData] = useState({
    name: '',
    last_name: '',
    nickname: '',
    born_date: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setErrorMsg(null);
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const onRegister = async (e: React.FormEvent) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await authService.register(registerData);
      console.log('Registro exitoso:', result);
      alert('¡Bienvenido! Tu cuenta ha sido creada.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (e: React.FormEvent) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await authService.login(loginData.email, loginData.password);
      console.log('Login exitoso:', result);
      alert('Has iniciado sesión con éxito.');
      // Aquí podrías guardar el access_token y redirigir
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Logo />
      <Badge count="3,842" label="jugadores en línea" />
      <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

      {errorMsg && (
        <div style={{ padding: '12px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.2)', borderRadius: '10px', color: '#ff4d4d', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {activeTab === 'register' ? (
        <RegisterForm
          onRegister={onRegister}
          loading={loading}
          registerData={registerData}
          handleRegisterChange={handleRegisterChange}
        />
      ) : (
        <LoginForm
          onLogin={onLogin}
          loading={loading}
          loginData={loginData}
          handleLoginChange={handleLoginChange}
        />
      )}

      <p className="footer-text">
        Al registrarte aceptas los <Link href="/terms" className="link">Términos de Servicio</Link> y la <Link href="/privacy" className="link">Política de Privacidad</Link>.<br />
        +18 | Juego responsable
      </p>
    </AuthLayout>
  );
}
