import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ChevronDown, ChevronUp, TrendingUp, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const recommendations = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp",
    consensus: "Strong Buy",
    price: "$875.30",
    change: "+3.2%",
    why: "AI chip demand continues to surge with new data center contracts. Analysts expect 40% revenue growth next quarter driven by enterprise AI adoption."
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    consensus: "Strong Buy",
    price: "$420.15",
    change: "+1.8%",
    why: "Azure cloud revenue up 29% year-over-year. Copilot AI integration is driving new enterprise subscriptions at record pace."
  },
  {
    ticker: "LLY",
    name: "Eli Lilly",
    consensus: "Buy",
    price: "$782.60",
    change: "+2.5%",
    why: "Weight-loss drug Mounjaro sales exceeded expectations by 15%. FDA fast-track approval for new Alzheimer's treatment adds upside."
  },
  {
    ticker: "COST",
    name: "Costco",
    consensus: "Buy",
    price: "$912.40",
    change: "+0.9%",
    why: "Membership renewals hit 93% rate, highest in company history. E-commerce growth of 18% shows strong digital transition."
  },
  {
    ticker: "V",
    name: "Visa Inc",
    consensus: "Strong Buy",
    price: "$298.70",
    change: "+1.4%",
    why: "Cross-border transaction volume up 25% as travel recovers. New fintech partnerships position Visa for digital payments growth."
  },
];

const consensusColors = {
  "Strong Buy": "bg-primary/20 text-primary border-primary/30",
  "Buy": "bg-chart-4/20 text-chart-4 border-chart-4/30",
};

export default function TopFiveCard() {
  const [expandedIdx, setExpandedIdx] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
          <Flame className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Top 5 Daily Picks</h3>
          <p className="text-xs text-muted-foreground">Analyst recommendations</p>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {recommendations.map((stock, idx) => (
          <div key={stock.ticker}>
            <button
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
            >
              {/* Rank */}
              <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-muted-foreground">{idx + 1}</span>
              </div>

              {/* Stock Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{stock.ticker}</span>
                  <span className="text-xs text-muted-foreground truncate">{stock.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${consensusColors[stock.consensus]}`}>
                    <Star className="w-2.5 h-2.5 mr-0.5" />
                    {stock.consensus}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-foreground">{stock.price}</p>
                <p className="text-xs font-medium text-primary">{stock.change}</p>
              </div>

              {/* Expand */}
              <div className="flex-shrink-0">
                {expandedIdx === idx ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Why Section */}
            <AnimatePresence>
              {expandedIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pl-16">
                    <div className="bg-muted/60 rounded-xl p-4 border border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary">Why this pick?</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {stock.why}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
