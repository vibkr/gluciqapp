import React, { useState, useEffect } from 'react';
import { Bell, Target, TrendingUp, Award, Zap, Plus, Brain, Heart, Activity, Droplet, Sun, Moon, Waves, Anchor } from 'lucide-react';

const OceanDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentGlucose, setCurrentGlucose] = useState(142);
  const [timeInRange, setTimeInRange] = useState(87);
  const [streak, setStreak] = useState(31);
  const [a1c, setA1c] = useState(6.3);

  // Simulate real-time glucose updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGlucose(prev => prev + (Math.random() - 0.5) * 20);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const getGlucoseStatus = (value) => {
    if (value >= 70 && value <= 180) return 'optimal';
    if (value >= 60 && value <= 250) return 'normal';
    if (value > 250 || value < 60) return 'caution';
    return 'danger';
  };

  const getGlucoseColor = (status) => {
    if (darkMode) {
      const colors = {
        optimal: 'from-cyan-400 to-blue-400',
        normal: 'from-blue-400 to-indigo-400',
        caution: 'from-teal-400 to-cyan-400',
        danger: 'from-indigo-400 to-purple-400'
      };
      return colors[status] || colors.normal;
    } else {
      const colors = {
        optimal: 'from-cyan-500 to-blue-500',
        normal: 'from-blue-500 to-indigo-500',
        caution: 'from-teal-500 to-cyan-500',
        danger: 'from-indigo-500 to-purple-500'
      };
      return colors[status] || colors.normal;
    }
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  const theme = darkMode ? {
    bg: 'from-slate-900 via-blue-900 to-indigo-900',
    cardBg: 'from-slate-800/80 to-blue-900/60',
    border: 'border-blue-700/50',
    text: 'text-white',
    textSecondary: 'text-blue-200',
    textMuted: 'text-blue-300',
    shadow: 'shadow-black/50',
    primary: 'from-cyan-500 to-blue-600',
    accent: 'from-teal-400 to-cyan-500',
    surface: 'bg-slate-800/30',
    surfaceBorder: 'border-blue-700/30'
  } : {
    bg: 'from-cyan-50 via-blue-50 to-indigo-50',
    cardBg: 'from-white/90 to-cyan-50/70',
    border: 'border-blue-200/50',
    text: 'text-slate-800',
    textSecondary: 'text-blue-700',
    textMuted: 'text-blue-600',
    shadow: 'shadow-blue-500/10',
    primary: 'from-cyan-600 to-blue-600',
    accent: 'from-teal-500 to-cyan-600',
    surface: 'bg-gradient-to-r from-cyan-50 to-blue-50',
    surfaceBorder: 'border-blue-100'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-500`}>
      {/* Status Bar */}
      <div className="pt-12 pb-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.primary} flex items-center justify-center shadow-lg`}>
              <Waves className="w-4 h-4 text-white" />
            </div>
            <h1 className={`text-xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
              Defeat
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full bg-gradient-to-r ${theme.primary} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <Bell className={`w-6 h-6 ${theme.textSecondary}`} />
              <div className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r ${theme.accent} rounded-full animate-pulse shadow-lg`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Glucose Section */}
      <div className="px-6 mb-8">
        <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl border ${theme.border} shadow-2xl ${theme.shadow}`}>
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${darkMode ? 'from-cyan-500/10 to-blue-500/5' : 'from-cyan-100/50 to-blue-50/30'}`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <p className={`${theme.textSecondary} text-sm font-medium`}>Current Glucose</p>
                  <div className={`w-2 h-2 bg-gradient-to-r ${getGlucoseColor(glucoseStatus)} rounded-full animate-pulse`}></div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-5xl font-bold bg-gradient-to-r ${getGlucoseColor(glucoseStatus)} bg-clip-text text-transparent animate-pulse`}>
                    {Math.round(currentGlucose)}
                  </span>
                  <span className={`${theme.textSecondary} text-lg font-medium`}>mg/dL</span>
                </div>
                <div className="flex items-center space-x-1 mt-2">
                  <Waves className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <p className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'} text-sm font-medium`}>Flowing smoothly</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 mb-3">
                  <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                  <span className={`${darkMode ? 'text-teal-400' : 'text-teal-600'} text-sm font-medium`}>Steady</span>
                </div>
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGlucoseColor(glucoseStatus)} flex items-center justify-center shadow-xl relative overflow-hidden`}>
                    <div className={`absolute inset-2 rounded-full ${darkMode ? 'bg-black/20' : 'bg-white/30'}`}></div>
                    <div className="text-center relative z-10">
                      <span className="text-white font-bold text-lg block">{timeInRange}%</span>
                      <span className="text-white/80 text-xs">TIR</span>
                    </div>
                  </div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${theme.accent} rounded-full flex items-center justify-center shadow-lg animate-pulse`}>
                    <Anchor className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ocean Wave Chart */}
            <div className={`h-24 flex items-end space-x-1 mb-4 ${theme.surface} rounded-2xl p-4 border ${theme.surfaceBorder}`}>
              {[...Array(22)].map((_, i) => {
                const height = 25 + Math.random() * 60 + Math.sin(i * 0.5) * 15;
                const isRecent = i >= 18;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-full transition-all duration-700 ${
                      isRecent 
                        ? `bg-gradient-to-t ${getGlucoseColor(glucoseStatus)} shadow-lg`
                        : darkMode 
                          ? 'bg-gradient-to-t from-blue-600 to-cyan-500 opacity-30'
                          : 'bg-gradient-to-t from-blue-200 to-cyan-300 opacity-50'
                    }`}
                    style={{ 
                      height: `${Math.max(height, 20)}%`,
                      filter: isRecent ? 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))' : 'none'
                    }}
                  ></div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className={`text-xs ${theme.textMuted} font-medium`}>Average</p>
                  <p className={`font-bold ${theme.text}`}>148</p>
                </div>
                <div className="text-center">
                  <p className={`text-xs ${theme.textMuted} font-medium`}>Range</p>
                  <p className={`font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>{timeInRange}%</p>
                </div>
                <div className="text-center">
                  <p className={`text-xs ${theme.textMuted} font-medium`}>Flow</p>
                  <p className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Smooth</p>
                </div>
              </div>
              <button className={`px-6 py-3 bg-gradient-to-r ${theme.primary} text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2`}>
                <Plus className="w-4 h-4" />
                <span>Log Reading</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* A1C Progress */}
      <div className="px-6 mb-8">
        <div className={`p-6 rounded-3xl bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl border ${theme.border} shadow-xl ${theme.shadow}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${theme.text}`}>A1C Ocean Depths</h3>
            <div className="flex items-center space-x-2">
              <Target className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Excellent!</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className={darkMode ? 'text-slate-700' : 'text-blue-200'}
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="url(#a1cOceanGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${((7.0 - a1c) / 1.0) * 339} 339`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="a1cOceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={`text-3xl font-bold ${theme.text}`}>{a1c}%</span>
                    <p className={`text-xs ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} font-medium`}>Perfect! 🌊</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-sm ${theme.textSecondary} font-medium`}>Target: 6.5%</span>
                <span className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} flex items-center`}>
                  <Anchor className="w-4 h-4 mr-1" />
                  Goal achieved! 🎯
                </span>
              </div>
              <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-blue-100'} rounded-full overflow-hidden`}>
                <div 
                  className={`h-full bg-gradient-to-r ${theme.primary} rounded-full transition-all duration-1000 relative overflow-hidden`}
                  style={{ width: '100%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className={`text-xs ${theme.textSecondary}`}>🌊 Sailing in perfect waters</p>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 bg-gradient-to-r ${theme.primary} rounded-full animate-pulse`}></div>
                  <span className={`text-xs ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} font-medium`}>Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GlucoBalance™ Showcase */}
      <div className="px-6 mb-8">
        <div className={`p-6 rounded-3xl bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl border ${theme.border} shadow-xl ${theme.shadow}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${theme.text}`}>GlucoBalance™</h3>
            <div className={`px-3 py-1 bg-gradient-to-r ${theme.accent} text-white text-xs rounded-full font-medium shadow-lg flex items-center space-x-1`}>
              <Brain className="w-3 h-3" />
              <span>Ocean AI</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-22 h-22 rounded-2xl border-4 ${darkMode ? 'border-blue-600' : 'border-blue-200'} relative overflow-hidden bg-gradient-to-br ${darkMode ? 'from-slate-700 to-slate-800' : 'from-cyan-50 to-blue-50'}`}>
                <div className={`absolute inset-2 rounded-xl bg-gradient-to-br ${theme.accent} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-xl">9.6</span>
                </div>
              </div>
              <div className={`absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg animate-pulse`}>
                <span className="text-white text-xs font-bold">A+</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className={`font-bold ${theme.text} mb-1`}>Ocean Fresh Poke Bowl</h4>
              <p className={`text-sm ${theme.textSecondary} mb-2`}>Deep sea nutrition, perfect balance 🐟</p>
              <div className="flex flex-wrap gap-2">
                <div className={`px-3 py-1 ${darkMode ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'bg-cyan-100 text-cyan-700 border border-cyan-200'} text-xs rounded-full font-medium`}>
                  🌊 Fresh
                </div>
                <div className={`px-3 py-1 ${darkMode ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30' : 'bg-blue-100 text-blue-700 border border-blue-200'} text-xs rounded-full font-medium`}>
                  🐟 Omega-rich
                </div>
                <div className={`px-3 py-1 ${darkMode ? 'bg-teal-400/20 text-teal-400 border border-teal-400/30' : 'bg-teal-100 text-teal-700 border border-teal-200'} text-xs rounded-full font-medium`}>
                  ⚡ Energizing
                </div>
              </div>
            </div>
            
            <button className={`p-3 bg-gradient-to-r ${theme.accent} text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Achievement Gallery */}
      <div className="px-6 mb-8">
        <div className={`p-6 rounded-3xl bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl border ${theme.border} shadow-xl ${theme.shadow}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${theme.text}`}>VictoryTrack™ Ocean</h3>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="text-center">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 flex items-center justify-center mb-2 relative shadow-xl animate-pulse">
                <span className="text-3xl">🌊</span>
                <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-sm font-bold">{streak}</span>
                </div>
              </div>
              <p className={`text-xs ${theme.textSecondary} font-medium`}>Day Streak</p>
              <p className={`text-xs ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Tidal wave!</p>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${theme.textSecondary} font-medium`}>Ocean Level 6</span>
                <span className={`text-sm font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>580/600 XP</span>
              </div>
              <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-blue-100'} rounded-full overflow-hidden border ${darkMode ? 'border-blue-600' : 'border-blue-200'}`}>
                <div 
                  className={`h-full bg-gradient-to-r ${theme.primary} rounded-full transition-all duration-1000 relative overflow-hidden`}
                  style={{ width: '97%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                </div>
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-2 flex items-center`}>
                <Waves className="w-3 h-3 mr-1" />
                20 XP to unlock Ocean Master badge
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '🌊', name: 'Wave Rider', earned: true },
              { icon: '⚓', name: 'Anchored', earned: true },
              { icon: '🐋', name: 'Deep Diver', earned: true },
              { icon: '🔱', name: 'Ocean Master', earned: false }
            ].map((achievement, i) => (
              <div key={i} className={`text-center p-4 rounded-2xl transition-all duration-300 ${
                achievement.earned 
                  ? darkMode
                    ? 'bg-gradient-to-br from-slate-700/50 to-slate-800/30 border-2 border-blue-600/50 shadow-lg shadow-blue-500/20'
                    : 'bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-lg shadow-blue-500/20'
                  : darkMode
                    ? 'bg-slate-800/30 border-2 border-slate-700/30'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200'
              }`}>
                <div className={`text-2xl mb-2 ${achievement.earned ? 'animate-pulse' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <p className={`text-xs font-medium ${achievement.earned ? theme.text : theme.textMuted}`}>
                  {achievement.name}
                </p>
                {achievement.earned && (
                  <div className={`w-full h-1 rounded-full mt-2 bg-gradient-to-r ${theme.primary}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Quick Actions */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <button className={`p-5 rounded-2xl bg-gradient-to-br ${theme.primary} text-white shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-6 h-6" />
              <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
            </div>
            <p className="font-bold text-left">Insulin Calculator</p>
            <p className="text-xs opacity-80 text-left mt-1">Ocean precision</p>
          </button>
          <button className={`p-5 rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6" />
              <Heart className="w-4 h-4 text-blue-200" />
            </div>
            <p className="font-bold text-left">Flow Log</p>
            <p className="text-xs opacity-80 text-left mt-1">Track rhythm</p>
          </button>
        </div>
      </div>

      {/* Floating Navigation */}
      <div className="fixed bottom-6 left-6 right-6">
        <div className={`${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-xl rounded-2xl border ${theme.border} shadow-2xl ${theme.shadow} p-2`}>
          <div className="flex justify-around">
            {[
              { icon: Target, label: 'Today', active: true },
              { icon: Droplet, label: 'Glucose', notification: true },
              { icon: Zap, label: 'Insulin' },
              { icon: Brain, label: 'Insights' },
              { icon: Award, label: 'Progress' }
            ].map((tab, i) => (
              <button key={i} className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                tab.active 
                  ? `bg-gradient-to-br ${theme.primary} text-white shadow-lg` 
                  : `${theme.textSecondary} hover:${darkMode ? 'bg-slate-700/50' : 'bg-blue-100'} hover:${theme.text}`
              }`}>
                <div className="relative">
                  <tab.icon className="w-5 h-5" />
                  {tab.notification && (
                    <div className={`absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r ${theme.accent} rounded-full animate-pulse`}></div>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OceanDashboard;