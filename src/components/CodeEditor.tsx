import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CodeEditorProps {
  onAnalysisComplete: (analysis: any) => void;
}

const defaultCode = `function calculateSum(numbers) {
  let sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i];
  }
  return sum;
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log(result);`;

export const CodeEditor = ({ onAnalysisComplete }: CodeEditorProps) => {
  const [code, setCode] = useState(defaultCode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-code", {
        body: { code },
      });

      if (error) throw error;

      onAnalysisComplete(data);
      toast({
        title: "Analysis Complete",
        description: "Your code has been analyzed successfully",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze code",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 editor-panel border-b border-editor-border">
        <h3 className="text-sm font-medium text-editor-text">Code Editor</h3>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-gradient-accent hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Analyze Code
            </>
          )}
        </Button>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, Consolas, Monaco, monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};
