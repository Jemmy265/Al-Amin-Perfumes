import { CartDrawer } from "./components/cart/CartDrawer";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { WhatsAppFloat } from "./components/layout/WhatsAppFloat";
import { PerfumeView } from "./components/product/PerfumeView";
import { QuizModal } from "./components/quiz/QuizModal";
import { Toast } from "./components/ui/Toast";
import { useReveal } from "./hooks/useReveal";
import { About } from "./sections/About";
import { BestSellers } from "./sections/BestSellers";
import { Catalog } from "./sections/Catalog";
import { Contact } from "./sections/Contact";
import { Faq } from "./sections/Faq";
import { Hero } from "./sections/Hero";
import { QuizCta } from "./sections/QuizCta";
import { Reviews } from "./sections/Reviews";
import { CartProvider } from "./state/CartProvider";
import { StoreProvider } from "./state/StoreProvider";
import { UIProvider } from "./state/UIProvider";

function Storefront() {
  useReveal();
  return (
    <>
      <a href="#main" className="skip-link">تخطَّ إلى المحتوى</a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Hero />
        <BestSellers />
        <QuizCta />
        <Catalog />
        <Reviews />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toast />
      <CartDrawer />
      <QuizModal />
      <PerfumeView />
    </>
  );
}

export function App() {
  return (
    <StoreProvider fallback={<div className="boot" aria-busy="true" />}>
      <UIProvider>
        <CartProvider>
          <Storefront />
        </CartProvider>
      </UIProvider>
    </StoreProvider>
  );
}
