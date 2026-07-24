"use client";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function SectionHeader({
  title,
  description,
  action,
}: Props) {
  return (
    <div className="mb-6 flex items-start justify-between gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}