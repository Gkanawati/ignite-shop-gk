import { Handbag } from '@phosphor-icons/react';
import { useCart } from '@/src/hooks/useCart';
import { ProductProps } from '@/src/contexts/CartContext';
import { BagButtonContainer } from '@/src/styles/pages/bag-button';

export interface AddToBagButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  product: ProductProps
  disabled?: boolean
}

export function AddToBagButton({ product, disabled, ...props }: AddToBagButtonProps) {
  const { addProductToCart } = useCart();

  return (
    <BagButtonContainer
      {...props}
      type='button'
      onClick={() => !disabled && addProductToCart(product)}
      disabled={disabled}
    >
      <Handbag size={24} weight='bold' />
    </BagButtonContainer>
  )
}