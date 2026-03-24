import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

const SECTORS = ["Technology", "Healthcare", "Finance", "Energy", "Consumer", "Industrial", "Real Estate", "Utilities", "Other"];

export default function StockForm({ stock, onSubmit, onCancel }) {
  const [form, setForm] = useState(stock || {
    ticker: "",
    name: "",
    shares: "",
    buy_price: "",
    current_price: "",
    sector: "Technology",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      shares: parseFloat(form.shares),
      buy_price: parseFloat(form.buy_price),
      current_price: parseFloat(form.current_price),
    });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">
          {stock ? "Edit Stock" : "Add New Stock"}
        </h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Ticker</Label>
            <Input
              placeholder="AAPL"
              value={form.ticker}
              onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Company Name</Label>
            <Input
              placeholder="Apple Inc"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-muted border-border text-foreground"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Shares</Label>
            <Input
              type="number"
              step="any"
              placeholder="10"
              value={form.shares}
              onChange={(e) => setForm({ ...form, shares: e.target.value })}
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Buy Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="150.00"
              value={form.buy_price}
              onChange={(e) => setForm({ ...form, buy_price: e.target.value })}
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Current Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="175.00"
              value={form.current_price}
              onChange={(e) => setForm({ ...form, current_price: e.target.value })}
              className="bg-muted border-border text-foreground"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Sector</Label>
          <Select value={form.sector} onValueChange={(val) => setForm({ ...form, sector: val })}>
            <SelectTrigger className="bg-muted border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SECTORS.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            {stock ? "Save Changes" : "Add Stock"}
          </Button>
        </div>
      </form>
    </div>
  );
}
