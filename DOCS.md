# Guía de Arquitectura: Regnum Casino Frontend

Bienvenido a la documentación del frontend de **Regnum Casino**. Este proyecto está diseñado con un enfoque modular, premium y listo para integrarse con un backend en NestJS.

## 🏗️ Arquitectura de Componentes

Para maximizar el rendimiento y la mantenibilidad, el proyecto divide la página principal en componentes pequeños y enfocados:

### 🧩 Componentes de Interfaz (`components/ui`)
- **`Logo.tsx`**: Branding dinámico con tipografía serif EB Garamond.
- **`Badge.tsx`**: Indicadores de estado (ej. jugadores en línea) con animaciones de pulso.
- **`Tabs.tsx`**: Sistema de navegación entre Login y Registro optimizado para UX.

### 🔐 Componentes de Autenticación (`components/auth`)
- **`AuthLayout.tsx`**: El contenedor maestro que incluye los fondos con gradientes radiales, orbes animados y el efecto de "glassmorphism" de la tarjeta central.
- **`LoginForm.tsx`**: Formulario de inicio de sesión con validaciones de email y manejo de errores del servidor.
- **`RegisterForm.tsx`**: Formulario de registro completo que incluye campos de nombre, apellido y fecha de nacimiento.

## 🔗 Conexión al Backend

El sistema está configurado para conectarse a un backend compatible con los `UseCases` proporcionados:

### Configuración de la API
Toda la configuración centralizada se encuentra en `lib/api-config.ts`.
- **URL Base**: Puedes definirla en la variable de entorno `NEXT_PUBLIC_API_URL`. Por defecto es `http://localhost:3001`.

### Servicio de Autenticación (`lib/services/auth.ts`)
Utiliza la API nativa `fetch` para comunicarse con:
- `POST /auth/login`: Envía `email` y `password`.
- `POST /auth/register`: Envía todos los datos de usuario requeridos para crear una cuenta.

## ✅ Validaciones de Seguridad

### Cliente (Frontend)
- **Edad Mínima**: Se calcula automáticamente para asegurar que el usuario tenga ≥ 18 años.
- **Formato de Email**: Validación mediante expresiones regulares.
- **Seguridad de Contraseña**: Mínimo 8 caracteres, al menos una letra y un número.
- **Coincidencia**: Verificación en tiempo real de que ambas contraseñas del registro sean iguales.

### Servidor (Backend)
El frontend captura y muestra los errores específicos del servidor (ej. "El correo electrónico ya está en uso" o "Nickname no disponible") gracias al manejador `handleResponse`.

## 📜 Páginas Legales
Se han implementado y estilizado las páginas de:
- `/terms`: Términos de Servicio (5 secciones clave).
- `/privacy`: Política de Privacidad y Seguridad (5 secciones clave).

---
*Regnum Casino © 2026 - Donde la fortuna encuentra la elegancia.*
