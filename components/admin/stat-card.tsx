import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  description?: string
  change?: string
  changeType?: "increase" | "decrease" | "neutral"
}

export function StatCard({ title, value, description, change, changeType }: StatCardProps) {
  const isPositive = changeType === "increase"
  const isNegative = changeType === "decrease"

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {change && (
          <div className="mt-2 flex items-center text-xs">
            <span className={`mr-1 ${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"}`}>
              {isPositive ? "↑" : isNegative ? "↓" : "→"}
            </span>
            <span className={`${isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"}`}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
