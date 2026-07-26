import type { Product } from "../../types/Product";
import AIReportExperience from "../reports/AIReportExperience";

type Props = {
  product: Product;
};

export default function AIReport({ product }: Props) {
  return (
    <AIReportExperience product={product} />
  );
}