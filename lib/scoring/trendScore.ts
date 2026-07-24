export function calculateTrendScore(score: number): number {
    return Math.min(score, 20);
  }