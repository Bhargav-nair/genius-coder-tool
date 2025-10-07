import { useState } from "react";
import { Hero } from "@/components/Hero";
import { FeatureCards } from "@/components/FeatureCards";
import { CodeEditor } from "@/components/CodeEditor";
import { AnalysisPanel } from "@/components/AnalysisPanel";

const Index = () => {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeatureCards />
      
      {/* IDE Section */}
      <section id="ide-section" className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Try It Yourself
            </h2>
            <p className="text-muted-foreground text-lg">
              Write or paste your code and get instant AI-powered feedback
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,400px] gap-6 h-[600px]">
            <div className="editor-panel rounded-xl overflow-hidden">
              <CodeEditor onAnalysisComplete={setAnalysis} />
            </div>
            <div className="editor-panel rounded-xl overflow-hidden">
              <AnalysisPanel analysis={analysis} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
