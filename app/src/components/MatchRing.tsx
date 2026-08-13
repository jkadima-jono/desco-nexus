export default function MatchRing({
  score,
  size = 56,
  onDark = false,
}: {
  score: number;
  size?: number;
  onDark?: boolean;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#F2F3F3" strokeWidth="5"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#B8953D" strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={filled + " " + (c - filled)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={"font-display font-bold text-sm leading-none" + (onDark ? " text-white" : "")}>{score}</span>
      </div>
    </div>
  );
}
