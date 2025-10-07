import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [language, setLanguage] = useState("javascript");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [decorations, setDecorations] = useState<any[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editorRef.current && monacoRef.current && currentAnalysis?.issues) {
      const newDecorations = currentAnalysis.issues.map((issue: any) => ({
        range: new monacoRef.current.Range(issue.line || 1, 1, issue.line || 1, 1),
        options: {
          isWholeLine: true,
          className: issue.type === "error" ? "error-line" : "warning-line",
          glyphMarginClassName: issue.type === "error" ? "error-glyph" : "warning-glyph",
          hoverMessage: { value: issue.description },
          glyphMarginHoverMessage: { value: issue.description }
        }
      }));
      const ids = editorRef.current.deltaDecorations(decorations, newDecorations);
      setDecorations(ids);
    }
  }, [currentAnalysis]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register inline completion provider
    monaco.languages.registerInlineCompletionsProvider(language, {
      provideInlineCompletions: async (model: any, position: any) => {
        if (!suggestion) return { items: [] };
        
        return {
          items: [
            {
              insertText: suggestion,
              range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
              )
            }
          ]
        };
      },
      freeInlineCompletions: () => {}
    });

    // Handle Tab key for accepting suggestions
    editor.addCommand(monaco.KeyCode.Tab, () => {
      if (suggestion) {
        const position = editor.getPosition();
        editor.executeEdits("", [
          {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text: suggestion
          }
        ]);
        setSuggestion("");
      }
    });
  };

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
        body: { code, language },
      });

      if (error) throw error;

      setCurrentAnalysis(data);
      onAnalysisComplete(data);
      
      // Set suggestion for inline completion
      if (data.suggestions?.[0]) {
        setSuggestion(data.suggestions[0]);
      }

      toast({
        title: "Analysis Complete",
        description: "Your code has been analyzed successfully. Press Tab to accept suggestions.",
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

  const handleFixCode = async () => {
    if (!currentAnalysis) {
      toast({
        title: "No Analysis",
        description: "Please analyze the code first",
        variant: "destructive",
      });
      return;
    }

    setIsFixing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-code", {
        body: { code, language, requestFix: true },
      });

      if (error) throw error;

      if (data.fixedCode) {
        setCode(data.fixedCode);
        toast({
          title: "Code Fixed",
          description: "Applied AI-suggested fixes to your code",
        });
      }
    } catch (error: any) {
      console.error("Fix error:", error);
      toast({
        title: "Fix Failed",
        description: error.message || "Failed to fix code",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 editor-panel border-b border-editor-border gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-editor-text">Code Editor</h3>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px] h-8 bg-editor-bg border-editor-border text-editor-text">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="bg-editor-panel border-editor-border">
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleFixCode}
            disabled={isFixing || !currentAnalysis}
            variant="outline"
            size="sm"
            className="border-editor-border text-editor-text hover:bg-editor-border/50"
          >
            {isFixing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Fix Code
              </>
            )}
          </Button>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            size="sm"
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
      </div>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorDidMount}
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
            glyphMargin: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            inlineSuggest: { enabled: true },
          }}
        />
      </div>
    </div>
  );
};
