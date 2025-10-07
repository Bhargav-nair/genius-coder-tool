import { motion } from "framer-motion";
import { Zap, Target, BookOpen, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Suggestions",
    description: "Get instant AI-powered code suggestions as you type. Press Tab to accept improvements and fix issues on the fly.",
  },
  {
    icon: Target,
    title: "Multi-Language Support",
    description: "Works with JavaScript, TypeScript, Python, and more. Our AI understands the nuances of each language.",
  },
  {
    icon: BarChart3,
    title: "Code Quality Metrics",
    description: "Track readability, maintainability, and efficiency with a comprehensive 0-100 quality score.",
  },
  {
    icon: BookOpen,
    title: "Educational Insights",
    description: "Learn why issues exist and how to fix them with detailed explanations for every suggestion.",
  },
];

export const FeatureCards = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Write Better Code
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive code analysis and actionable insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="glass-panel rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
