export default function StatCounter({
  value,
  suffix = "",
  label,
  onDark = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div>
      <div className={"font-display font-extrabold text-4xl lg:text-5xl tracking-tight" + (onDark ? " text-white" : "")}>
        {value.toLocaleString()}
        {suffix}
      </div>
      <div className={"text-xs lg:text-sm mt-1 uppercase tracking-wider font-bold" + (onDark ? " text-white/60" : " text-wgray")}>
        {label}
      </div>
    </div>
  );
}
