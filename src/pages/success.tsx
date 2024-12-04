import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { SuccessContainer, ImageContainer } from '../styles/pages/success';

interface SuccessProps {
  customerName: string;
  product: {
    name: string;
    imageUrl: string;
  }
}

export default function Success({ customerName, product }: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name='robots' content='noindex' />
      </Head>

      <SuccessContainer>
        <h1>Compra efetuada!</h1>

        <ImageContainer>
          <Image src={product.imageUrl} alt={product.name} width={130} height={145} />
        </ImageContainer>

        <p>
          Uhuul! {customerName}, sua <strong>{product.name}</strong> já está a caminho da sua casa.
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
    const product = lineItems[0].price?.product as Stripe.Product;

    return {
      props: {
        customerName,
        product: {
          name: product.name,
          imageUrl: product.images[0],
        }
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
