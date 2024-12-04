import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { SuccessContainer, ImageContainer, ImagesContainer } from '../styles/pages/success';

interface SuccessProps {
  customerName: string;
  productsImages: string[];
}

export default function Success({ customerName, productsImages }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name='robots' content='noindex' />
      </Head>

      <SuccessContainer>
        <ImagesContainer>
          {productsImages.map((image, index) => (
            <ImageContainer key={index}>
              <Image src={image} alt="" width={130} height={145} />
            </ImageContainer>
          ))}
        </ImagesContainer>

        <h1>Compra efetuada!</h1>

        <p>
          Uhuul! {customerName}, sua compra de {productsImages.length} {productsImages.length > 1 ? 'produtos' : 'produto'} foi efetuada com sucesso! 🎉
        </p>

        <Link href="/">
          Voltar ao Catálogo
        </Link>
      </SuccessContainer>
    </>
  )
}

// checkout_session_id vem como query param na url
// fetch de dados -> 3 maneiras
// Client-side (useEffect) || getServerSideProps || getStaticProps

// client-side, 2 problemas:
// deverá possui uma loading screen e
// a é questão de segurança pois os tokens do stripe ficarão expostos

// getStaticProps -> não faz sentido para esse caso pois a url vem com o checkout_session_id que é dinâmico

// getServerSideProps -> é a melhor opção pois não expõe os tokens e a url é dinâmica

export const getServerSideProps: GetServerSideProps = async ({ query, params }) => {
  const sessionId = query.session_id;

  if (!sessionId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(String(sessionId), {
      expand: ['line_items', 'line_items.data.price.product']
    });

    const lineItems = session.line_items?.data;

    if (!lineItems || lineItems.length === 0) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      };
    }

    const customerName = session.customer_details?.name;
    const productsImages = lineItems.map(item => {
      if (!item.price) return '';

      const product = item.price.product as Stripe.Product;

      return product.images[0];
    })

    return {
      props: {
        customerName,
        productsImages,
      }
    }
  } catch (error) {
    console.log('Error fetching checkout session:', error);

    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
}
