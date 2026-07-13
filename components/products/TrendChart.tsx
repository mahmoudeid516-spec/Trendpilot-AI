"use client";

import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(
  () =>
    import("recharts").then((mod) => ({
      default: mod.ResponsiveContainer,
    })),
  { ssr: false }
);

const LineChart = dynamic(
  () =>
    import("recharts").then((mod) => ({
      default: mod.LineChart,
    })),
  { ssr: false }
);

const Line = dynamic(
  () =>
    import("recharts").then((mod) => ({
      default: mod.Line,
    })),
  { ssr: false }
);

const XAxis = dynamic(
  () =>
    import("recharts").then((mod) => ({
      default: mod.XAxis,
    })),
  { ssr: false }
);

const YAxis = dynamic(
  () =>
    import("recharts").then((mod) => ({
      default: mod.YAxis,
    })),
  { ssr: false }
);

const Tooltip = dynamic(
  () =>
    import("recharts").then((mod) => ({
      default: mod.Tooltip,
    })),
  { ssr: false }
);

const CartesianGrid = dynamic(
  () =>
    import("recharts").then((mod) => ({
      default: mod.CartesianGrid,
    })),
  { ssr: false }
);

const data = [
  { day: "Mon", trend: 62 },
  { day: "Tue", trend: 68 },
  { day: "Wed", trend: 74 },
  { day: "Thu", trend: 80 },
  { day: "Fri", trend: 86 },
  { day: "Sat", trend: 91 },
  { day: "Sun", trend: 96 },
];

export default function TrendChart() {
  return (
    <section className="mt-12 bg-white rounded-3xl shadow p-8">
      <h2 className="text-3xl font-bold mb-8">
        📈 Trend Growth
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="trend"
              stroke="#7C3AED"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}