import { useQuery } from "@tanstack/react-query";
import { getPricingConfig } from "@/lib/pricing.functions";
import type { PricingOverrides } from "@/lib/pricing";

export function usePricingOverrides(): PricingOverrides | null {
  const { data } = useQuery({
    queryKey: ["pricing_config"],
    queryFn: async () => (await getPricingConfig()) ?? null,
    staleTime: 5 * 60_000,
  });
  return (data as PricingOverrides | null) ?? null;
}
