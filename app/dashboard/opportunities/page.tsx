"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import OpportunityFilters from "../../../components/opportunities/OpportunityFilters";
import OpportunityGrid from "../../../components/opportunities/OpportunityGrid";
import OpportunityHeader from "../../../components/opportunities/OpportunityHeader";
import OpportunitySidebar from "../../../components/opportunities/OpportunitySidebar";
import OpportunitySkeleton from "../../../components/opportunities/OpportunitySkeleton";
import OpportunityStats from "../../../components/opportunities/OpportunityStats";
import {
  calculateOpportunityStats,
  getOpportunitySummary,
  getTodaysOpportunities,
} from "../../../services/opportunities";
import type {
  Opportunity,
  OpportunityFiltersState,
  OpportunitySummary,
} from "../../../types/opportunity";

const DEFAULT_FILTERS: OpportunityFiltersState = {
  marketplace: "All",
  category: "All",
  competition: "All",
  minScore: 80,
  search: "",
};

const EMPTY_SUMMARY: OpportunitySummary = {
  topCategories: [],
  bestMarketplaceToday: "No data",
  highestMarginProduct: null,
  highestConfidenceProduct: null,
  aiSummary:
    "No products currently match these filters. Expand filters to unlock the strongest opportunities.",
  quickTips: [],
};

export default function OpportunitiesPage() {
  const [filters, setFilters] = useState<OpportunityFiltersState>(DEFAULT_FILTERS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [summary, setSummary] = useState<OpportunitySummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOpportunities = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getTodaysOpportunities();
      setOpportunities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load opportunities.");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadOpportunities(false);
  }, [loadOpportunities]);

  const categories = useMemo(() => {
    return Array.from(new Set(opportunities.map((item) => item.category))).sort();
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    const normalizedQuery = filters.search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const matchMarketplace =
        filters.marketplace === "All" || item.marketplace === filters.marketplace;
      const matchCategory = filters.category === "All" || item.category === filters.category;
      const matchCompetition =
        filters.competition === "All" || item.competition === filters.competition;
      const matchScore = item.opportunityScore >= filters.minScore;
      const matchSearch =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.marketplace.toLowerCase().includes(normalizedQuery);

      return (
        matchMarketplace &&
        matchCategory &&
        matchCompetition &&
        matchScore &&
        matchSearch
      );
    });
  }, [filters, opportunities]);

  const stats = useMemo(() => {
    return calculateOpportunityStats(filteredOpportunities);
  }, [filteredOpportunities]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const nextSummary = await getOpportunitySummary(filteredOpportunities);
      if (!cancelled) {
        setSummary(nextSummary);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [filteredOpportunities]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.08),transparent_35%),radial-gradient(circle_at_100%_0%,rgba(139,92,246,0.1),transparent_35%),linear-gradient(to_bottom,#f8fafc,#f8fafc)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px] space-y-6">
        <OpportunityHeader
          onRefresh={() => {
            void loadOpportunities(true);
          }}
          refreshing={refreshing}
        />

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <OpportunityStats stats={stats} />

        <OpportunityFilters
          filters={filters}
          categories={categories}
          onChange={setFilters}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {loading ? (
            <OpportunitySkeleton />
          ) : (
            <OpportunityGrid opportunities={filteredOpportunities} />
          )}
          <OpportunitySidebar summary={summary} />
        </div>
      </div>
    </div>
  );
}

