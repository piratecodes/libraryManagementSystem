import { Roboto_Slab } from 'next/font/google'
import "@/css/globals.css";
import Providers from './provider'

const inter = Roboto_Slab({ weight: '400', display: 'swap', subsets: ['latin'] })

//layout imports
import NavBar from '@/components/nav';
import Footer from '@/components/footer';


export const metadata = {
  title: "Library Management",
  description: "This is a library managemnt app created by subham sarkar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NavBar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
