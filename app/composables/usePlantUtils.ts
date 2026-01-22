export const usePlantUtils = () => {
  const safeText = (v: unknown, fallback = "—") => {
    if (v === null || v === undefined) return fallback;
    const s = String(v).trim();
    return s.length ? s : fallback;
  };

  const yesNoUnknown = (v: unknown) =>
    v === true ? "Ja" : v === false ? "Nein" : "—";

  const pickName = (v: unknown, fallback = "—") => {
    if (!v) return fallback;
    if (typeof v === "string") return safeText(v, fallback);
    if (typeof v === "object") {
      const o = v as any;
      return o.common_name || o.scientific_name || o.name || o.slug || fallback;
    }
    return safeText(v, fallback);
  };

  const normalizeList = (v: unknown): string[] => {
    if (!Array.isArray(v)) return [];
    return v.map((x) => String(x ?? "").trim()).filter(Boolean);
  };

  const isUrl = (s: unknown) =>
    typeof s === "string" && /^https?:\/\//i.test(s);

  const numeric = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const n = Number(value);
      return Number.isNaN(n) ? 0 : n;
    }
    return 0;
  };

  const average = (values: number[]) => {
    if (!values.length) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 10) / 10;
  };

  return {
    safeText,
    yesNoUnknown,
    pickName,
    normalizeList,
    isUrl,
    numeric,
    average,
  };
};
