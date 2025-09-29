// export function formatPriceToIDR(price) {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//   }).format(price);
// }

export function formatPriceToIDR(price, currency = "IDR") {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0, 
  }).format(price);

  return currency === "RP" ? `RP ${formatted.replace("Rp", "").trim()}` : formatted;
}


export function formatPrice(price) {
  const formatted = new Intl.NumberFormat("id-ID").format(price);
  return `${formatted} IDR`;
}