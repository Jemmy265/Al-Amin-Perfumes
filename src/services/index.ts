import { createApiDataSource } from "./apiDataSource";
import type { StoreDataSource } from "./dataSource";
import { staticDataSource } from "./staticDataSource";

const mode = import.meta.env.VITE_DATA_SOURCE ?? "static";
const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;

/** API first when configured, bundled seed data as a fallback. */
export const dataSource: StoreDataSource =
  mode === "api" && apiBase
    ? {
        async load() {
          try {
            return await createApiDataSource(apiBase).load();
          } catch (err) {
            console.warn("API unavailable, using bundled catalog", err);
            return staticDataSource.load();
          }
        },
      }
    : staticDataSource;

export type { StoreData, StoreDataSource } from "./dataSource";
