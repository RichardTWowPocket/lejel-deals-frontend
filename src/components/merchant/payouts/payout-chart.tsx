'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { DailyTrend, PayoutPeriod } from '@/types/payout'
import { formatCurrency } from '@/utils/format'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface PayoutChartProps {
  dailyTrends: DailyTrend[]
  period: PayoutPeriod
  onPeriodChange: (period: PayoutPeriod) => void
  className?: string
}

export function PayoutChart({
  dailyTrends,
  period,
  onPeriodChange,
  className,
}: PayoutChartProps) {
  // Format data for chart
  const chartData = dailyTrends.map((trend) => ({
    date: format(new Date(trend.date), 'MMM dd'),
    revenue: trend.revenue,
    orders: trend.orders,
    averageOrderValue: trend.averageOrderValue,
  }))

  const handleExport = () => {
    // Create CSV content
    const headers = ['Date', 'Revenue', 'Orders', 'Average Order Value']
    const rows = dailyTrends.map((trend) => [
      format(new Date(trend.date), 'yyyy-MM-dd'),
      trend.revenue.toString(),
      trend.orders.toString(),
      trend.averageOrderValue.toString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `payout_chart_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Revenue Trends</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value) => onPeriodChange(value as PayoutPeriod)}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`
                  }
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}K`
                  }
                  return value.toString()
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'revenue' || name === 'averageOrderValue') {
                    return [formatCurrency(value), name === 'revenue' ? 'Revenue' : 'Avg Order Value']
                  }
                  return [value, 'Orders']
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Orders"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            No data available for the selected period
          </div>
        )}
      </CardContent>
    </Card>
  )
}



