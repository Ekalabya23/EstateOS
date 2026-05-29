interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  available: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  sold: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  rented: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'under-review': { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['under-review'];
  const label = status.replace('-', ' ');

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize leading-tight ${config.bg} ${config.text}`}>
      <span className={`w-1 h-1 rounded-full ${config.dot}`} />
      {label}
    </span>
  );
}
