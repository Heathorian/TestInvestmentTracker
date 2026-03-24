import { motion } from "framer-motion";
import { CheckCircle2, Lock, PlayCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LessonCard({ lesson, index, isCompleted, isLocked, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-card rounded-2xl border transition-all duration-300 ${
        isCompleted
          ? "border-primary/30"
          : isLocked
            ? "border-border opacity-60"
            : "border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? "bg-primary/15"
              : isLocked
                ? "bg-muted"
                : "bg-muted"
          }`}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : isLocked ? (
              <Lock className="w-4 h-4 text-muted-foreground" />
            ) : (
              <PlayCircle className="w-5 h-5 text-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Lesson {index + 1}
              </span>
              {lesson.difficulty && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                  lesson.difficulty === "Beginner" ? "bg-primary/15 text-primary" :
                  lesson.difficulty === "Intermediate" ? "bg-chart-4/15 text-chart-4" :
                  "bg-destructive/15 text-destructive"
                }`}>
                  {lesson.difficulty}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-foreground mb-1">{lesson.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{lesson.description}</p>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {lesson.duration}
              </div>
              {!isLocked && !isCompleted && (
                <button
                  onClick={() => onStart(lesson)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Start Lesson →
                </button>
              )}
              {isCompleted && (
                <span className="text-xs font-semibold text-primary">Completed ✓</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isCompleted && (
        <div className="px-5 pb-4">
          <Progress value={100} className="h-1.5 bg-muted [&>[role=progressbar]]:bg-primary" />
        </div>
      )}
    </motion.div>
  );
}
