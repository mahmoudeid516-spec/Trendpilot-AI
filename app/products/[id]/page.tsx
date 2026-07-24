import { getProduct } from "../../../services/product";
import { getRelatedProducts } from "../../../services/relatedProducts";
import AIMarketing from "../../../components/products/AIMarketing";
import ProductHero from "../../../components/products/ProductHero";
import TrendChart from "../../../components/products/TrendChart";
import SupplierCard from "../../../components/products/SupplierCard";
import AIReport from "../../../components/products/AIReport";
import RelatedProducts from "../../../components/products/RelatedProducts";
import AIDecision from "../../../components/products/AIDecision";
import MarketMetrics from "../../../components/products/MarketMetrics";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(Number(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-4xl font-bold">
          Product Not Found
        </h1>
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id
  );

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">

  <ProductHero product={product} />

  <AIDecision product={product} />

  <TrendChart />

  <MarketMetrics product={product} />

  <SupplierCard product={product} />

  <AIReport product={product} />

  <RelatedProducts products={relatedProducts} />

  <AIMarketing product={product} />

</div>
  );
}