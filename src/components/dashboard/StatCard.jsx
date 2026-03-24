import { motion } from "framer-motion";

export default function StatCard({ title, value, change, icon: Icon, positive }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-5 border border-border hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-2">
          <div className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
            positive ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"
          }`}>
            {positive ? "+" : ""}{change}%
          </div>
          <span className="text-xs text-muted-foreground">today</span>
        </div>
      )}
    </motion.div>
  );
}
