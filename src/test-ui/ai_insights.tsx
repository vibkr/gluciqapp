import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, Sun, Moon, MessageCircle, Lightbulb, Zap, ChevronRight, Eye, Bot, Bell } from 'lucide-react';

const MidnightThemeUI = () => {
  const [isDark, setIsDark] = useState(true); // Default to dark for midnight theme
  const [aiThinking, setAiThinking] = useState(false);
  const [insightIndex, setInsightIndex] = useState(0);

  const insights = [
    "Your glucose tends to spike 2 hours after lunch. Consider a 15-minute walk.",
    "Evening readings are 18% more stable when you eat dinner before 7 PM.",
    "Your best glucose days correlate with 7+ hours of sleep.",
    "Morning readings improve by 12% when you take medication at consistent times."
  ];

  useEffect(() => {
    // AI thinking animation
    const interval = setInterval(() => {
      setAiThinking(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Rotating insights
    const interval = setInterval(() => {
      setInsightIndex(prev => (prev + 1) % insights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const theme = {
    light: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#1a1a2e',
      textSecondary: '#666',
      accent: 'linear-gradient(135deg, #00f5ff 0%, #0096ff 100%)',
      aiGlow: '0 0 30px rgba(0, 245, 255, 0.3)',
      success: 'linear-gradient(135deg, #00ff88 0%, #00d4aa 100%)',
    },
    dark: {
      bg: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
      cardBg: 'rgba(26, 26, 46, 0.95)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: 'linear-gradient(135deg, #00f5ff 0%, #0096ff 100%)',
      aiGlow: '0 0 40px rgba(0, 245, 255, 0.4)',
      success: 'linear-gradient(135deg, #00ff88 0%, #00d4aa 100%)',
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div 
      className="min-h-screen transition-all duration-700 relative overflow-hidden"
      style={{ background: currentTheme.bg }}
    >
      {/* Floating AI Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all duration-1000 ${
              aiThinking ? 'animate-pulse' : ''
            }`}
            style={{ 
              background: currentTheme.cardBg,
              boxShadow: aiThinking ? currentTheme.aiGlow : 'none'
            }}
          >
            <Brain className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
              AI Insights
            </h1>
            <p className="text-sm opacity-80" style={{ color: currentTheme.textSecondary }}>
              {aiThinking ? 'Analyzing patterns...' : 'Your personal advisor'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="relative p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-110" style={{ background: currentTheme.cardBg }}>
            <Bell className="w-5 h-5" style={{ color: currentTheme.textPrimary }} />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></div>
          </button>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-110 hover:rotate-180"
            style={{ background: currentTheme.cardBg }}
          >
            {isDark ? 
              <Sun className="w-5 h-5" style={{ color: currentTheme.textPrimary }} /> : 
              <Moon className="w-5 h-5" style={{ color: currentTheme.textPrimary }} />
            }
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6">
        {/* AI Insight Hero Card */}
        <div 
          className="relative p-8 rounded-3xl backdrop-blur-xl border border-cyan-400/20 overflow-hidden transition-all duration-500"
          style={{ 
            background: currentTheme.cardBg,
            boxShadow: currentTheme.aiGlow
          }}
        >
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#0096ff" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <path 
                d="M0,100 Q100,50 200,100 T400,80" 
                stroke="url(#aiGradient)" 
                strokeWidth="2" 
                fill="none"
                className={aiThinking ? 'animate-pulse' : ''}
              />
              <circle cx="50" cy="100" r="3" fill="#00f5ff" className="animate-ping" />
              <circle cx="350" cy="80" r="2" fill="#0096ff" className="animate-bounce" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
                style={{ background: currentTheme.accent }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
                  Today's Key Insight
                </h2>
                <p className="text-sm opacity-60" style={{ color: currentTheme.textSecondary }}>
                  Powered by your data patterns
                </p>
              </div>
            </div>
            
            <div 
              className="text-lg leading-relaxed mb-6 transition-all duration-500"
              style={{ color: currentTheme.textPrimary }}
              key={insightIndex}
            >
              {insights[insightIndex]}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-cyan-400">AI Confidence: 94%</span>
              </div>
              
              <button 
                className="flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
                style={{ background: currentTheme.accent }}
              >
                <span className="text-white text-sm font-medium">Apply Suggestion</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Pattern Recognition */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: currentTheme.success }}
            >
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
                Pattern Recognition
              </h3>
              <p className="text-sm opacity-70" style={{ color: currentTheme.textSecondary }}>
                What we've learned about you
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                pattern: 'Morning Routine', 
                insight: 'Consistent 7 AM breakfast = 23% better glucose',
                confidence: 89,
                trend: 'positive'
              },
              { 
                pattern: 'Exercise Impact', 
                insight: 'Post-meal walks reduce spikes by 31%',
                confidence: 76,
                trend: 'positive'
              },
              { 
                pattern: 'Sleep Quality', 
                insight: 'Poor sleep nights show 15% higher variability',
                confidence: 82,
                trend: 'negative'
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                    {item.pattern}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        item.trend === 'positive' ? 'bg-green-400' : 'bg-yellow-400'
                      }`}
                    />
                    <span className="text-xs text-cyan-400">{item.confidence}%</span>
                  </div>
                </div>
                
                <p className="text-sm opacity-80 mb-3" style={{ color: currentTheme.textSecondary }}>
                  {item.insight}
                </p>
                
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      background: item.trend === 'positive' ? '#22c55e' : '#eab308',
                      width: `${item.confidence}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: currentTheme.accent }}
              >
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
                Smart Recommendations
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">3 new</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              {
                type: 'Meal Timing',
                title: 'Optimize Your Lunch',
                description: 'Move lunch 30 minutes earlier for 18% better afternoon glucose',
                impact: 'High',
                effort: 'Low',
                icon: '🍽️'
              },
              {
                type: 'Activity',
                title: 'Power Walk Suggestion',
                description: 'A 10-minute walk after dinner could reduce evening spikes',
                impact: 'Medium',
                effort: 'Low',
                icon: '🚶‍♀️'
              },
              {
                type: 'Medication',
                title: 'Timing Optimization',
                description: 'Taking medication 15 minutes earlier aligns with your pattern',
                impact: 'Medium',
                effort: 'Very Low',
                icon: '💊'
              }
            ].map((rec, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{rec.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                        {rec.title}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-400">
                        {rec.type}
                      </span>
                    </div>
                    
                    <p className="text-sm opacity-80 mb-3" style={{ color: currentTheme.textSecondary }}>
                      {rec.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                            Impact:
                          </span>
                          <span 
                            className={`text-xs font-medium ${
                              rec.impact === 'High' ? 'text-green-400' : 
                              rec.impact === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                            }`}
                          >
                            {rec.impact}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <span className="text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                            Effort:
                          </span>
                          <span className="text-xs font-medium text-green-400">
                            {rec.effort}
                          </span>
                        </div>
                      </div>
                      
                      <button className="p-2 rounded-full hover:scale-110 transition-all duration-300" style={{ background: currentTheme.accent + '20' }}>
                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Chat */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: currentTheme.accent }}
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
              Ask Your AI Coach
            </h3>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div 
                className="flex-1 p-3 rounded-2xl rounded-tl-none"
                style={{ background: currentTheme.accent + '20' }}
              >
                <p className="text-sm" style={{ color: currentTheme.textPrimary }}>
                  I noticed your glucose was higher than usual yesterday evening. Would you like me to analyze what might have caused this?
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Ask about your patterns, get advice..."
              className="flex-1 p-3 rounded-xl border border-white/20 bg-white/5 outline-none transition-all duration-300 focus:border-cyan-400"
              style={{ color: currentTheme.textPrimary }}
            />
            <button 
              className="p-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{ background: currentTheme.accent }}
            >
              <Zap className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div 
          className="fixed bottom-6 left-6 right-6 p-4 rounded-3xl backdrop-blur-xl border border-white/20"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex justify-around">
            {[
              { icon: Brain, label: 'AI', active: true },
              { icon: Eye, label: 'Patterns' },
              { icon: Lightbulb, label: 'Tips' },
              { icon: MessageCircle, label: 'Chat' },
              { icon: TrendingUp, label: 'Trends' }
            ].map((item, index) => (
              <button 
                key={index}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-300 ${
                  item.active ? 'scale-110' : 'hover:scale-105'
                }`}
                style={{ 
                  background: item.active ? currentTheme.accent : 'transparent',
                  color: item.active ? 'white' : currentTheme.textSecondary
                }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidnightThemeUI;