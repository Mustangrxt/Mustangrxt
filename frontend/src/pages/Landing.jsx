import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FlowerOfLife } from '../components/FlowerOfLife';
import { 
  Flame, 
  Brain, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  Crown,
  ArrowRight,
  Check
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const features = [
    {
      icon: Clock,
      title: "Transmutation Timer",
      description: "Track your journey with a real-time Hero Ring that evolves through the 12 Laws of the Universe.",
      color: "cyan"
    },
    {
      icon: Sparkles,
      title: "The Pathfinder Codex",
      description: "Unlock the 12 Laws of Transmutation with detailed biological and spiritual breakdowns.",
      color: "violet"
    },
    {
      icon: Brain,
      title: "Time Travel",
      description: "Forgot to start? Backdate your transmutation to the actual moment you began.",
      color: "orange"
    },
    {
      icon: MessageSquare,
      title: "The Granite Coach",
      description: "AI-powered guidance providing insights on both the Flesh and the Spirit of your journey.",
      color: "emerald"
    },
    {
      icon: Flame,
      title: "100hr Transcendence",
      description: "Achieve the ultimate state and unlock Stem Cell Regeneration - become the Creator of your Vessel.",
      color: "yellow"
    },
    {
      icon: Crown,
      title: "Protocol Pro",
      description: "Unlimited AI coaching and advanced analytics for serious practitioners.",
      color: "rose"
    }
  ];

  const pricingPlans = [
    {
      name: "Protocol Free",
      price: "Free",
      period: "",
      features: [
        "Transmutation Timer",
        "12 Laws Milestones",
        "Time Travel Feature",
        "5 Coach Prompts / Day",
        "Basic Statistics"
      ],
      cta: "Start Free",
      highlighted: false
    },
    {
      name: "Protocol Pro",
      price: "$9.99",
      period: "/month",
      yearlyPrice: "$69.99/year",
      features: [
        "Everything in Free",
        "Unlimited Coach Prompts",
        "Advanced Analytics",
        "Priority Support",
        "Early Access Features"
      ],
      cta: "Go Pro",
      highlighted: true
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <FlowerOfLife />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Protocol Badge with Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <img 
                src="/pathfinder-logo.png" 
                alt="Pathfinder" 
                className="w-10 h-10"
                style={{ 
                  filter: 'invert(83%) sepia(67%) saturate(1000%) hue-rotate(130deg) brightness(104%) contrast(104%)',
                  opacity: 0.9
                }}
              />
              <div className="px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-mono tracking-widest">
                THE PATHFINDER CODEX
              </div>
            </motion.div>

            <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-wider">
              <span className="text-glow-cyan text-cyan-400">THE GRANITE</span>
              <br />
              <span className="text-zinc-300">FAST PROTOCOL</span>
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
              Transform your relationship with fasting.
              <br />
              <span className="text-cyan-400">Master</span> your body goals through the <span className="text-cyan-400">12 Laws of the Universe</span>.
            </p>
            
            <p className="text-zinc-600 text-sm md:text-base max-w-xl mx-auto mb-12">
              Track your transmutation journey through the Pathfinder Codex
              with real-time visualization and AI-powered guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleLogin}
                className="btn-pathfinder text-lg px-8 py-6 font-orbitron tracking-wider"
                data-testid="start-transmuting-btn"
              >
                Begin Protocol
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-900 text-lg px-8 py-6"
                data-testid="learn-more-btn"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Floating indicators */}
          <motion.div 
            className="absolute -left-20 top-1/4 hidden lg:block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-3 h-3 rounded-full bg-cyan-400 glow-cyan" />
          </motion.div>
          <motion.div 
            className="absolute -right-20 top-1/3 hidden lg:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-violet-400 glow-violet" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-zinc-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/pathfinder-logo.png" 
                alt="" 
                className="w-8 h-8"
                style={{ 
                  filter: 'invert(83%) sepia(67%) saturate(1000%) hue-rotate(130deg) brightness(104%) contrast(104%)',
                  opacity: 0.9
                }}
              />
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-cyan-400">
                The Sacred Tools
              </h2>
            </div>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Everything you need to transform your transmutation practice into a spiritual journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 rounded-xl hover:border-cyan-400/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-6 group-hover:glow-cyan transition-all">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-orbitron text-lg font-bold text-zinc-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Laws Preview */}
      <section className="relative py-32 px-6 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/pathfinder-logo.png" 
                alt="" 
                className="w-8 h-8"
                style={{ 
                  filter: 'invert(64%) sepia(70%) saturate(5000%) hue-rotate(250deg) brightness(100%) contrast(100%)',
                  opacity: 0.9
                }}
              />
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-violet-400">
                The Pathfinder Codex
              </h2>
            </div>
            <p className="text-zinc-500 max-w-xl mx-auto">
              12 Laws of Transmutation - Biological & Spiritual Alignment
            </p>
            <p className="text-zinc-400 italic text-sm mt-3">
              "The body breaks so the self can be realized"
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { num: 1, name: "Divine Oneness", phase: "0-8h" },
              { num: 2, name: "Vibration", phase: "9-16h" },
              { num: 3, name: "Action", phase: "17-24h" },
              { num: 4, name: "Correspondence", phase: "25-32h" },
              { num: 5, name: "Cause & Effect", phase: "33-40h" },
              { num: 6, name: "Compensation", phase: "41-48h" },
              { num: 7, name: "Attraction", phase: "49-56h" },
              { num: 8, name: "Transmutation", phase: "57-64h" },
              { num: 9, name: "Relativity", phase: "65-72h" },
              { num: 10, name: "Polarity", phase: "73-80h" },
              { num: 11, name: "Rhythm", phase: "81-90h" },
              { num: 12, name: "Creation", phase: "91-100h+" },
            ].map((law, index) => (
              <motion.div
                key={law.num}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-lg glass-card text-center hover:border-violet-400/30 transition-all"
              >
                <div className="text-violet-400 font-orbitron text-2xl font-bold mb-1">
                  {law.num}
                </div>
                <div className="text-zinc-300 text-sm font-medium mb-1">
                  {law.name}
                </div>
                <div className="text-zinc-600 text-xs font-mono">
                  {law.phase}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/pathfinder-logo.png" 
                alt="" 
                className="w-8 h-8"
                style={{ 
                  filter: 'invert(85%) sepia(60%) saturate(500%) hue-rotate(5deg) brightness(105%) contrast(100%)',
                  opacity: 0.9
                }}
              />
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-yellow-400">
                Choose Your Path
              </h2>
            </div>
            <p className="text-zinc-500 max-w-xl mx-auto">
              Begin your journey free, or unlock unlimited potential with Pro.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-xl ${
                  plan.highlighted 
                    ? 'glass border-violet-500/50 glow-violet' 
                    : 'glass-card'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-500 text-black text-xs font-bold rounded-full">
                    RECOMMENDED
                  </div>
                )}
                
                {plan.highlighted ? (
                  <h3 className="font-orbitron text-2xl font-bold tracking-wider mb-2">
                    <span className="text-cyan-400 text-glow-cyan">GRANITE</span>
                    <span className="text-zinc-300 ml-2">PROTOCOL</span>
                    <span className="text-yellow-400 text-glow-gold ml-2">PRO</span>
                  </h3>
                ) : (
                  <h3 className="font-orbitron text-xl font-bold mb-2 text-zinc-100">
                    {plan.name}
                  </h3>
                )}
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-zinc-100">{plan.price}</span>
                  <span className="text-zinc-500">{plan.period}</span>
                </div>
                
                {plan.yearlyPrice && (
                  <div className="text-zinc-500 text-sm mb-6">
                    or {plan.yearlyPrice} (save 40%)
                  </div>
                )}

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-zinc-300 text-sm">
                      <Check className={`w-4 h-4 ${plan.highlighted ? 'text-violet-400' : 'text-cyan-400'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={handleLogin}
                  className={`w-full ${plan.highlighted ? 'btn-gold' : 'btn-pathfinder'}`}
                  data-testid={`pricing-${plan.name.toLowerCase().replace(' ', '-')}-btn`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-6">
            <div className="text-xl tracking-wider">
              <span className="text-cyan-400">GRANITE</span>
              <span className="text-zinc-600 ml-2">PROTOCOL</span>
            </div>
            <div className="text-zinc-600 text-sm">
              Transmute your potential. Unlock your spirit.
            </div>
          </div>
          <img 
            src="https://customer-assets.emergentagent.com/job_6433fc60-8d3c-464d-b0da-9efbc1ce3ccf/artifacts/zc9k0185_White%20logo%20-%20no%20background.png" 
            alt="Pathfinder DSM" 
            className="h-12 opacity-70"
          />
        </div>
      </footer>
    </div>
  );
};

export default Landing;
