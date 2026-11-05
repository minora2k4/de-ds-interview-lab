import { useState, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'

const AXIS_TICK = { fill: 'var(--chart-axis)', fontSize: 12 }
const SERIES_COLOR = 'var(--chart-1)'

/** Vạch chia tròn số cho hai thang đang dùng. */
function roundTicks(max: number): number[] {
  const step = max === 10 ? 2 : 25
  return Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step)
}

interface TooltipPayload {
  value: number
  payload: { label: string; detail?: string }
}

function ChartTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean
  payload?: TooltipPayload[]
  unit: string
}) {
  const item = payload?.[0]
  if (!active || !item) return null
  return (
    <div className="rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-sm">
      <p className="font-medium">{item.payload.label}</p>
      <p className="tabular-nums">
        {item.value}
        {unit}
      </p>
      {item.payload.detail && <p className="text-muted-foreground">{item.payload.detail}</p>}
    </div>
  )
}

export interface ChartPoint {
  label: string
  value: number
  detail?: string
}

/** Khung biểu đồ, có bảng dữ liệu đi kèm cho người không đọc được biểu đồ. */
export function ChartCard({
  title,
  description,
  points,
  unit,
  children,
}: {
  title: string
  description?: string
  points: ChartPoint[]
  unit: string
  children: ReactNode
}) {
  const [showTable, setShowTable] = useState(false)
  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-medium">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0"
          aria-expanded={showTable}
          onClick={() => setShowTable((value) => !value)}
        >
          {showTable ? 'Xem biểu đồ' : 'Xem bảng'}
        </Button>
      </div>
      {showTable ? (
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-sm">
            <tbody>
              {points.map((point, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <th scope="row" className="py-1.5 pr-3 text-left font-normal">
                    {point.label}
                    {point.detail && (
                      <span className="block text-xs text-muted-foreground">{point.detail}</span>
                    )}
                  </th>
                  <td className="py-1.5 text-right font-medium tabular-nums">
                    {point.value}
                    {unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </section>
  )
}

/** Biểu đồ đường cho một chuỗi theo thời gian, ghi giá trị ở điểm cuối. */
export function TrendChart({
  points,
  unit,
  domainMax,
}: {
  points: ChartPoint[]
  unit: string
  domainMax: number
}) {
  const lastIndex = points.length - 1
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 12, right: 28, bottom: 0, left: -18 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: 'var(--chart-grid)' }}
            minTickGap={24}
          />
          <YAxis
            domain={[0, domainMax]}
            ticks={roundTicks(domainMax)}
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: 'var(--chart-axis)', strokeWidth: 1 }}
            content={<ChartTooltip unit={unit} />}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={SERIES_COLOR}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            isAnimationActive={false}
            dot={(props: { cx?: number; cy?: number; index?: number; value?: number }) => {
              const isLast = props.index === lastIndex
              return (
                <g key={props.index}>
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={isLast ? 4 : 2}
                    fill={SERIES_COLOR}
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                  {isLast && (
                    <text
                      x={props.cx}
                      y={(props.cy ?? 0) - 10}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={600}
                      fill="var(--foreground)"
                    >
                      {props.value}
                      {unit}
                    </text>
                  )}
                </g>
              )
            }}
            activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2, fill: SERIES_COLOR }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Thanh ngang một chuỗi, giá trị ở đầu thanh. */
export function HorizontalBars({
  points,
  unit,
  domainMax,
}: {
  points: ChartPoint[]
  unit: string
  domainMax: number
}) {
  const height = Math.max(120, points.length * 34 + 16)
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
          <XAxis type="number" domain={[0, domainMax]} hide />
          <YAxis
            type="category"
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={false}
            width={132}
            interval={0}
          />
          <Tooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltip unit={unit} />} />
          <Bar
            dataKey="value"
            fill={SERIES_COLOR}
            maxBarSize={20}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value) => `${value}${unit}`}
              fill="var(--foreground)"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Cột đứng cho dữ liệu theo khoảng thời gian liên tiếp. */
export function ActivityColumns({ points, unit }: { points: ChartPoint[]; unit: string }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 12, right: 4, bottom: 0, left: -18 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            tickLine={false}
            axisLine={{ stroke: 'var(--chart-grid)' }}
            minTickGap={16}
          />
          <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={48} />
          <Tooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltip unit={unit} />} />
          <Bar
            dataKey="value"
            fill={SERIES_COLOR}
            maxBarSize={24}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
