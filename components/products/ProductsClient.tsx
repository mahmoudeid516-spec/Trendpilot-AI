"use client";

import { useMemo, useState } from "react";

import ProductGrid from "./ProductGrid";
import SearchBar from "./SearchBar";
import Filters from "./Filters";

type Props = {
  products: any[];
};

function uniqueSorted(values: Array<string | undefined | null>): string[] {
  const set = new Set(
    values
      .map((value) => (value ?? "").trim())
      .filter((value) => value.length > 0)
  );

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export default function ProductsClient({
  products,
}: Props) {
  const [search, setSearch] = useState("");

  const [platform, setPlatform] = useState("");

  const [competition, setCompetition] =
    useState("");

  const [category, setCategory] = useState("");

  const [country, setCountry] = useState("");

  const [minScore, setMinScore] = useState(0);

  // Every option below is derived from the products actually loaded for
  // this user, never a fixed/guessed taxonomy -- an option only appears
  // if at least one real product has that value.
  const platforms = useMemo(
    () => uniqueSorted(products.map((p) => p.platform)),
    [products]
  );

  const categories = useMemo(
    () => uniqueSorted(products.map((p) => p.category)),
    [products]
  );

  const countries = useMemo(
    () => uniqueSorted(products.map((p) => p.country)),
    [products]
  );

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

      const matchesCategory =
        !category ||
        product.category === category;

      const matchesCountry =
        !country ||
        product.country === country;

      const matchesScore =
        Number(product.ai_score) >= minScore;

      return (
        matchesSearch &&
        matchesPlatform &&
        matchesCompetition &&
        matchesCategory &&
        matchesCountry &&
        matchesScore
      );
    });
  }, [
    products,
    search,
    platform,
    competition,
    category,
    country,
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
        platforms={platforms}
        onPlatformChange={setPlatform}
        competition={competition}
        onCompetitionChange={setCompetition}
        category={category}
        categories={categories}
        onCategoryChange={setCategory}
        country={country}
        countries={countries}
        onCountryChange={setCountry}
        minScore={minScore}
        onMinScoreChange={setMinScore}
      />

      <ProductGrid
        products={filteredProducts}
      />
    </>
  );
}
