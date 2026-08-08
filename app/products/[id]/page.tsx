import ProductDetail from "../../../components/products/ProductDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProductDetail id={id} />;
}