import ReportDetailClient from "../../../../components/reports/ReportDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;
  const reportId = Number(id);

  return <ReportDetailClient reportId={reportId} />;
}