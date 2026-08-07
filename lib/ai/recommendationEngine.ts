export function getRecommendation(
  aiScore: number,
  opportunityScore: number,
  profit: number,
  competition: string
) {
  if (
    aiScore >= 85 &&
    opportunityScore >= 80 &&
    profit >= 20 &&
    competition === "Low"
  ) {
    return "Strong Buy";
  }

  if (
    aiScore >= 70 &&
    opportunityScore >= 65 &&
    profit >= 10
  ) {
    return "Worth Testing";
  }

  return "Avoid";
}