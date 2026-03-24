import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Trophy, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import LessonCard from "../components/academy/LessonCard";
import { toast } from "sonner";

const LESSONS = [
  {
    id: "first-share",
    title: "Your First Share",
    description: "Learn what stocks are and how buying a share makes you a part-owner of a company.",
    duration: "5 min",
    difficulty: "Beginner",
  },
  {
    id: "understanding-prices",
    title: "Understanding Prices",
    description: "Why do stock prices go up and down? A simple explanation of supply and demand in markets.",
    duration: "7 min",
    difficulty: "Beginner",
  },
  {
    id: "understanding-dividends",
    title: "Understanding Dividends",
    description: "Companies can pay you just for holding their stock. Learn how dividends work and why they matter.",
    duration: "6 min",
    difficulty: "Beginner",
  },
  {
    id: "building-portfolio",
    title: "Building a Portfolio",
    description: "Don't put all your eggs in one basket. Learn the basics of diversification and risk management.",
    duration: "8 min",
    difficulty: "Intermediate",
  },
  {
    id: "reading-charts",
    title: "Reading Stock Charts",
    description: "Charts tell a story. Learn how to read basic price charts and spot simple trends.",
    duration: "10 min",
    difficulty: "Intermediate",
  },
  {
    id: "market-orders",
    title: "Market vs Limit Orders",
    description: "Understand the difference between buying at market price and setting your own price limit.",
    duration: "6 min",
    difficulty: "Intermediate",
  },
  {
    id: "etfs-explained",
    title: "ETFs Explained",
    description: "Want to invest in hundreds of companies at once? ETFs let you do exactly that.",
    duration: "7 min",
    difficulty: "Beginner",
  },
  {
    id: "risk-reward",
    title: "Risk & Reward",
    description: "Higher potential returns come with higher risk. Learn how to find your comfort zone.",
    duration: "9 min",
    difficulty: "Advanced",
  },
];

export default function Academy() {
  const queryClient = useQueryClient();

  const { data: progress = [] } = useQuery({
    queryKey: ["lessonProgress"],
    queryFn: () => base44.entities.LessonProgress.list(),
  });

  const completeMutation = useMutation({
    mutationFn: (lessonId) => base44.entities.LessonProgress.create({ lesson_id: lessonId, completed: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessonProgress"] });
      toast.success("Lesson completed! 🎉");
    },
  });

  const completedIds = new Set(progress.filter(p => p.completed).map(p => p.lesson_id));
  const completedCount = completedIds.size;
  const progressPct = Math.round((completedCount / LESSONS.length) * 100);

  const handleStart = (lesson) => {
    completeMutation.mutate(lesson.id);
  };

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Academy</h1>
        <p className="text-sm text-muted-foreground mt-1">Learn investing from zero — one lesson at a time</p>
      </div>

      {/* Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground">Your Progress</h3>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {LESSONS.length} lessons completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{progressPct}%</p>
          </div>
        </div>
        <Progress value={progressPct} className="h-2.5 bg-muted [&>[role=progressbar]]:bg-primary" />

        {/* XP Badge */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Target className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary">{completedCount * 50} XP</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {completedCount < 3 ? "Beginner" : completedCount < 6 ? "Intermediate" : "Advanced"} Investor
          </span>
        </div>
      </motion.div>

      {/* Lessons */}
      <div className="space-y-3">
        {LESSONS.map((lesson, idx) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            index={idx}
            isCompleted={completedIds.has(lesson.id)}
            isLocked={false}
            onStart={handleStart}
          />
        ))}
      </div>
    </div>
  );
}
