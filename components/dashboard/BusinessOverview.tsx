import StatTile from "../ui/StatTile";
import type { Tone } from "../ui/tone";

const CARDS: Array<{ title: string; value: string; subtitle: string; icon: string; tone: Tone }> = [
  { title: "Revenue Potential", value: "$24,850", subtitle: "+18.2% this month", icon: "💰", tone: "positive" },
  { title: "Winning Products", value: "14", subtitle: "3 products added today", icon: "🚀", tone: "ai" },
  { title: "AI Confidence", value: "96%", subtitle: "Excellent market prediction", icon: "🤖", tone: "data" },
  { title: "Success Probability", value: "91%", subtitle: "Average launch score", icon: "📈", tone: "warning" },
];

export default function BusinessOverview() {
  return (
    <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {CARDS.map((card) => (
        <StatTile key={card.title} {...card} />
      ))}
    </section>
  );
}
