import { describe, expect, it } from "vitest";
import { SEED_CONTENT, SEED_SETTINGS } from "../../data/seed/content";
import { contentSchema, DEFAULT_SECTIONS, normalizeSections, settingsSchema, siteImageKeys } from "../content";
import { fieldErrors } from "../product";

describe("site content validation", () => {
  it("accepts the real current site content and settings unchanged", () => {
    const c = contentSchema.safeParse(SEED_CONTENT);
    expect(c.success ? "ok" : fieldErrors(c.error)).toBe("ok");
    const s = settingsSchema.safeParse(SEED_SETTINGS);
    expect(s.success ? "ok" : fieldErrors(s.error)).toBe("ok");
  });

  it("rejects empty required texts and bad settings — in Arabic", () => {
    const c = contentSchema.safeParse({ ...SEED_CONTENT, hero: { ...SEED_CONTENT.hero, slogan: "  " }, announcements: [] });
    const e = fieldErrors(c.error!);
    expect(e["hero.slogan"]).toBe("اكتب الشعار");
    expect(e.announcements).toBe("اكتب عرض واحد على الأقل");
    const s = settingsSchema.safeParse({ ...SEED_SETTINGS, whatsappNumber: "01006747034", email: "x", social: { ...SEED_SETTINGS.social, tiktok: "http://x.com" } });
    const se = fieldErrors(s.error!);
    expect(Object.keys(se).sort()).toEqual(["email", "social.tiktok", "whatsappNumber"]);
  });

  it("only allows bundled or uploaded images", () => {
    for (const bad of ["https://evil.example/x.jpg", "/images/../secret.jpg", "javascript:alert(1)"])
      expect(contentSchema.safeParse({ ...SEED_CONTENT, hero: { ...SEED_CONTENT.hero, image: bad } }).success).toBe(false);
    expect(contentSchema.safeParse({ ...SEED_CONTENT, hero: { ...SEED_CONTENT.hero, image: "/images/site/abc-1.webp" } }).success).toBe(true);
    expect(siteImageKeys({ hero: { ...SEED_CONTENT.hero, image: "/images/site/a.webp" }, about: SEED_CONTENT.about })).toEqual(["site/a.webp"]);
  });

  it("repairs section settings from older or damaged data", () => {
    expect(normalizeSections(undefined)).toEqual(DEFAULT_SECTIONS);
    const s = normalizeSections([{ id: "faq", visible: false }, { id: "faq", visible: true }, { id: "nope" as never, visible: true }]);
    expect(s[0]).toEqual({ id: "faq", visible: false });
    expect(s).toHaveLength(DEFAULT_SECTIONS.length);
  });
});
