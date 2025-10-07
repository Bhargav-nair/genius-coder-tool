import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code2, Sparkles, ChevronDown } from "lucide-react";

export const Hero = () => {
  const scrollToIDE = () => {
    document.getElementById("ide-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-glow animate-glow pointer-events-none" />
      
      <div className="container relative z-10 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Icon badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 glass-panel rounded-full"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-accent bg-clip-text text-transparent"
          >
            Intelligent Code Review
            <br />
            in Real-Time
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Experience AI-powered code analysis that helps you write better, cleaner, and more maintainable code. Get instant suggestions, quality metrics, and educational insights as you type.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Button
              size="lg"
              onClick={scrollToIDE}
              className="group bg-gradient-accent hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              <Code2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Try Code Review Now
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ChevronDown className="w-6 h-6 text-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
