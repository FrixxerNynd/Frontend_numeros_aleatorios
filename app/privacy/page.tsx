import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
    const sections = [
        {
            title: "1. Recopilación de Información",
            content: "Recopilamos datos personales al registrarte, como nombre, correo electrónico, fecha de nacimiento y detalles de pago. También recopilamos información técnica de forma automática, incluyendo dirección IP, tipo de navegador y datos de comportamiento en el sitio para mejorar nuestra seguridad."
        },
        {
            title: "2. Uso de tus Datos",
            content: "Utilizamos tu información para gestionar tu cuenta, procesar transacciones, cumplir con regulaciones legales contra el blanqueo de capitales y enviarte comunicaciones promocionales solo si has otorgado tu consentimiento explícito."
        },
        {
            title: "3. Protección y Seguridad",
            content: "Implementamos protocolos de seguridad de última generación (encriptación SSL) para proteger tus datos contra el acceso no autorizado. Tus fondos y datos personales se mantienen en servidores seguros con auditorías periódicas de ciberseguridad."
        },
        {
            title: "4. Compartir con Terceros",
            content: "No vendemos tus datos a terceros. Solo compartimos información con proveedores de servicios de confianza (como procesadores de pagos) y autoridades legales cuando sea estrictamente necesario para el funcionamiento del servicio o por requerimiento judicial."
        },
        {
            title: "5. Tus Derechos",
            content: "Tienes derecho a acceder, rectificar o solicitar la eliminación de tus datos personales en cualquier momento. Puedes gestionar tus preferencias de privacidad desde los ajustes de tu cuenta o contactando a nuestro equipo de soporte especializado."
        }
    ];

    return (
        <div className="page auth-wrapper">
            <div className="bg-layer"></div>
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <div className="card" style={{ maxWidth: '800px', margin: '40px 16px' }}>
                <Link href="/" className="link" style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Volver al inicio
                </Link>

                <h1 className="logo-name" style={{ marginBottom: '32px', fontSize: '32px' }}>Política de <span>Privacidad</span></h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {sections.map((section, index) => (
                        <section key={index}>
                            <h2 style={{ color: 'var(--text)', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>{section.title}</h2>
                            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '15px' }}>{section.content}</p>
                        </section>
                    ))}
                </div>

                <footer style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
                    Última actualización: Marzo 2026 | Regnum Casino © Comprometidos con tu seguridad.
                </footer>
            </div>
        </div>
    );
}
