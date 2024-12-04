import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { useCart } from '../hooks/useCart';
import { useKeenSlider } from 'keen-slider/react';
import { HomeContainer, Product } from '../styles/pages/home';

import { ProductSkeleton } from '../components/ProductSkeleton';
import { AddToBagButton } from '../components/AddToBagButton';
import { ProductProps } from '../contexts/CartContext';

import 'keen-slider/keen-slider.min.css';
import { useState, useEffect } from 'react';

interface HomeProps {
  products: ProductProps[]
}

export default function Home({ products }: HomeProps) {
  const { checkIfProductIsInCart } = useCart();

  const [isLoading, setIsLoading] = useState(true);

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2.25,
      spacing: 32,
    }
  });

  const [loadingSliderRef] = useKeenSlider({
    slides: {
      perView: 2.25,
      spacing: 32,
    }
  });

  useEffect(() => {
    // simular loading do skeleton do Figma
    const timeOut = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearTimeout(timeOut);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      {isLoading && (
        <HomeContainer ref={loadingSliderRef} className="keen-slider">
          {Array.from({ length: 3 }).map((_, index) => (
            <ProductSkeleton className="keen-slider__slide" key={index} />
          ))}
        </HomeContainer>
      )}

      {!isLoading && (
        <HomeContainer ref={sliderRef} className="keen-slider">
          {products.map(product => (
            // prefetch = carrega a pág do link quando o link estiver no viewport
            // tomar cuidado com o prefetch, pois pode carregar muitas páginas desnecessariamente
            <Product className="keen-slider__slide" key={product.id}>
              <Link href={`/product/${product.id}`} prefetch={false}>
                <Image
                  src={product.imageUrl}
                  width={520}
                  height={480}
                  alt=""
                />
              </Link>

              <footer>
                <div>
                  <Link href={`/product/${product.id}`} prefetch={false}>
                    <strong>{product.name}</strong>
                  </Link>
                  <span>{product.price}</span>
                </div>

                <AddToBagButton product={product} disabled={checkIfProductIsInCart(product)} />
              </footer>
            </Product>
          ))
          }
        </HomeContainer>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // getStaticProps => gera uma página estática no momento da build
  // salva em cache e serve para todos os usuários

  // em desenvolvimento, ele irá gerar a página a cada requisição (atua como getServerSideProps)
  // em produção, ele irá gerar a página uma única vez (no build) e servir para todos os usuários

  // quando usa getStaticProps, não tem acesso ao contexto da requisição (req, res)
  // não é possível acessar cookies, headers, etc -> não é possível acessar informações do usuário por ex.

  const response = await stripe.products.list({
    expand: ['data.default_price']
  });

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      description: product.description,
      defaultPriceId: price.id,
      numberPrice: (price.unit_amount ?? 0) / 100,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format((price.unit_amount ?? 0) / 100),
    }
  });

  return {
    props: {
      products
    },
    // revalidate -> numero em segundos que a página irá ser revalidada (refetch)
    revalidate: 60 * 60 * 2 // 2 horas
  }
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   // quando possuir uma promise nessa camada do Next (Server Side -> Servidor node do Next),
//   // ele irá aguardar a promise ser resolvida para então renderizar a página

//   // realizar chamadas api apenas para informações que são necessárias para a renderização da página
//   // que são cruciais para o SEO da página

//   const response = await stripe.products.list({
//     expand: ['data.default_price']
//   });

//   const products = response.data.map(product => {
//     const price = product.default_price as Stripe.Price;

//     return {
//       id: product.id,
//       name: product.name,
//       imageUrl: product.images[0],
//       price: (price.unit_amount ?? 0) / 100
//     }
//   });

//   return {
//     props: {
//       products
//     }
//   }
// }