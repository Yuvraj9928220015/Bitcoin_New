import { Public_Sans } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { CartProvider } from "@/app/Context/CartContext";
import { AddedToCartNotificationProvider } from "@/app/Context/AddedToCartNotification";
import Script from 'next/script'; //ADD THIS

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: "Buy Luxury Bitcoin Jewelry & Limited Edition Crypto Designs",
  description: "Shop luxury Bitcoin jewelry and crypto jewellery online. Discover limited edition fashion jewellery and unique designs from a premium crypto jewelry store.",
  metadataBase: new URL("https://bitcoinbutik.com/"),
  alternates: {
    canonical: "https://bitcoinbutik.com/",
  },
  icons: {
    icon: "/bitcoine.png",
  },
  verification: {
    google: "CX6DVfsQ2pl9z6d6CuDzlwLg-c4QInjUV6MxA-ZM3a0",
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning={true}>
        <head>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-JE4BBNKPC3"
            strategy="afterInteractive"
          />

          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JE4BBNKPC3');
            `}
          </Script>
        </head>

        <body className={publicSans.className} suppressHydrationWarning={true}>
          <CartProvider>
            <AddedToCartNotificationProvider>
              <div suppressHydrationWarning={true}>
                <Navbar />
                {children}
                <Footer />
              </div>
            </AddedToCartNotificationProvider>
          </CartProvider>
        </body>
      </html>
    </>
  );
}