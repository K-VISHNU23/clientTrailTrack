// Lightweight custom SVG charts — no external chart library needed.

export function LineChart({
  data,
  series,
  height = 200,
}: {
  data: { day: string }[];
  series: { key: string; label: string; color: string }[];
  height?: number;
}) {
  const width = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = data.flatMap((d) => series.map((s) => (d as Record<string, number | string>)[s.key] as number));
  const maxVal = Math.max(...allValues) * 1.2;
  const xStep = chartW / (data.length - 1);

  const points = series.map((s) =>
    data.map((d, i) => ({
      x: padding.left + i * xStep,
      y: padding.top + chartH - ((d as Record<string, number | string>)[s.key] as number) / maxVal * chartH,
    }))
  );

  const pathD = points.map((pts) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      {/* Y-axis grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line
            x1={padding.left}
            y1={padding.top + chartH * t}
            x2={width - padding.right}
            y2={padding.top + chartH * t}
            stroke="#f1f5f9"
            strokeWidth={1}
          />
          <text x={padding.left - 8} y={padding.top + chartH * (1 - t) + 4} textAnchor="end" className="fill-slate-400 text-[10px]">
            {Math.round(maxVal * (1 - t))}
          </text>
        </g>
      ))}
      {/* X-axis labels */}
      {data.map((d, i) => (
        <text key={i} x={padding.left + i * xStep} y={height - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">
          {d.day}
        </text>
      ))}
      {/* Lines + areas */}
      {series.map((s, si) => (
        <g key={s.key}>
          <path d={pathD[si]} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {points[si].map((p, pi) => (
            <circle key={pi} cx={p.x} cy={p.y} r={3} fill="white" stroke={s.color} strokeWidth={2} />
          ))}
        </g>
      ))}
      {/* Legend */}
      <g transform={`translate(${padding.left}, 0)`}>
        {series.map((s, i) => (
          <g key={s.key} transform={`translate(${i * 90}, 0)`}>
            <rect width={10} height={10} rx={2} fill={s.color} />
            <text x={14} y={9} className="fill-slate-600 text-[10px] font-medium">{s.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function BarChart({
  data,
  series,
  height = 200,
}: {
  data: { day: string }[];
  series: { key: string; label: string; color: string }[];
  height?: number;
}) {
  const width = 600;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const allValues = data.flatMap((d) => series.map((s) => (d as Record<string, number | string>)[s.key] as number));
  const maxVal = Math.max(...allValues) * 1.2;
  const groupW = chartW / data.length;
  const barW = (groupW * 0.7) / series.length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={padding.left} y1={padding.top + chartH * t} x2={width - padding.right} y2={padding.top + chartH * t} stroke="#f1f5f9" strokeWidth={1} />
          <text x={padding.left - 8} y={padding.top + chartH * (1 - t) + 4} textAnchor="end" className="fill-slate-400 text-[10px]">
            {Math.round(maxVal * (1 - t))}
          </text>
        </g>
      ))}
      {data.map((d, i) => (
        <g key={i}>
          {series.map((s, si) => {
            const val = (d as Record<string, number | string>)[s.key] as number;
            const barH = (val / maxVal) * chartH;
            return (
              <rect
                key={s.key}
                x={padding.left + i * groupW + groupW * 0.15 + si * barW}
                y={padding.top + chartH - barH}
                width={barW - 2}
                height={barH}
                rx={2}
                fill={s.color}
              />
            );
          })}
          <text x={padding.left + i * groupW + groupW / 2} y={height - 8} textAnchor="middle" className="fill-slate-500 text-[10px]">
            {d.day}
          </text>
        </g>
      ))}
      <g transform={`translate(${padding.left}, 0)`}>
        {series.map((s, i) => (
          <g key={s.key} transform={`translate(${i * 90}, 0)`}>
            <rect width={10} height={10} rx={2} fill={s.color} />
            <text x={14} y={9} className="fill-slate-600 text-[10px] font-medium">{s.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function DonutChart({
  data,
  size = 180,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.62;
  const center = size / 2;
  let cumulativeAngle = -Math.PI / 2;

  const arcs = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const x3 = center + innerRadius * Math.cos(endAngle);
    const y3 = center + innerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(startAngle);
    const y4 = center + innerRadius * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z',
    ].join(' ');

    return { path, color: d.color, label: d.label, value: d.value };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((arc, i) => (
          <path key={i} d={arc.path} fill={arc.color} stroke="white" strokeWidth={2} className="transition-opacity hover:opacity-80" />
        ))}
        <text x={center} y={center - 5} textAnchor="middle" className="fill-navy-800 text-lg font-bold">
          {total}
        </text>
        <text x={center} y={center + 14} textAnchor="middle" className="fill-slate-400 text-[10px]">
          Total
        </text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-slate-600">{d.label}</span>
            <span className="text-sm font-semibold text-navy-700">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBarChart({
  data,
  height = 200,
}: {
  data: { condition: string; count: number }[];
  height?: number;
}) {
  const maxVal = Math.max(...data.map((d) => d.count));
  const barHeight = 28;
  const gap = 10;
  const totalH = data.length * (barHeight + gap);

  return (
    <div className="w-full" style={{ height: Math.max(height, totalH) }}>
      {data.map((d, i) => (
        <div key={d.condition} className="mb-2.5" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">{d.condition}</span>
            <span className="text-sm font-semibold text-navy-700">{d.count}</span>
          </div>
          <div className="h-7 w-full rounded-lg bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-navy-500 to-navy-600 transition-all duration-700 ease-out"
              style={{ width: `${(d.count / maxVal) * 100}%`, animationDelay: `${i * 100}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FunnelChart({
  data,
}: {
  data: { stage: string; value: number; color: string }[];
}) {
  const maxVal = data[0]?.value || 1;
  return (
    <div className="space-y-1">
      {data.map((d, i) => {
        const widthPct = (d.value / maxVal) * 100;
        const conversionRate = i > 0 ? ((d.value / data[i - 1].value) * 100).toFixed(0) : '100';
        return (
          <div key={d.stage} className="flex items-center gap-3">
            <div className="w-28 text-sm text-slate-600 text-right shrink-0">{d.stage}</div>
            <div className="flex-1 relative">
              <div
                className="h-10 rounded-lg flex items-center px-3 transition-all duration-500"
                style={{ width: `${widthPct}%`, backgroundColor: d.color }}
              >
                <span className="text-white text-sm font-semibold">{d.value}</span>
              </div>
            </div>
            <div className="w-12 text-xs text-slate-400 shrink-0">{conversionRate}%</div>
          </div>
        );
      })}
    </div>
  );
}
