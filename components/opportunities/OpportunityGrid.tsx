"use client";

import OpportunityCard from "./OpportunityCard";
import type { Opportunity } from "../../types/opportunity";

type Props = {
  opportunities: Opportunity[];
};

export default function OpportunityGrid({
  opportunities,
}: Props) {
  console.log("GRID", opportunities);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {opportunities.map((product, index) => (
        <OpportunityCard
          key={`${product.id}-${index}`}
          product={product}
        />
      ))}
    </div>
  );
}