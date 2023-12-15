import ImageBanner from "../componentss/banner/Banner";
import { useFetchNoQueryProductsQuery } from "../reducers/productsApiSlice";
import { Suspense, lazy } from "react";
import LoadingGrid from "../componentss/spinners/LoadingGrid";
import Brands from "../componentss/brands/Brands";
import SearchInput from "../componentss/search/SearchInput";
import { useNavigate } from "react-router-dom";

const LazyCategories = lazy(() =>
  import("../componentss/categories/SecondLevelCategories")
);
const LazyFeaturedProducts = lazy(() =>
  import("../componentss/featured-products/FeaturedProducts")
);
const LazyLatestProducts = lazy(() =>
  import("../componentss/latest-products/LatestProducts")
);

export default function Home() {
  const { data, isLoading, isError } = useFetchNoQueryProductsQuery();
  const queryParams = new URLSearchParams();
  const navigate = useNavigate();
  const setSearchParams = (params) => {
    const search = params.get("search");
    if (search) {
      queryParams.set("search", search);
      navigate(`/products?search=${search}`, { replace: false });
    } else {
      queryParams.delete("search");
    }
  };

  if (isLoading) {
    return <LoadingGrid />;
  }

  if (isError) {
    return <p>actual error data: {isError}</p>;
  }

  return (
    <div>
      <ImageBanner
        imageUrl='https://th.bing.com/th/id/OIG.sugoCJJICAquHL29rdd8?w=1024&h=1024&rs=1&pid=ImgDetMain'
        altText='Banner'
        linkUrl='/products'
        bannerText=''
      />

      <SearchInput setSearchParams={setSearchParams} />

      <Suspense fallback={<LoadingGrid />}>
        <LazyCategories />
        <LazyFeaturedProducts products={data?.products} />
        <LazyLatestProducts products={data?.products} />
        <Brands products={data?.products} />
      </Suspense>
    </div>
  );
}
