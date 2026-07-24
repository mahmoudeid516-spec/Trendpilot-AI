import { calculateWinningProbability } from "../scoring/productScore";
import { generateReport } from "./generateReport";

const score = calculateWinningProbability({
  supplierPrice: 8,
  sellingPrice: 29.99,
  rating: 4.8,
  orders: 2400,
  shippingDays: 6,
  trendScore: 18,
  competitionScore: 16,
  marketingScore: 19,
});

console.log(
  generateReport({
    productName: "Portable Blender",
    supplierPrice: 8,
    sellingPrice: 29.99,
    score,
  })
);