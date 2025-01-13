import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import { X } from '@phosphor-icons/react/dist/ssr/X';
import { Handbag } from '@phosphor-icons/react/dist/ssr/Handbag';
import { useCart } from '@/src/hooks/useCart';
import { BagButtonContainer } from '@/src/styles/pages/bag-button';
import { CartIndicator } from '@/src/styles/pages/header';
import {
  CartClose,
  CartContent,
  CartFinalization,
  CartProduct,
  CartProductDetails,
  CartProductImage,
  CartProductsList,
  FinalizationDetails,
} from './styles';
import axios from 'axios';

export function Cart() {
  const { cart, cartTotal, removeProductFromCart, clearCart } = useCart();
  const cartQuantity = cart.length;

  const [isCreatingCheckoutSessions, setIsCreatingCheckoutSessions] =
    useState(false);

  async function handleCartCheckout() {
    try {
      setIsCreatingCheckoutSessions(true);

      const response = await axios.post('/api/cart-checkout', {
        products: cart,
      });

      const { checkoutUrl } = response.data;

      clearCart();

      window.location.href = checkoutUrl;
    } catch (error) {
      setIsCreatingCheckoutSessions(false);

      // TODO: handle error
      // conectar com uma ferramente de observabilidade (DataDog / Sentry)
      alert('Falha ao redirecionar ao checkout!');
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <BagButtonContainer variant='secondary' type='button'>
          {cartQuantity > 0 && <CartIndicator>{cartQuantity}</CartIndicator>}
          <Handbag size={24} />
        </BagButtonContainer>
      </Dialog.Trigger>

      <Dialog.Portal>
        <CartContent>
          <CartClose>
            <X size={24} weight='bold' />
          </CartClose>

          <h2>Sacola de Compras</h2>

          {cartQuantity === 0 && <p>Sua sacola está vazia</p>}

          {cartQuantity > 0 && (
            <section>
              <CartProductsList>
                {cart.map((product) => (
                  <CartProduct key={product.id}>
                    <CartProductImage>
                      <Image
                        width={100}
                        height={93}
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </CartProductImage>

                    <CartProductDetails>
                      <p>{product.name}</p>
                      <strong>{product.price}</strong>

                      <button onClick={() => removeProductFromCart(product)}>
                        Remover
                      </button>
                    </CartProductDetails>
                  </CartProduct>
                ))}
              </CartProductsList>
            </section>
          )}

          <CartFinalization>
            <FinalizationDetails>
              <div>
                <span>Quantidade</span>
                <p>
                  {cartQuantity} {cartQuantity > 1 ? 'itens' : 'item'}
                </p>
              </div>

              <div>
                <span>Valor Total</span>
                <p>
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(cartTotal)}
                </p>
              </div>
            </FinalizationDetails>

            <button
              onClick={handleCartCheckout}
              disabled={isCreatingCheckoutSessions || cartQuantity === 0}
            >
              Finalizar compra
            </button>
          </CartFinalization>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
