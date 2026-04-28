export function currency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

export function formatTimeRange(departureTime, arrivalTime) {
  return `${departureTime} - ${arrivalTime}`;
}

export function statusClasses(status) {
  if (status === "CNF") return "bg-success/20 text-success";
  if (status === "RAC") return "bg-warning/20 text-warning";
  if (status === "WL") return "bg-danger/20 text-danger";
  return "bg-slate-600/30 text-slate-200";
}
