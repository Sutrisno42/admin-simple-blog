export const months = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: new Date(0, i).toLocaleString("id-ID", { month: "long" }),
  }));
  
  const currentYear = new Date().getFullYear();
  export const years = Array.from({ length: currentYear - 2019 }, (_, i) => ({
    id: 2020 + i,
    name: String(2020 + i),
  }));
  