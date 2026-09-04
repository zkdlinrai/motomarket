import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'bikerparts_cart_items_v2';
const ORDERS_STORAGE_KEY = 'bikerparts_orders_history_v2';
const COUPONS_STORAGE_KEY = 'bikerparts_coupons_v2';

const INITIAL_COUPONS = [
  { code: 'BIKER10', type: 'percent', percent: 10, label: '10% de descuento biker', active: true },
  { code: 'MOTOFREE', type: 'shipping', freeShipping: true, label: 'Envío nacional gratuito', active: true },
  { code: 'PROMO20', type: 'percent', percent: 20, label: '20% especial repuestos', active: true },
  { code: 'BIKERVIP', type: 'percent', percent: 30, label: '30% membresía VIP', active: true }
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    }
    return [
      {
        id: 'prod-1',
        title: 'Farola LED para Yamaha FZ',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        city: 'Bogotá'
      },
      {
        id: 'prod-2',
        title: 'Kit de arrastre Honda CB',
        price: 180000,
        image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        city: 'Medellín'
      }
    ];
  });

  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_COUPONS;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        orderId: 'BP-849201',
        date: '2026-09-02T14:30:00Z',
        items: [
          {
            id: 'prod-4',
            title: 'Casco integral LS2 Rapid II',
            price: 320000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80'
          }
        ],
        subtotal: 320000,
        discountAmount: 32000,
        shippingFee: 0,
        total: 288000,
        customer: {
          fullName: 'Juan Camilo Herrera',
          phone: '+57 312 887 6621',
          email: 'juancamilo@correo.com',
          city: 'Barranquilla',
          address: 'Cra 53 # 79-125, Apto 5B',
          paymentMethod: 'nequi',
          paymentDetails: {
            nequiPhone: '3128876621',
            nequiIdNumber: '1098234871',
            nequiAuthType: 'dinamica'
          }
        },
        status: 'Despachado'
      }
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    } catch (e) {
      console.error('Error saving coupons to localStorage', e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to localStorage', e);
    }
  }, [orders]);

  const addToCart = (product, quantity = 1) => {
    if (product.type === 'cambio') {
      alert('Este repuesto es para INTERCAMBIO/PERMUTA. Puedes usar el botón "Proponer intercambio" en el detalle del producto.');
      return false;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            city: product.city,
            quantity: quantity
          }
        ];
      }
    });

    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedDiscount(null);
  };

  // Coupons application
  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.active);

    if (found) {
      setAppliedDiscount(found);
      return { 
        success: true, 
        message: `¡Cupón ${found.code} aplicado! ${found.label}` 
      };
    } else {
      return { 
        success: false, 
        message: 'Cupón no encontrado, inactivo o vencido.' 
      };
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
  };

  // Admin Coupon Management
  const addCoupon = (newCoupon) => {
    const cleanCode = newCoupon.code.trim().toUpperCase();
    if (!cleanCode) throw new Error('El código de cupón no puede estar vacío.');
    if (coupons.some(c => c.code.toUpperCase() === cleanCode)) {
      throw new Error(`El cupón ${cleanCode} ya existe.`);
    }

    const created = {
      code: cleanCode,
      type: newCoupon.type || 'percent',
      percent: Number(newCoupon.percent) || 10,
      freeShipping: !!newCoupon.freeShipping,
      label: newCoupon.label || `${newCoupon.percent}% de descuento`,
      active: true
    };

    setCoupons(prev => [created, ...prev]);
    return created;
  };

  const deleteCoupon = (codeToDelete) => {
    setCoupons(prev => prev.filter(c => c.code !== codeToDelete));
    if (appliedDiscount?.code === codeToDelete) {
      setAppliedDiscount(null);
    }
  };

  const toggleCouponStatus = (codeToToggle) => {
    setCoupons(prev =>
      prev.map(c => c.code === codeToToggle ? { ...c, active: !c.active } : c)
    );
  };

  // Admin Order Management
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o)
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.orderId !== orderId));
  };

  // Calculations
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = appliedDiscount?.percent
    ? Math.round((subtotal * appliedDiscount.percent) / 100)
    : 0;

  const baseShippingFee = subtotal > 150000 || appliedDiscount?.freeShipping || cartItems.length === 0
    ? 0
    : 12000;

  const total = Math.max(0, subtotal - discountAmount + baseShippingFee);

  const completeCheckout = (orderDetails) => {
    const newOrder = {
      orderId: `BP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...cartItems],
      subtotal,
      discountAmount,
      shippingFee: baseShippingFee,
      total,
      customer: orderDetails,
      status: 'En preparación'
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        discountAmount,
        shippingFee: baseShippingFee,
        total,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        couponCode,
        setCouponCode,
        coupons,
        appliedDiscount,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        toggleCouponStatus,
        orders,
        completeCheckout,
        updateOrderStatus,
        deleteOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
