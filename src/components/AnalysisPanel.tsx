import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AnalysisPanelProps {
  analysis: any | null;
}

export const AnalysisPanel = ({ analysis }: AnalysisPanelProps) => {
  if (!analysis) {
    return (
      <div className="h-full flex items-center justify-center editor-panel">
        <div className="text-center text-muted-foreground p-8">
          <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Click "Analyze Code" to see AI-powered insights</p>
        </div>
      </div>
    );
  }

  const qualityScore = analysis.code_quality || 0;
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="analysis"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="h-full flex flex-col editor-panel"
      >
        {/* Header */}
        <div className="p-4 border-b border-editor-border">
          <h3 className="text-sm font-medium text-editor-text mb-3">Code Analysis</h3>
          
          {/* Quality Score */}
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-bold ${getScoreColor(qualityScore)}`}>
                  {qualityScore}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Code Quality Score</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Issues */}
            {analysis.issues && analysis.issues.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-editor-text mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  Issues Found ({analysis.issues.length})
                </h4>
                <div className="space-y-3">
                  {analysis.issues.map((issue: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-panel rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <Badge variant={issue.type === "error" ? "destructive" : "secondary"} className="mt-0.5">
                          {issue.type}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{issue.description}</p>
                          {issue.line && (
                            <p className="text-xs text-muted-foreground mt-1">Line {issue.line}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-editor-text mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Suggestions ({analysis.suggestions.length})
                </h4>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (analysis.issues?.length || 0) * 0.1 + index * 0.1 }}
                      className="glass-panel rounded-lg p-3"
                    >
                      <p className="text-sm text-foreground">{suggestion.description || suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {analysis.explanation && (
              <div>
                <h4 className="text-sm font-semibold text-editor-text mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Educational Insights
                </h4>
                <div className="glass-panel rounded-lg p-4">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {analysis.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};
