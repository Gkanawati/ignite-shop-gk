import { ProductSkeletonContainer, SkeletonItem } from '@/src/styles/pages/product-skeleton';
import { ComponentProps } from 'react';

export interface ProductSkeletonProps extends ComponentProps<typeof ProductSkeletonContainer> { }

export function ProductSkeleton({ ...props }: ProductSkeletonProps) {
  return (
    <ProductSkeletonContainer {...props}>
      <SkeletonItem />
    </ProductSkeletonContainer>
  )
}