export const useFormat = () => {
  const formatDate = (value: string | Date) => {
    const date = typeof value === "string" ? new Date(value) : value;
    return date.toLocaleDateString("de-DE");
  };

  const formatDateTime = (value: string | Date) => {
    const date = typeof value === "string" ? new Date(value) : value;
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

  return {
    formatDate,
    formatDateTime,
    formatDecimal,
    formatDateForInput,
  };
};
