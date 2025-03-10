"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  FilterCarousel,
  FilterCarouselSkeleton,
} from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";

interface Props {
  categoryId?: string;
}

export const CategoriesSection = ({ categoryId }: Props) => {
  return (
    <Suspense fallback={<FilterCarouselSkeleton />}>
      <ErrorBoundary fallback={<FilterCarouselSkeleton />}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSectionSuspense = ({ categoryId }: Props) => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const router = useRouter();

  const data = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);

    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  };

  return <FilterCarousel value={categoryId} onSelect={onSelect} data={data} />;
};
