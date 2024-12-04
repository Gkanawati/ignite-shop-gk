import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { useKeenSlider } from 'keen-slider/react';
import { HomeContainer, Product } from '../styles/pages/home';
import 'keen-slider/keen-slider.min.css';

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
  }[]
}

export default function Home(props: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2.25,
      spacing: 32,
    }
  });

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">

        {props.products.map(product => (
          // prefetch = carrega a pág do link quando o link estiver no viewport
          // tomar cuidado com o prefetch, pois pode carregar muitas páginas desnecessariamente
          <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
            <Product className="keen-slider__slide">
              <Image
                src={product.imageUrl}
                width={520}
                height={480}
                alt=""
              />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        ))}
      </HomeContainer>
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
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format((price.unit_amount ?? 0) / 100)
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