export function calculateROI(
    buyPrice: number,
    sellingPrice: number,
    adSpend: number,
    sales: number
  ) {
    const revenue = sellingPrice * sales;
  
    const productCost = buyPrice * sales;
  
    const totalCost = productCost + adSpend;
  
    const profit = revenue - totalCost;
  
    const roi =
      totalCost > 0
        ? Number(((profit / totalCost) * 100).toFixed(1))
        : 0;
  
    return {
      revenue,
      productCost,
      totalCost,
      profit,
      roi,
    };
  }