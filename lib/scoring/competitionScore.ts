export function calculateCompetitionScore(score: number): number {
    return Math.min(score, 20);
  }