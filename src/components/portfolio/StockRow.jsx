import { ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StockRow({ stock, onEdit, onDelete }) {
  const totalValue = stock.current_price * stock.shares;
  const profit = (stock.current_price - stock.buy_price) * stock.shares;
  const profitPct = ((stock.current_price - stock.buy_price) / stock.buy_price * 100);
  const isPositive = profit >= 0;

  return (
    <div className="px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group">
      {/* Ticker Badge */}
      <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-foreground">{stock.ticker?.slice(0, 3)}</span>
      </div>

      {/* Stock Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">{stock.ticker}</span>
          {stock.sector && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
              {stock.sector}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
      </div>

      {/* Shares */}
      <div className="hidden sm:block text-right">
        <p className="text-xs text-muted-foreground">Shares</p>
        <p className="text-sm font-semibold text-foreground">{stock.shares}</p>
      </div>

      {/* Buy Price */}
      <div className="hidden md:block text-right">
        <p className="text-xs text-muted-foreground">Buy Price</p>
        <p className="text-sm font-semibold text-foreground">${stock.buy_price?.toFixed(2)}</p>
      </div>

      {/* Current Price */}
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Current</p>
        <p className="text-sm font-semibold text-foreground">${stock.current_price?.toFixed(2)}</p>
      </div>

      {/* Profit */}
      <div className="text-right min-w-[80px]">
        <p className="text-xs text-muted-foreground">Profit</p>
        <div className={`flex items-center gap-0.5 justify-end text-sm font-bold ${
          isPositive ? "text-primary" : "text-destructive"
        }`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {isPositive ? "+" : ""}${Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onEdit(stock)}>
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => onDelete(stock)}>
          <Trash2 className="w-3.5 h-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
