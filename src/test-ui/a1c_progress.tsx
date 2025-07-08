import React, { useState, useEffect } from 'react';
import { Heart, Activity, TrendingDown, Sun, Moon, Target, Calendar, Leaf, BarChart3, Stethoscope } from 'lucide-react';

const SageThemeUI = () => {
  const [isDark, setIsDark] = useState(false);
  const [a1cProgress, setA1cProgress] = useState(0);
  const [targetA1c] = useState(68); // 6.8%

  useEffect(() => {
    // Animated A1C progress
    const timer = setTimeout(() => {
      if (a1cProgress < targetA1c) {
        setA1cProgress(prev => Math.min(prev + 1, targetA1c));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [a1cProgress, targetA1c]);

  const theme = {
    light: {
      bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
      cardBg: 'rgba(255, 255, 255, 0.95)',
      textPrimary: '#2d5a3d',
      textSecondary: '#6b7280',
      accent: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      success: 'linear-gradient(135deg, #88d8a3 0%, #e4f4f7 100%)',
      healthGlow: '0 0 30px rgba(113, 178, 128, 0.3)',
    },
    dark: {
      bg: 'linear-gradient(135deg, #0f1419 0%, #1a2f23 100%)',
      cardBg: 'rgba(26, 47, 35, 0.95)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: 'linear-gradient(135deg, #00ff88 0%, #00d4aa 100%)',
      success: 'linear-gradient(135deg, #40e0d0 0%, #48cae4 100%)',
      healthGlow: '0 0 30px rgba(0, 255, 136, 0.3)',
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div 
      className="min-h-screen transition-all duration-700"
      style={{ background: currentTheme.bg }}
    >
      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20"
            style={{ background: currentTheme.cardBg }}
          >
            <Leaf className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
              Health Dashboard
            </h1>
            <p className="text-sm opacity-80" style={{ color: currentTheme.textSecondary }}>
              Your wellness journey
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-110" style={{ background: currentTheme.cardBg }}>
            <Calendar className="w-5 h-5" style={{ color: currentTheme.textPrimary }} />
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
        {/* A1C Progress Hero */}
        <div 
          className="relative p-8 rounded-3xl backdrop-blur-xl border border-white/20 overflow-hidden transition-all duration-500"
          style={{ 
            background: currentTheme.cardBg,
            boxShadow: currentTheme.healthGlow
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.textPrimary }}>
                A1C Progress
              </h2>
              <p className="text-sm opacity-70" style={{ color: currentTheme.textSecondary }}>
                3-month average
              </p>
            </div>
            
            <div className="text-right">
              <div className="flex items-baseline space-x-1">
                <span 
                  className="text-4xl font-bold"
                  style={{ color: currentTheme.textPrimary }}
                >
                  {(a1cProgress / 10).toFixed(1)}
                </span>
                <span className="text-lg opacity-60" style={{ color: currentTheme.textSecondary }}>
                  %
                </span>
              </div>
              <p className="text-sm text-green-500 flex items-center space-x-1">
                <TrendingDown className="w-4 h-4" />
                <span>Improving</span>
              </p>
            </div>
          </div>
          
          {/* A1C Visualization */}
          <div className="relative">
            <div className="flex items-center space-x-4">
              {/* Circular Progress */}
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#a1cGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(a1cProgress / 100) * 251.2} 251.2`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="a1cGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#56ab2f"/>
                      <stop offset="100%" stopColor="#a8e6cf"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-500" />
                </div>
              </div>
              
              {/* Progress Details */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: currentTheme.textSecondary }}>Target: 7.0%</span>
                  <span className="text-sm font-medium text-green-500">0.2% to goal</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs" style={{ color: currentTheme.textSecondary }}>
                    <span>Jan: 7.4%</span>
                    <span>Feb: 7.1%</span>
                    <span>Mar: 6.8%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        background: currentTheme.accent,
                        width: '85%'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Blood Pressure */}
          <div 
            className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
            style={{ background: currentTheme.cardBg }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                  Blood Pressure
                </h3>
                <p className="text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                  Today, 9:15 AM
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.textPrimary }}>
                118/76
              </div>
              <p className="text-xs text-green-500">Normal</p>
            </div>
          </div>

          {/* Weight Trend */}
          <div 
            className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
            style={{ background: currentTheme.cardBg }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                  Weight Trend
                </h3>
                <p className="text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                  7-day average
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1" style={{ color: currentTheme.textPrimary }}>
                -2.3 lbs
              </div>
              <p className="text-xs text-green-500">On track</p>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
              This Week's Impact
            </h3>
            <button 
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{ 
                background: currentTheme.accent,
                color: 'white'
              }}
            >
              View Details
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Exercise', value: '5', unit: 'days', progress: 71, icon: Activity, color: '#22c55e' },
              { label: 'Medication', value: '98', unit: '%', progress: 98, icon: Stethoscope, color: '#3b82f6' },
              { label: 'Sleep', value: '7.2', unit: 'hrs', progress: 85, icon: Moon, color: '#8b5cf6' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: item.color + '20' }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                
                <div className="mb-2">
                  <div className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
                    {item.value}
                  </div>
                  <div className="text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                    {item.unit}
                  </div>
                </div>
                
                <div className="text-xs mb-2" style={{ color: currentTheme.textSecondary }}>
                  {item.label}
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="h-1 rounded-full transition-all duration-1000"
                    style={{ 
                      backgroundColor: item.color,
                      width: `${item.progress}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Score Card */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2" style={{ color: currentTheme.textPrimary }}>
              Overall Health Score
            </h3>
            <div 
              className="text-5xl font-bold mb-4"
              style={{ 
                color: currentTheme.textPrimary,
                textShadow: '0 0 20px rgba(86, 171, 47, 0.3)'
              }}
            >
              87
            </div>
            <p className="text-sm mb-4" style={{ color: currentTheme.textSecondary }}>
              Excellent progress! Keep up the great work.
            </p>
            
            <div 
              className="p-3 rounded-xl text-center transition-all duration-300"
              style={{ background: currentTheme.accent }}
            >
              <p className="text-white text-sm font-medium">
                🎯 Next milestone: 90 points
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div 
          className="fixed bottom-6 left-6 right-6 p-4 rounded-3xl backdrop-blur-xl border border-white/20"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex justify-around">
            {[
              { icon: BarChart3, label: 'Health', active: true },
              { icon: Activity, label: 'Activity' },
              { icon: Heart, label: 'Vitals' },
              { icon: Target, label: 'Goals' },
              { icon: Calendar, label: 'History' }
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

export default SageThemeUI;