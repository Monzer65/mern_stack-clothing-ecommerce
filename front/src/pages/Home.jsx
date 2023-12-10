// import { Link } from "react-router-dom";
// import Header from "../componentss/header/Header";

import ImageBanner from "../componentss/banner/Banner";
import LatestProducts from "../componentss/latest-products/LatestProducts";

export default function Home() {
  return (
    <div>
      {/* <Header /> */}
      <ImageBanner
        imageUrl='https://www.bing.com/rp/fY0wJ-QaIKghQ87Qs9ufsshTAws.png'
        altText='Banner'
        linkUrl='/products'
        bannerText='Shop Now'
      />

      <LatestProducts />
    </div>
  );
}
