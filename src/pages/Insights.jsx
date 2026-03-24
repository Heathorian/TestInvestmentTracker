import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const SECTOR_COLORS = [
  "hsl(93, 41%, 50%)",
  "hsl(43, 74%, 66%)",
  "hsl(173, 58%, 39%)",
  "hsl(197, 37%, 44%)",
  "hsl(27, 87%, 67%)",
  "hsl(12, 76%, 61%)",
  "hsl(280, 65%, 60%)",
  "hsl(340, 75%, 55%)",
  "hsl(160, 60%, 45%)",
];

export default function Insights() {
  const { data: stocks = [] } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => base44.entities.Stock.list(),
  });

  // Sector breakdown
  const sectorData = stocks.reduce((acc, s) => {
    const sector = s.sector || "Other";
    const value = s.current_price * s.shares;
    const existing = acc.find(x => x.name === sector);
    if (existing) existing.value += value;
    else acc.push({ name: sector, value });
    return acc;
  }, []);

  // Top gainers & losers
  const withProfit = stocks.map(s => ({
    ...s,
    profitPct: ((s.current_price - s.buy_price) / s.buy_price * 100),
    profit: (s.current_price - s.buy_price) * s.shares,
  }));
  const topGainers = [...withProfit].sort((a, b) => b.profitPct - a.profitPct).slice(0, 3);
  const topLosers = [...withProfit].sort((a, b) => a.profitPct - b.profitPct).slice(0, 3).filter(s => s.profitPct < 0);

  const totalValue = stocks.reduce((sum, s) => sum + s.current_price * s.shares, 0);

  if (stocks.length === 0) {
    return (
      <div className="p-4 lg:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight mb-2">Insights</h1>
        <p className="text-sm text-muted-foreground">Add stocks to your portfolio to see insights here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Understand your portfolio better</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Sector Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Sector Breakdown</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sectorData.map((_, i) => (
                    <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl">
                          <p className="text-xs text-muted-foreground">{payload[0].name}</p>
                          <p className="text-sm font-bold text-foreground">
                            ${payload[0].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(payload[0].value / totalValue * 100).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {sectorData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                <span className="text-xs text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gainers & Losers */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Top Gainers</h3>
            </div>
            <div className="space-y-3">
              {topGainers.map(s => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-[10px] font-bold text-foreground">{s.ticker?.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.ticker}</p>
                      <p className="text-xs text-muted-foreground">{s.name}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">+{s.profitPct.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {topLosers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-destructive/15 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Top Losers</h3>
              </div>
              <div className="space-y-3">
                {topLosers.map(s => (
                  <div key={s.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-[10px] font-bold text-foreground">{s.ticker?.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{s.ticker}</p>
                        <p className="text-xs text-muted-foreground">{s.name}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-destructive">{s.profitPct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Risk Alert */}
          {sectorData.some(s => s.value / totalValue > 0.5) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-chart-4/5 rounded-2xl border border-chart-4/20 p-5"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-chart-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Concentration Alert</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Over 50% of your portfolio is in one sector. Consider diversifying to reduce risk.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
