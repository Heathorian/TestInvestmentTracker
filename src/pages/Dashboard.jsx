import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { DollarSign, TrendingUp, BarChart3, Layers } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import PortfolioChart from "../components/dashboard/PortfolioChart";
import TopFiveCard from "../components/dashboard/TopFiveCard";
import QuickHoldings from "../components/dashboard/QuickHoldings";

export default function Dashboard() {
  const { data: stocks = [] } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => base44.entities.Stock.list(),
  });

  const totalValue = stocks.reduce((sum, s) => sum + (s.current_price * s.shares), 0);
  const totalCost = stocks.reduce((sum, s) => sum + (s.buy_price * s.shares), 0);
  const totalProfit = totalValue - totalCost;
  const profitPct = totalCost > 0 ? (totalProfit / totalCost * 100) : 0;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Your portfolio at a glance</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          title="Portfolio Value"
          value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Profit"
          value={`${totalProfit >= 0 ? '+' : ''}$${Math.abs(totalProfit).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change={profitPct.toFixed(1)}
          positive={totalProfit >= 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Stocks Held"
          value={stocks.length}
          icon={BarChart3}
        />
        <StatCard
          title="Sectors"
          value={new Set(stocks.map(s => s.sector).filter(Boolean)).size}
          icon={Layers}
        />
      </div>

      {/* Chart + Top 5 */}
      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        <div className="lg:col-span-3 space-y-4 lg:space-y-6">
          <PortfolioChart />
          <QuickHoldings stocks={stocks} />
        </div>
        <div className="lg:col-span-2">
          <TopFiveCard />
        </div>
      </div>
    </div>
  );
}
