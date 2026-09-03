import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'motomarket_cart_items';
const ORDERS_STORAGE_KEY = 'motomarket_orders_history';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    }
    // Initial sample items matching the badge count (3 items) seen in reference mockup image!
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
      },
      {
        id: 'prod-7',
        title: 'Batería de Gel Magna 12V 7Ah',
        price: 98000,
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        city: 'Bogotá'
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null); // { code: 'BIKER10', percent: 10 }
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync orders to localStorage
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

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'BIKER10') {
      setAppliedDiscount({ code: 'BIKER10', percent: 10, label: '10% de descuento comunidad biker' });
      return { success: true, message: '¡Cupón BIKER10 aplicado! 10% de descuento.' };
    } else if (cleanCode === 'MOTOFREE') {
      setAppliedDiscount({ code: 'MOTOFREE', freeShipping: true, label: 'Envío gratis asegurado' });
      return { success: true, message: '¡Cupón MOTOFREE aplicado! Envío gratuito.' };
    } else {
      return { success: false, message: 'Cupón inválido o expirado. Prueba con "BIKER10" o "MOTOFREE"' };
    }
  };

  const removeCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
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
      orderId: `MOTO-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...cartItems],
      subtotal,
      discountAmount,
      shippingFee: baseShippingFee,
      total,
      customer: orderDetails,
      status: 'Confirmado - En preparación'
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
        appliedDiscount,
        applyCoupon,
        removeCoupon,
        completeCheckout,
        orders
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
