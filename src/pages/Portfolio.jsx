import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import StockForm from "../components/portfolio/StockForm";
import StockRow from "../components/portfolio/StockRow";

export default function Portfolio() {
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: stocks = [], isLoading } = useQuery({
    queryKey: ["stocks"],
    queryFn: () => base44.entities.Stock.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Stock.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Stock.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      setEditingStock(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Stock.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stocks"] }),
  });

  const handleSubmit = (data) => {
    if (editingStock) {
      updateMutation.mutate({ id: editingStock.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  const handleDelete = (stock) => {
    deleteMutation.mutate(stock.id);
  };

  const filtered = stocks.filter(s =>
    s.ticker?.toLowerCase().includes(search.toLowerCase()) ||
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = stocks.reduce((sum, s) => sum + (s.current_price * s.shares), 0);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stocks.length} stocks · ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} total
          </p>
        </div>
        <Button
          onClick={() => { setEditingStock(null); setShowForm(true); }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <StockForm
              stock={editingStock}
              onSubmit={handleSubmit}
              onCancel={() => { setShowForm(false); setEditingStock(null); }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search stocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground"
        />
      </div>

      {/* Stock List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground text-sm">
              {stocks.length === 0 ? "No stocks yet. Click \"Add Stock\" to get started!" : "No stocks match your search."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((stock) => (
              <StockRow
                key={stock.id}
                stock={stock}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
