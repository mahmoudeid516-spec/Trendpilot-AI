export function calculateProfitScore(
    supplierPrice: number,
    sellingPrice: number
  ): number {
    const margin =
      ((sellingPrice - supplierPrice) / sellingPrice) * 100;
  
    if (margin >= 60) return 25;
    if (margin >= 40) return 18;
    if (margin >= 25) return 10;
  
    return 0;
  }