# 🏍️ MotoMarket - Repuestos • Venta • Cambio

Plataforma web moderna tipo **E-commerce y Landing Page** especializada en la **compra, venta e intercambio/permuta de repuestos de motocicletas**, diseñada con una identidad visual biker en **morado, blanco y negro**, inspirada en la comunidad motera más grande y confiable.

---

## ✨ Características Principales

- **🎨 Paleta de Colores Exclusiva**:
  - Morado vibrante y acentos neón (`#7c3aed`, `#9333ea`, `#c084fc`).
  - Negro carbón y slate profundo para estética nocturna y deportiva.
  - Blanco y grises limpios para máxima legibilidad de productos y tarjetas.

- **🤖 IA Buscador & IA Asistente Moto_**:
  - Buscador inteligente en el Hero con filtrado en tiempo real y chips rápidos (*Filtro de aire*, *Pastas de freno*, *Kit de arrastre*, *Casco*, *Batería*).
  - Asistente virtual tipo chatbot integrado para asesoría mecánica, consulta de compatibilidad por modelo de moto y recomendaciones directas del catálogo.

- **👤 Registro y Autenticación Persistente**:
  - Formulario de registro con captura de nombre, correo, teléfono celular, ciudad y modelo de motocicleta.
  - Persistencia de sesión y credenciales mediante `localStorage` (los datos se conservan al cerrar o recargar).
  - Perfil de usuario con avatar dinámico, listado de repuestos propios publicados y reputación por estrellas.

- **🛒 Carrito de Compras Funcional**:
  - Panel deslizable (drawer) con ajuste de cantidades, eliminación y cálculo automático.
  - Indicador de envío gratuito para pedidos superiores a $150.000 COP.
  - Soporte de cupones de descuento interactivos (`BIKER10` para 10% OFF y `MOTOFREE` para envío sin costo).
  - Checkout completo con selección de método de pago (*Contra entrega*, *Nequi/Daviplata*, *Tarjeta débito/crédito*, *PSE*), confeti y recibo digital de seguimiento.

- **🔄 Sistema Híbrido: Venta vs Permuta (Cambio)**:
  - Pestañas independientes: **Repuestos en venta** vs **Repuestos para cambio**.
  - Modal para proponer permutas directas entre motociclistas.
  - Modal **"Publicar anuncio"** para que los usuarios listen sus propios repuestos (guardados al instante en la base de datos local).

- **🔧 Comunidad & Soporte**:
  - Sección interactiva de categorías (*Motor, Frenos, Transmisión, Suspensión, Eléctrico, Carrocería, Accesorios, Llantas*).
  - Guías técnicas de mantenimiento preventivo y foro comunitario biker.

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
   git clone https://github.com/zkdlinrai/motomarket.git
   cd motomarket
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
