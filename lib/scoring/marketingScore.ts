export function calculateMarketingScore(score: number): number {
    return Math.min(score, 20);
  }