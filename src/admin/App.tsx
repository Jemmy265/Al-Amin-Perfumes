import { useEffect, useState } from "react";
import { FeedbackProvider } from "./components/feedback";
import { Shell } from "./components/Shell";
import { api, SESSION_EXPIRED } from "./lib/api";
import { useRoute } from "./lib/router";
import { PricingProvider, ProductsProvider } from "./lib/store";
import { Content } from "./pages/Content";
import { Login } from "./pages/Login";
import { Order } from "./pages/Order";
import { Overview } from "./pages/Overview";
import { Pricing } from "./pages/Pricing";
import { ProductForm } from "./pages/ProductForm";
import { Products } from "./pages/Products";
import { QuizTags } from "./pages/QuizTags";

type Auth = "checking" | "in" | "out" | "offline";

export function AdminApp() {
  const [auth, setAuth] = useState<Auth>("checking");

  useEffect(() => {
    // The server decides: the session cookie is HttpOnly, so the app just asks.
    api.me().then((r) => setAuth(r.authenticated ? "in" : "out")).catch(() => setAuth("offline"));
    const expired = () => setAuth("out");
    window.addEventListener(SESSION_EXPIRED, expired);
    return () => window.removeEventListener(SESSION_EXPIRED, expired);
  }, []);

  return (
    <FeedbackProvider>
      {auth === "checking" && <div className="a-boot" aria-busy="true" />}
      {auth === "offline" && (
        <div className="a-center-screen">
          <div className="a-login-card">
            <h1 className="a-display">تعذّر الاتصال</h1>
            <p>الخادم مش متاح دلوقتي أو مفيش إنترنت.</p>
            <button type="button" className="a-btn a-btn--primary a-btn--block" onClick={() => location.reload()}>حاول تاني</button>
          </div>
        </div>
      )}
      {auth === "out" && <Login onDone={() => setAuth("in")} />}
      {auth === "in" && (
        <ProductsProvider>
          <PricingProvider>
            <Dashboard onLogout={() => setAuth("out")} />
          </PricingProvider>
        </ProductsProvider>
      )}
    </FeedbackProvider>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const route = useRoute();
  return (
    <Shell route={route} onLogout={onLogout}>
      {route.name === "overview" && <Overview />}
      {route.name === "products" && <Products />}
      {route.name === "new" && <ProductForm key="new" />}
      {route.name === "edit" && <ProductForm key={route.id} id={route.id} />}
      {route.name === "order" && <Order />}
      {route.name === "tags" && <QuizTags />}
      {route.name === "content" && <Content />}
      {route.name === "pricing" && <Pricing />}
    </Shell>
  );
}
