type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function ReportErrorCard({ title, message, actionLabel, onAction }: Props) {
  return (
    <div className="rounded-[28px] border border-rose-500/25 bg-[linear-gradient(135deg,rgba(48,14,28,0.96),rgba(20,14,38,0.96))] p-6 text-rose-50 shadow-[0_30px_80px_-40px_rgba(244,63,94,0.65)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200/80">Report Error</p>
      <h3 className="mt-3 text-2xl font-black text-white">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-rose-100/80">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-500/20"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}