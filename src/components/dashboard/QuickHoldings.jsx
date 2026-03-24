import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function QuickHoldings({ stocks }) {
  if (!stocks?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl p-6 border border-border"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Your Holdings</h3>
        <p className="text-sm text-muted-foreground">No stocks yet. Add some in your Portfolio!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Your Holdings</h3>
      </div>
      <div className="divide-y divide-border">
        {stocks.slice(0, 5).map((stock) => {
          const profit = (stock.current_price - stock.buy_price) * stock.shares;
          const profitPct = ((stock.current_price - stock.buy_price) / stock.buy_price * 100);
          const isPositive = profit >= 0;

          return (
            <div key={stock.id} className="px-5 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-foreground">{stock.ticker?.slice(0, 2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{stock.ticker}</p>
                <p className="text-xs text-muted-foreground truncate">{stock.shares} shares</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  ${(stock.current_price * stock.shares).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <div className={`flex items-center gap-0.5 justify-end text-xs font-medium ${
                  isPositive ? "text-primary" : "text-destructive"
                }`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {isPositive ? "+" : ""}{profitPct.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
