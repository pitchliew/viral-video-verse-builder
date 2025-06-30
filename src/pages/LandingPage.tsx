import React from "react";
import { useNavigate } from "react-router-dom";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle, CyberCardDescription } from "@/components/ui/cyber-card";
import { CyberBadge } from "@/components/ui/cyber-badge";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Play, 
  Users, 
  BarChart3,
  Rocket,
  Brain,
  Video,
  Star,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Script Generation",
      description: "Transform viral templates into custom scripts tailored to your brand using advanced AI"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Viral Hook Analysis",
      description: "Decode what makes content go viral with our proprietary hook analysis system"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Prediction",
      description: "Get viral scores and performance predictions before you create content"
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Template Library",
      description: "Access thousands of proven viral video templates across all industries"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Brand Customization",
      description: "Automatically adapt viral formulas to match your unique brand voice"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Content Calendar",
      description: "Plan and schedule your viral content strategy with our smart calendar"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "Increased my average views by 400% using Viralhooks templates. The AI suggestions are incredible!",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      content: "Our brand's social engagement skyrocketed. This tool is a game-changer for viral marketing.",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Influencer",
      content: "Finally, a tool that actually understands what makes content go viral. My follower growth is insane!",
      avatar: "ET"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-bg-primary via-cyber-bg-secondary to-cyber-bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent-pink/10 to-cyber-accent-blue/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <CyberBadge variant="secondary" glow className="mb-6">
              🚀 AI-Powered Viral Engine
            </CyberBadge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-cyber-accent-pink via-cyber-accent-purple to-cyber-accent-blue bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-cyber-text-primary">
                Viral Video Script Engine
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-cyber-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform any viral video into a custom script for your brand. 
              Decode viral formulas, generate scripts, and create content that actually goes viral.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <CyberButton 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="group"
              >
                Start Creating
                <Rocket className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </CyberButton>
              
              <CyberButton 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/library")}
                className="group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Explore Templates
              </CyberButton>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-cyber-accent-pink mb-2">10,000+</div>
                <div className="text-cyber-text-secondary">Viral Templates</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-cyber-accent-blue mb-2">95%</div>
                <div className="text-cyber-text-secondary">Success Rate</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-cyber-accent-green mb-2">50M+</div>
                <div className="text-cyber-text-secondary">Views Generated</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cyber-text-primary mb-6">
              Everything You Need to Go
              <span className="text-cyber-accent-pink"> Viral</span>
            </h2>
            <p className="text-xl text-cyber-text-secondary max-w-3xl mx-auto">
              Our AI analyzes millions of viral videos to give you the exact formulas that work
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard glow className="h-full p-6 group hover:scale-105 transition-transform duration-300">
                  <div className="text-cyber-accent-pink mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-cyber-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-cyber-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-r from-cyber-bg-secondary/50 to-cyber-bg-tertiary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-cyber-text-primary mb-6">
              Creators Love
              <span className="text-cyber-accent-blue"> Viralhooks</span>
            </h2>
            <p className="text-xl text-cyber-text-secondary">
              Join thousands of creators who've transformed their content strategy
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <CyberCard variant="secondary" className="p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-accent-pink to-cyber-accent-purple flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-cyber-text-primary">{testimonial.name}</div>
                      <div className="text-sm text-cyber-text-secondary">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-cyber-text-secondary italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-cyber-accent-green fill-current" />
                    ))}
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent-pink/10 to-cyber-accent-blue/10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-cyber-text-primary mb-8">
              Ready to Go
              <span className="text-cyber-accent-pink"> Viral?</span>
            </h2>
            <p className="text-xl text-cyber-text-secondary mb-12 max-w-2xl mx-auto">
              Join the AI revolution in content creation. Start generating viral scripts in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <CyberButton 
                size="lg" 
                onClick={() => navigate("/auth")}
                glow
                className="group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </CyberButton>
              
              <CyberButton 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/library")}
              >
                View Demo
              </CyberButton>
            </div>
            
            <p className="text-sm text-cyber-text-muted mt-8">
              No credit card required • 7-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;