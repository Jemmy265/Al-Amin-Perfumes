import { fmt, priceInfo } from "../../domain/pricing";
import { waLink } from "../../domain/whatsapp";
import { useCart } from "../../state/CartProvider";
import { useStore } from "../../state/StoreProvider";
import { useUI } from "../../state/UIProvider";
import { ProductImage } from "../product/parts";
import { Icon } from "../ui/Icon";
import { Sheet } from "../ui/Sheet";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { settings, byId } = useStore();
  const { state, totals: t, message, setQty, clear, setField } = useCart();
  const C = settings.currency;
  const pct = Math.min(100, (t.subtotal / settings.freeShippingMin) * 100);

  return (
    <Sheet open={cartOpen} onClose={closeCart} variant="drawer" labelledBy="cart-title">
      <header className="sheet-head">
        <h2 id="cart-title" className="sheet-title">سلة المشتريات</h2>
        <button type="button" className="sheet-close" onClick={closeCart} aria-label="إغلاق"><Icon name="close" /></button>
      </header>

      <div className="sheet-body">
        {t.count === 0 ? (
          <div className="cart-empty">
            <Icon name="bag" size={40} />
            <p>السلة فاضية لسه.</p>
            <a className="btn btn-navy" href="#products" onClick={closeCart}>تصفّح العطور</a>
          </div>
        ) : (
          <>
            <div className="free-ship">
              <p>
                {t.free
                  ? <>مبروك! طلبك عليه <b>توصيل مجاني</b></>
                  : <>فاضلك <b>{fmt(settings.freeShippingMin - t.subtotal)} {C}</b> وتاخد <b>توصيل مجاني</b></>}
              </p>
              <div className="free-ship-bar"><span style={{ width: `${pct}%` }} /></div>
            </div>

            <ul className="cart-items">
              {state.items.map((it) => {
                const p = byId(it.id);
                if (!p) return null;
                const { base, final, discounted } = priceInfo(p, it.size, settings);
                return (
                  <li key={`${it.id}|${it.size}`} className="cart-item">
                    <ProductImage p={p} />
                    <div className="cart-item-info">
                      <a href={`#perfume/${p.id}`} className="cart-item-name" onClick={closeCart}>{p.name}</a>
                      <span className="cart-item-sub">
                        {it.size} مل · {fmt(final)} {C}{discounted && <> <s>{fmt(base)}</s></>}
                      </span>
                      <div className="qty">
                        <button type="button" onClick={() => setQty(p.id, it.size, it.qty + 1)} aria-label="زيادة"><Icon name="plus" /></button>
                        <span aria-live="polite">{it.qty}</span>
                        <button type="button" onClick={() => setQty(p.id, it.size, it.qty - 1)} aria-label="تقليل"><Icon name="minus" /></button>
                      </div>
                    </div>
                    <div className="cart-item-end">
                      <b>{fmt(final * it.qty)} <small>{C}</small></b>
                      <button type="button" className="cart-remove" onClick={() => setQty(p.id, it.size, 0)} aria-label={`حذف ${p.name}`}>
                        <Icon name="trash" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {t.count > 0 && (
        <footer className="sheet-foot">
          <label className="field">
            <span>المحافظة (لحساب الشحن)</span>
            <select value={state.zone} onChange={(e) => setField("zone", e.target.value)}>
              <option value="">اختار المحافظة…</option>
              {settings.shippingZones.map((z) => <option key={z.id} value={z.id}>{z.label} — {z.fee} {C}</option>)}
            </select>
          </label>
          <div className="field-row">
            <label className="field">
              <span>الاسم <small>(اختياري)</small></span>
              <input type="text" autoComplete="name" value={state.name} onChange={(e) => setField("name", e.target.value)} />
            </label>
            <label className="field">
              <span>العنوان <small>(اختياري)</small></span>
              <input type="text" autoComplete="street-address" value={state.address} onChange={(e) => setField("address", e.target.value)} />
            </label>
          </div>

          <dl className="cart-summary">
            <div><dt>المجموع</dt><dd>{fmt(t.subtotal)} {C}</dd></div>
            {t.savings > 0 && <div><dt>وفّرت</dt><dd className="savings">- {fmt(t.savings)} {C}</dd></div>}
            <div>
              <dt>الشحن</dt>
              <dd>{t.free ? <span className="free">مجاني</span> : t.zone ? `${fmt(t.shipping ?? 0)} ${C}` : <span className="muted">اختار المحافظة</span>}</dd>
            </div>
            <div className="total"><dt>الإجمالي</dt><dd>{fmt(t.total)} {C}</dd></div>
          </dl>

          <a className="btn btn-whatsapp btn-block" target="_blank" rel="noopener" href={waLink(settings.whatsappNumber, message)}>
            <Icon name="wa" /><span>ابعت الطلب على واتساب</span>
          </a>
          <button type="button" className="cart-clear" onClick={clear}>تفريغ السلة</button>
        </footer>
      )}
    </Sheet>
  );
}
