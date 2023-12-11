import ImageBanner from "../componentss/banner/Banner";
import { useFetchProductsQuery } from "../reducers/productsApiSlice";
import { useEffect, Suspense, lazy } from "react";
import LoadingGrid from "../componentss/spinners/LoadingGrid";
import Brands from "../componentss/brands/Brands";

const LazyCategories = lazy(() =>
  import("../componentss/categories/Categories")
);
const LazyFeaturedProducts = lazy(() =>
  import("../componentss/featured-products/FeaturedProducts")
);
const LazyLatestProducts = lazy(() =>
  import("../componentss/latest-products/LatestProducts")
);

export default function Home() {
  const { data, isLoading, isError, refetch } = useFetchProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <LoadingGrid />;
  }

  if (isError) {
    return <p>Error fetching product data</p>;
  }

  return (
    <div>
      <ImageBanner
        imageUrl='https://www.bing.com/rp/fY0wJ-QaIKghQ87Qs9ufsshTAws.png'
        altText='Banner'
        linkUrl='/products'
        bannerText='Shop Now'
      />

      <Suspense fallback={<LoadingGrid />}>
        <LazyCategories />
        <LazyFeaturedProducts products={data?.products} />
        <LazyLatestProducts products={data?.products} />

        <Brands products={data?.products} />
      </Suspense>
    </div>
  );
}
