import { useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import Stripe from 'stripe'
import { stripe } from '@/src/lib/stripe'
import { ButtonsContainer, Button, ImageContainer, ProductContainer, ProductDetails } from '@/src/styles/pages/product'
import { ProductProps } from '@/src/contexts/CartContext'
import { useCart } from '@/src/hooks/useCart'

interface ProductPageProps {
  product: ProductProps;
}

export default function Product({ product }: ProductPageProps) {
  const { addProductToCart, checkIfProductIsInCart } = useCart();

  const [isCreatingCheckoutSessions, setIsCreatingCheckoutSessions] = useState(false);

  const { isFallback } = useRouter()

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSessions(true);

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      });

      const { checkoutUrl } = response.data;


      // redirecionar para páginas internas -> utilizar o useRouter do Next -> router.push('/page')
      // redirecionar para páginas externas -> utilizar window.location.href

      window.location.href = checkoutUrl;
    } catch (error) {
      setIsCreatingCheckoutSessions(false);

      // TODO: handle error
      // conectar com uma ferramente de observabilidade (DataDog / Sentry)
      alert('Falha ao redirecionar ao checkout!')
    }
  }

  if (isFallback) {
    return <p>Carregando...</p>
  }

  const productAlreadyInCart = checkIfProductIsInCart(product);

  return (
    <>
      <Head>
        <title>{String(product.name)} | Ignite Shop</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.imageUrl}
            width={520}
            height={480}
            alt={product.name}
          />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <ButtonsContainer>
            <Button onClick={handleBuyProduct} disabled={isCreatingCheckoutSessions}>
              Comprar agora
            </Button>

            <Button variant="secondary" onClick={() => addProductToCart(product)} disabled={productAlreadyInCart}>
              {productAlreadyInCart ? 'Produto adicionado' : 'Adicionar à sacola'}
            </Button>
          </ButtonsContainer>
        </ProductDetails>
      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Buscar os produtos mais vendidos/mais acessados

  // caso de gargalo -> caso de uso em que se tem muitos produtos -> build ficaria muito pesado, 
  // com milhares de produtos, por exemplo

  return {
    paths: [
      { params: { id: 'prod_QsW6EwBTQljqQm' } },
      { params: { id: 'prod_QsW9dBSjsmSnNf' } },
    ],
    // fallback -> true: se o usuário acessar um produto que não foi gerado na build, 
    // ele irá gerar a página na hora
    fallback: true, // true | false | 'blocking' -> blocking: só vai para a página quando a página estiver pronta
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params?.id

  if (!productId) {
    return {
      notFound: true
    }
  }

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        description: product.description,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format((price.unit_amount ?? 0) / 100),
        numberPrice: (price.unit_amount ?? 0) / 100,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1 // 1 hour
  }
}