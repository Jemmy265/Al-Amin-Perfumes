import { CartDrawer } from "./components/cart/CartDrawer";
import { AnnouncementBar } from "./components/layout/AnnouncementBar";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { WhatsAppFloat } from "./components/layout/WhatsAppFloat";
import { PerfumeView } from "./components/product/PerfumeView";
import { QuizModal } from "./components/quiz/QuizModal";
import { Toast } from "./components/ui/Toast";
import { About } from "./sections/About";
import { BestSellers } from "./sections/BestSellers";
import { Catalog } from "./sections/Catalog";
import { Contact } from "./sections/Contact";
import { Faq } from "./sections/Faq";
import { Hero } from "./sections/Hero";
import { QuizCta } from "./sections/QuizCta";
import { Reviews } from "./sections/Reviews";
import { CartProvider } from "./state/CartProvider";
import { StoreProvider, useStore } from "./state/StoreProvider";
import type { ReactNode } from "react";
import { normalizeSections } from "./shared/content";
import type { SectionId } from "./types/content";
import { UIProvider } from "./state/UIProvider";
import { SmoothScroll } from "./motion";

const SECTION_COMPONENTS: Record<SectionId, () => ReactNode> = {
  best: BestSellers, quizCta: QuizCta, catalog: Catalog, reviews: Reviews, about: About, faq: Faq, contact: Contact,
};

/** Homepage sections in the order (and visibility) set from the admin. */
function OrderedSections() {
  const { content } = useStore();
  return <>{normalizeSections(content.sections).filter((s) => s.visible).map((s) => {
    const C = SECTION_COMPONENTS[s.id];
    return <C key={s.id} />;
  })}</>;
}

function Storefront() {
  return (
    <>
      <a href="#main" className="skip-link">تخطَّ إلى المحتوى</a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        <Hero />
        <OrderedSections />
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
          <SmoothScroll>
            <Storefront />
          </SmoothScroll>
        </CartProvider>
      </UIProvider>
    </StoreProvider>
  );
}
