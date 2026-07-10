import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#111827] flex flex-col">
      
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-br from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent tracking-tight">
            Avenir AI
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">Features</a>
          <a href="#workflow" className="text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">Workflow</a>
          <a href="#about" className="text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors">About Us</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('login')}
            className="text-sm font-semibold text-[#6B7280] hover:text-[#111827] transition-colors px-4 py-2 cursor-pointer"
          >
            Log In
          </button>
          <motion.button 
            onClick={() => onNavigate('signup')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-semibold text-white bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] px-5 py-2.5 rounded-[12px] shadow-md cursor-pointer transition-all duration-200"
          >
            Sign Up
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow pt-28">
        <motion.section 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto px-6 md:px-8 py-16 text-center flex flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Career Optimization</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-tight max-w-4xl mb-6"
          >
            Optimize Your Resume.{' '}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
              Land Your Dream Job.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-lg text-[#6B7280] font-medium max-w-2xl leading-relaxed mb-10"
          >
            Avenir AI is an enterprise-grade Gap Analyzer & Mock Interview Coach designed to bypass ATS restrictions and prepare you for technical rounds.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button 
              onClick={() => onNavigate('signup')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 font-semibold text-white bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] hover:from-[#3B82F6] hover:to-[#8B5CF6] rounded-[12px] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            
            <motion.button 
              onClick={() => onNavigate('login')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 font-semibold text-[#111827] bg-white border border-[#E5E7EB] hover:bg-gray-50 rounded-[12px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
            >
              <span>Learn More</span>
            </motion.button>
          </motion.div>

          {/* Hero Mockup Panel */}
          <motion.div 
            variants={itemVariants}
            className="w-full max-w-5xl rounded-[16px] border border-[#E5E7EB] bg-white shadow-card p-4 md:p-6 mb-24 relative overflow-hidden"
          >
            {/* Topbar bar */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-gray-100 flex-shrink-0">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs text-[#6B7280] font-semibold ml-4">app.avenirai.com/dashboard</span>
            </div>

            {/* Mock Dashboard grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Card 1 */}
              <div className="border border-gray-100 rounded-xl p-5 bg-[#F8FAFC]">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#2563EB] mb-4">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1">AI Gap Analysis</h3>
                <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                  Extracts semantic mismatches between experience bullet points and JD items instantly.
                </p>
              </div>

              {/* Card 2 */}
              <div className="border border-gray-100 rounded-xl p-5 bg-[#F8FAFC]">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-[#7C3AED] mb-4">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1">ATS Check</h3>
                <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                  Validates layouts, spacing, and parses hidden structures to optimize for standard filters.
                </p>
              </div>

              {/* Card 3 */}
              <div className="border border-gray-100 rounded-xl p-5 bg-[#F8FAFC]">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-[#10B981] mb-4">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#111827] mb-1">Mock Interview Coach</h3>
                <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                  Generates customized audio/text questions targeted directly at your project gaps.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="bg-white border-y border-[#E5E7EB] py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
              Everything you need to secure invitations
            </h2>
            <p className="text-[#6B7280] font-medium max-w-xl mx-auto mb-16">
              Our enterprise algorithms reverse-engineer standard hiring pipelines to highlight metrics that matter.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Semantic Skill Mapping',
                  desc: 'Goes beyond standard keyword matching. We analyze your actual project context to suggest powerful phrasing.',
                  icon: Brain
                },
                {
                  title: 'ATS Parser Check',
                  desc: 'Run validation tests matching filters used by companies worldwide to prevent document truncation.',
                  icon: ShieldCheck
                },
                {
                  title: 'Gap Correction Plans',
                  desc: 'Get customized step-by-step guides containing reading suggestions, micro-projects, and references.',
                  icon: Layers
                }
              ].map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -8 }}
                    className="border border-[#E5E7EB] hover:border-[#2563EB]/20 bg-[#F8FAFC] rounded-[16px] p-8 text-left transition-all duration-300 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#2563EB] mb-6 shadow-sm">
                      <FeatIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111827] mb-2">{feat.title}</h3>
                    <p className="text-sm text-[#6B7280] font-medium leading-relaxed">{feat.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="workflow" className="py-24 max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-[#6B7280] font-medium max-w-xl mx-auto mb-16">
            Get comprehensive analytics and ready resumes in less than five minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF resume into the parser.' },
              { step: '02', title: 'Paste Job Details', desc: 'Provide the target job description or paste links.' },
              { step: '03', title: 'Review Gaps', desc: 'Read tailored improvement plans highlighting metrics.' },
              { step: '04', title: 'Practice Interview', desc: 'Run mock questions simulation customized for gaps.' }
            ].map((wf, idx) => (
              <div key={idx} className="border border-gray-100 bg-white rounded-xl p-6 shadow-sm relative">
                <span className="text-3xl font-black bg-gradient-to-br from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent absolute top-4 right-4 opacity-30">
                  {wf.step}
                </span>
                <h3 className="text-base font-bold text-[#111827] mb-2">{wf.title}</h3>
                <p className="text-xs text-[#6B7280] font-medium leading-relaxed">{wf.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="bg-[#FFFFFF] border-t border-[#E5E7EB] py-24">
          <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-4">
              About Avenir AI
            </h2>
            <p className="text-[#6B7280] font-medium max-w-xl mx-auto mb-16">
              Empowering candidate potential by bridging the gap between talent and recruitment technology.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
              {/* Vision Card */}
              <div className="border border-[#E5E7EB] rounded-[16px] p-8 bg-[#F8FAFC] shadow-sm">
                <h3 className="text-lg font-bold text-[#111827] mb-3">Our Vision</h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
                  We believe standard keyword-based filters shouldn't block qualified engineers. Our goal is to make recruiting transparent and give every applicant the exact tools needed to present their experience clearly.
                </p>
              </div>

              {/* Technology Card */}
              <div className="border border-[#E5E7EB] rounded-[16px] p-8 bg-[#F8FAFC] shadow-sm">
                <h3 className="text-lg font-bold text-[#111827] mb-3">Our Technology</h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
                  Avenir AI parses layouts and semantic context using custom algorithms that match interviewer standards. We analyze document readability and highlight critical gaps in experience representation.
                </p>
              </div>

              {/* Commitment Card */}
              <div className="border border-[#E5E7EB] rounded-[16px] p-8 bg-[#F8FAFC] shadow-sm">
                <h3 className="text-lg font-bold text-[#111827] mb-3">Our Commitment</h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
                  We are committed to helping software engineers, designers, and managers prepare for interviews with state-of-the-art tools, mock scenarios, and feedback loops built directly by hiring experts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#111827]">Avenir AI</span> &copy; 2026. All rights reserved.
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-[#111827] transition-colors">Features</a>
            <a href="#about" className="hover:text-[#111827] transition-colors">About Us</a>
            <a href="#privacy" className="hover:text-[#111827] transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-[#111827] transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
