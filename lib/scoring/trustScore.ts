export function calculateTrustScore(
    rating: number,
    orders: number,
    shippingDays: number
  ): number {
    let score = 0;
  
    if (rating >= 4.8) score += 8;
    else if (rating >= 4.5) score += 6;
    else if (rating >= 4.0) score += 4;
  
    if (orders >= 1000) score += 4;
    else if (orders >= 500) score += 2;
  
    if (shippingDays <= 7) score += 3;
    else if (shippingDays <= 12) score += 2;
  
    return Math.min(score, 15);
  }