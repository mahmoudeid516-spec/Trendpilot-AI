"use client";

import { useMemo, useState } from "react";

import ProductGrid from "./ProductGrid";
import SearchBar from "./SearchBar";
import Filters from "./Filters";

type Props = {
  products: any[];
};

export default function ProductsClient({
  products,
}: Props) {
  const [search, setSearch] = useState("");

  const [platform, setPlatform] = useState("");

  const [competition, setCompetition] =
    useState("");

  const [minScore, setMinScore] = useState(0);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = search.toLowerCase();

      const matchesSearch =
        product.name
          ?.toLowerCase()
          .includes(text) ||
        product.category
          ?.toLowerCase()
          .includes(text) ||
        product.country
          ?.toLowerCase()
          .includes(text) ||
        product.supplier
          ?.toLowerCase()
          .includes(text);

      const matchesPlatform =
        !platform ||
        product.platform === platform;

      const matchesCompetition =
        !competition ||
        product.competition === competition;

      const matchesScore =
        Number(product.ai_score) >= minScore;

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesCompetition &&
        matchesScore
      );
    });
  }, [
    products,
    search,
    platform,
    competition,
    minScore,
  ]);

  return (
    <>
      <SearchBar
        value={search}
        onChange={setSearch}
      />

      <Filters
        platform={platform}
        competition={competition}
        minScore={minScore}
        onPlatformChange={setPlatform}
        onCompetitionChange={setCompetition}
        onMinScoreChange={setMinScore}
      />

      <ProductGrid
        products={filteredProducts}
      />
    </>
  );
}