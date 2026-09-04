# 🏍️ BikerParts - Repuestos • Venta • Cambio

![BikerParts Logo](/public/logo.png)

Plataforma web moderna tipo **E-commerce y Landing Page** especializada en la **compra, venta e intercambio/permuta de repuestos de motocicletas**, diseñada con una identidad visual biker en **morado, blanco y negro**, inspirada en la comunidad motera más grande y confiable.

---

## ✨ Características Principales

- **🎨 Identidad Visual BikerParts**:
  - Logo oficial BikerParts con estética deportiva y dinámica.
  - Paleta en morado vibrante (`#7c3aed`, `#9333ea`, `#c084fc`), negro carbón nocturno y blanco limpio.

- **👑 Cuenta Única de Administrador Maestro & Panel de Control Total**:
  - **Credenciales**: `admin@bikerparts.co` / `AdminBiker2026!` (con botón de acceso directo en 1 clic en el modal de inicio).
  - **Gestor de Productos**: Edición y eliminación directa en el catálogo o desde el panel administrativo, control de stock y precios.
  - **Gestor de Cupones Dinámicos**: Creación, activación, edición y eliminación de códigos promocionales a tu antojo (`BIKER10`, `MOTOFREE`, `PROMO20`, etc.).
  - **Gestor de Pedidos & Facturación**: Supervisión de órdenes, actualización de estado (*En preparación*, *Despachado*, *Entregado*, *Cancelado*) y consulta de detalles de pago.
  - **Gestor de Permutas**: Supervisión y aprobación de propuestas de intercambio enviadas por usuarios.
  - **Métricas del Negocio**: Facturación total en COP, catálogo activo, pedidos en curso y cupones vigentes.

- **💳 Pasarelas de Pago Detalladas y Seguras por Método**:
  - **Tarjeta de Crédito / Débito**: Número con formato automático de 16 dígitos, franquicia detectada (Visa, Mastercard, Amex), titular, fecha `MM/AA`, código de seguridad CVV y selector de cuotas (1 a 36).
  - **Nequi**: Celular de 10 dígitos, cédula del titular, clave dinámica de 6 dígitos (App Nequi) o notificación push.
  - **PSE / Bancos**: Selector completo de bancos colombianos (Bancolombia, Davivienda, Nu Colombia, Banco de Bogotá, etc.), tipo de persona (Natural/Jurídica), tipo y número de documento, correo PSE.
  - **Contra Entrega Seguro**: Cédula física de verificación de quien recibe, teléfono de respaldo, monto con el que pagará en efectivo (para cambio exacto), franja horaria preferida y confirmación de seguridad.

- **🤖 IA Buscador & IA Asistente Biker_**:
  - Buscador inteligente en el Hero con filtrado en tiempo real y chips rápidos (*Filtro de aire*, *Pastas de freno*, *Kit de arrastre*, *Casco*, *Batería*).
  - Asistente virtual tipo chatbot integrado para asesoría mecánica, consulta de compatibilidad por modelo de moto y recomendaciones directas del catálogo.

- **🛒 Carrito de Compras Funcional**:
  - Panel deslizable (drawer) con ajuste de cantidades, eliminación y cálculo automático.
  - Indicador de envío gratuito para pedidos superiores a $150.000 COP.
  - Checkout completo con lluvia de confeti y recibo digital de seguimiento.

- **🔄 Sistema Híbrido: Venta vs Permuta (Cambio)**:
  - Pestañas independientes: **Repuestos en venta** vs **Repuestos para cambio**.
  - Modal para proponer permutas directas entre motociclistas.
  - Modal **"Publicar anuncio"** para que los usuarios listen sus propios repuestos (guardados al instante en la base de datos local).

---

## 🚀 Tecnologías Utilizadas

- **React 19**
- **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Iconografía de alta fidelidad)
- **Canvas-Confetti**

---

## 💻 Instalación y Uso Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/zkdlinrai/motomarket.git bikerparts
   cd bikerparts
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:5173/`.

---

Desarrollado con pasión biker para toda la comunidad motociclista 🇨🇴.
