import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const mockData = [
  { date: "Mon", value: 24500 },
  { date: "Tue", value: 25200 },
  { date: "Wed", value: 24800 },
  { date: "Thu", value: 26100 },
  { date: "Fri", value: 25700 },
  { date: "Sat", value: 26400 },
  { date: "Sun", value: 27150 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-bold text-foreground">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function PortfolioChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-2xl p-6 border border-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Portfolio Performance</h3>
          <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
        </div>
        <div className="flex gap-1">
          {["1W", "1M", "3M", "1Y"].map((period, i) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="chartGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(93, 41%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(93, 41%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(30, 3%, 55%)", fontSize: 11 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(93, 41%, 50%)"
              strokeWidth={2.5}
              fill="url(#chartGreen)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
