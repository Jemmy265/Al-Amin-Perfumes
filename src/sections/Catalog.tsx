import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/product/ProductCard";
import { Icon } from "../components/ui/Icon";
import { SectionHead } from "../components/ui/SectionHead";
import { matchesSearch, searchText } from "../domain/search";
import { waLink } from "../domain/whatsapp";
import { Pagination } from "../components/ui/Pagination";
import { Reveal, useScrollTo } from "../motion";
import { useStore } from "../state/StoreProvider";
import type { Audience, ScentFamily } from "../types/catalog";

type AudienceFilter = Audience | "all";
const AUDIENCE_ORDER: AudienceFilter[] = ["all", "women", "men", "unisex"];
const SCENT_ORDER: ScentFamily[] = ["fresh", "sweet", "woody", "fruity"];
export const PAGE_SIZE = 9;

export function Catalog() {
  const { content, products, labels, settings } = useStore();
  const [audience, setAudience] = useState<AudienceFilter>("all");
  const [scent, setScent] = useState<ScentFamily | "">("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const scrollTo = useScrollTo();

  const indexed = useMemo(() => products.map((p) => ({ p, text: searchText(p, labels) })), [products, labels]);
  const visible = indexed
    .filter(({ p, text }) =>
      (audience === "all" || p.tags.audience === audience) &&
      (!scent || p.tags.scents.includes(scent)) &&
      matchesSearch(text, query))
    .map(({ p }) => p);

  // Any change to filters or search starts again from page 1.
  useEffect(() => { setPage(1); }, [audience, scent, query]);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const first = (current - 1) * PAGE_SIZE;
  const pageItems = visible.slice(first, first + PAGE_SIZE);

  const goTo = (p: number) => {
    setPage(Math.min(Math.max(1, p), pages));
    scrollTo("#catalog-results");
  };

  const count = (a: AudienceFilter) => (a === "all" ? products.length : products.filter((p) => p.tags.audience === a).length);
  const reset = () => { setQuery(""); setScent(""); setAudience("all"); };

  return (
    <section className="section catalog" id="products" aria-labelledby="catalog-title">
      <div className="container">
        <SectionHead head={content.catalog} id="catalog-title" />

        <div className="catalog-layout">
          <aside className="filters" aria-label="البحث والتصفية">
            <div className="search-box">
              <Icon name="search" className="search-icon" />
              <label htmlFor="product-search" className="visually-hidden">ابحث عن عطر</label>
              <input
                id="product-search"
                type="search"
                placeholder={content.catalog.searchPlaceholder}
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="مسح البحث"><Icon name="close" /></button>}
            </div>

            <div className="filter-group" role="group" aria-label="لمين">
              <p className="filter-title">لمين</p>
              <div className="filter-options">
                {AUDIENCE_ORDER.map((a) => (
                  <button key={a} type="button" className={`filter-btn${audience === a ? " is-active" : ""}`} aria-pressed={audience === a} onClick={() => setAudience(a)}>
                    {a === "all" ? "الكل" : labels.audience[a]} <span className="filter-count">{count(a)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group" role="group" aria-label="نوع الريحة">
              <p className="filter-title">نوع الريحة</p>
              <div className="filter-options">
                {SCENT_ORDER.map((s) => (
                  <button key={s} type="button" className={`filter-btn${scent === s ? " is-active" : ""}`} aria-pressed={scent === s} onClick={() => setScent(scent === s ? "" : s)}>
                    {labels.scents[s].label}
                  </button>
                ))}
              </div>
            </div>

            {(audience !== "all" || scent || query) && (
              <button type="button" className="clear-filters" onClick={reset}>إعادة ضبط الفلاتر</button>
            )}
          </aside>

          <div className="catalog-results" id="catalog-results">
            <p className="results-count" aria-live="polite">
              <b>{visible.length}</b> عطر
              {pages > 1 && <span className="results-range"> · عرض {first + 1}–{first + pageItems.length}</span>}
            </p>
            {visible.length > 0 ? (
              <>
                {/* Re-keyed per page / filter so each new set of cards animates in */}
                <Reveal key={`${current}|${audience}|${scent}`} className="product-grid" stagger={0.08} distance={44}>
                  {pageItems.map((p) => <ProductCard key={p.id} p={p} />)}
                </Reveal>
                <Pagination page={current} pages={pages} onChange={goTo} />
              </>
            ) : (
              <div className="no-results">
                <p>{content.catalog.noResults}</p>
                <div className="no-results-actions">
                  <button type="button" className="btn btn-outline" onClick={reset}>عرض كل العطور</button>
                  <a className="btn btn-navy" href={waLink(settings.whatsappNumber, settings.generalWhatsappMessage)} target="_blank" rel="noopener">اسألنا على واتساب</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
