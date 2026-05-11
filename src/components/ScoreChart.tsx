'use client'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface DataPoint {
  name: string
  score: number
}

interface Props {
  data: DataPoint[]
}

export default function ScoreChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#252535" />
        <PolarAngleAxis
          dataKey="name"
          tick={{ fill: '#7a7891', fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#c9a84c"
          fill="#c9a84c"
          fillOpacity={0.18}
          strokeWidth={1.5}
          dot={{ fill: '#c9a84c', r: 3 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#13131a',
            border: '1px solid #252535',
            borderRadius: '12px',
            color: '#e5e3f0',
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v}%`, 'Score QCM']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
