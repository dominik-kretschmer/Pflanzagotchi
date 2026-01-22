export const useFormat = () => {
  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return "-";
    const date = typeof value === "string" ? new Date(value) : value;
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("de-DE");
  };

  const formatDateTime = (value: string | Date | null | undefined) => {
    if (!value) return "-";
    const date = typeof value === "string" ? new Date(value) : value;
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("de-DE");
  };

  const formatDecimal = (value: string | number) => {
    const num = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(num)) return "-";
    return num.toFixed(2);
  };

  const formatDateForInput = (value: string | Date | null | undefined) => {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const todayIso = () => new Date().toISOString();

  const updateIsoFromInput = (oldIso: string, newValue: string) => {
    if (!newValue) return oldIso;
    const [y, m, d] = newValue.split("-").map(Number);
    const date = new Date(oldIso);
    date.setFullYear(y, m - 1, d);
    return date.toISOString();
  };

  return {
    formatDate,
    formatDateTime,
    formatDecimal,
    formatDateForInput,
    todayIso,
    updateIsoFromInput,
  };
};
