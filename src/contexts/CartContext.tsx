import { createContext, useEffect, useState } from 'react';

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  numberPrice: number;
  defaultPriceId: string;
}

interface CartContextData {
  cart: ProductProps[];
  cartTotal: number;
  addProductToCart: (productItem: ProductProps) => void;
  removeProductFromCart: (productItem: ProductProps) => void;
  checkIfProductIsInCart: (productItem: ProductProps) => boolean;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextData | undefined>(undefined);

export interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<ProductProps[]>([]);

  const cartTotal = cart.reduce((total, product) => {
    return total + product.numberPrice;
  }, 0);

  function addProductToCart(productItem: ProductProps) {
    try {
      const newCart = [...cart, productItem];
      setCart(newCart);
      localStorage.setItem("@ignite-shop-gk:cart", JSON.stringify(newCart));
    } catch (error) {
      console.log('addProductToCart ~ error:', error);
      alert('Ocorreu um erro ao adicionar produto ao carrinho!');
    }
  }

  function removeProductFromCart(productItem: ProductProps) {
    if (window.confirm('Tem certeza que deseja remover este produto do carrinho?')) {
      try {
        const newCart = cart.filter((item) => item.id !== productItem.id);
        setCart(newCart);
        localStorage.setItem("@ignite-shop-gk:cart", JSON.stringify(newCart));
      } catch (error) {
        console.log('removeProductFromCart ~ error:', error);
        alert('Ocorreu um erro ao remover produto do carrinho!');
      }
    }
  }

  function checkIfProductIsInCart(productItem: ProductProps) {
    return cart.some((item) => item.id === productItem.id);
  }

  function clearCart() {
    try {
      setCart([]);
      localStorage.removeItem("@ignite-shop-gk:cart");
    } catch (error) {
      console.log('clearCart ~ error:', error);
    }
  }

  useEffect(() => {
    const localCart = localStorage.getItem("@ignite-shop-gk:cart");
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        addProductToCart,
        removeProductFromCart,
        checkIfProductIsInCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}