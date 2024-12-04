import Image from 'next/image';
import Link from 'next/link';
import logoImg from '../../assets/logo.svg';
import { HeaderContainer } from '@/src/styles/pages/header';

import { Cart } from '../Cart';
import { useRouter } from 'next/router';

export function Header() {
  const { pathname } = useRouter();

  const showCartButton = pathname !== '/success';

  return (
    <HeaderContainer>
      <Link href="/">
        <Image src={logoImg} alt="" />
      </Link>

      {showCartButton && <Cart />}
    </HeaderContainer>
  )
}