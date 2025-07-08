import React, { useState, useEffect } from 'react';
import { Bell, Target, TrendingUp, Award, Zap, Plus, Brain, Heart, Activity, Droplet, Sun, Moon, Diamond, Sparkles } from 'lucide-react';

const CrystalDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentGlucose, setCurrentGlucose] = useState(156);
  const [timeInRange, setTimeInRange] = useState(89);
  const [streak, setStreak] = useState(14);
  const [a1c, setA1c] = useState(6.6);

  // Simulate real-time glucose updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGlucose(prev => prev + (Math.random() - 0.5) * 22);
    }, 4500);
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
        normal: 'from-emerald-400 to-cyan-400',
        caution: 'from-amber-400 to-orange-400',
        danger: 'from-rose-400 to-pink-400'
      };
      return colors[status] || colors.normal;
    } else {
      const colors = {
        optimal: 'from-violet-500 to-purple-500',
        normal: 'from-blue-500 to-violet-500',
        caution: 'from-amber-500 to-orange-500',
        danger: 'from-rose-500 to-pink-500'
      };
      return colors[status] || colors.normal;
    }
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  const theme = darkMode ? {
    bg: 'from-slate-900 via-purple-900 to-slate-900',
    cardBg: 'from-slate-800/80 to-slate-900/60',
    border: 'border-slate-700/50',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-400',
    shadow: 'shadow-black/50',
    primary: 'from-violet-500 to-purple-600',
    accent: 'from-cyan-400 to-blue-500'
  } : {
    bg: 'from-violet-50 via-fuchsia-50 to-cyan-50',
    cardBg: 'from-white/90 to-white/70',
    border: 'border-violet-200/50',
    text: 'text-slate-800',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    shadow: 'shadow-violet-500/10',
    primary: 'from-violet-600 to-purple-600',
    accent: 'from-cyan-500 to-blue-600'
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} transition-all duration-500`}>
      {/* Status Bar */}
      <div className="pt-12 pb-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.primary} flex items-center justify-center shadow-lg`}>
              <Diamond className="w-4 h-4 text-white" />
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
              <div className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r ${theme.accent} rounded-full animate-pulse`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Glucose Section */}
      <div className="px-6 mb-8">
        <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl border ${theme.border} shadow-2xl ${theme.shadow}`}>
          <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${darkMode ? 'from-violet-500/10 to-purple-500/5' : 'from-violet-100/50 to-purple-50/30'}`}></div>
          
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
                  <Sparkles className={`w-4 h-4 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                  <p className={`${darkMode ? 'text-violet-400' : 'text-violet-600'} text-sm font-medium`}>Crystal clear control</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 mb-3">
                  <TrendingUp className={`w-4 h-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  <span className={`${darkMode ? 'text-emerald-400' : 'text-emerald-600'} text-sm font-medium`}>+2.4</span>
                </div>
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGlucoseColor(glucoseStatus)} flex items-center justify-center shadow-xl relative overflow-hidden`}>
                    <div className={`absolute inset-2 rounded-full ${darkMode ? 'bg-black/20' : 'bg-white/30'}`}></div>
                    <div className="text-center relative z-10">
                      <span className="text-white font-bold text-lg block">{timeInRange}%</span>
                      <span className="text-white/80 text-xs">TIR</span>
                    </div>
                  </div>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${theme.accent} rounded-full flex items-center justify-center shadow-lg`}>
                    <Diamond className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Prismatic Chart */}
            <div className={`h-24 flex items-end space-x-1 mb-4 ${darkMode ? 'bg-slate-800/30' : 'bg-gradient-to-r from-violet-50 to-purple-50'} rounded-2xl p-4 border ${darkMode ? 'border-slate-700/30' : 'border-violet-100'}`}>
              {[...Array(20)].map((_, i) => {
                const height = 25 + Math.random() * 60;
                const isRecent = i >= 16;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-lg transition-all duration-700 ${
                      isRecent 
                        ? `bg-gradient-to-t ${getGlucoseColor(glucoseStatus)} shadow-lg`
                        : darkMode 
                          ? 'bg-gradient-to-t from-slate-600 to-slate-500 opacity-40'
                          : 'bg-gradient-to-t from-violet-200 to-purple-300 opacity-50'
                    }`}
                    style={{ 
                      height: `${height}%`,
                      filter: isRecent ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' : 'none'
                    }}
                  ></div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className={`text-xs ${theme.textMuted} font-medium`}>Average</p>
                  <p className={`font-bold ${theme.text}`}>152</p>
                </div>
                <div className="text-center">
                  <p className={`text-xs ${theme.textMuted} font-medium`}>Range</p>
                  <p className={`font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{timeInRange}%</p>
                </div>
                <div className="text-center">
                  <p className={`text-xs ${theme.textMuted} font-medium`}>Stability</p>
                  <p className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>14%</p>
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
            <h3 className={`text-lg font-bold ${theme.text}`}>A1C Crystal Path</h3>
            <div className="flex items-center space-x-2">
              <Target className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>Progressing</span>
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
                    className={darkMode ? 'text-slate-700' : 'text-violet-200'}
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    stroke="url(#a1cCrystalGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${((7.5 - a1c) / 1.5) * 339} 339`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="a1cCrystalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className={`text-3xl font-bold ${theme.text}`}>{a1c}%</span>
                    <p className={`text-xs ${darkMode ? 'text-violet-400' : 'text-violet-600'} font-medium`}>Getting there!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-sm ${theme.textSecondary} font-medium`}>Target: 6.5%</span>
                <span className={`text-sm font-bold ${darkMode ? 'text-violet-400' : 'text-violet-600'} flex items-center`}>
                  <Diamond className="w-4 h-4 mr-1" />
                  0.1% to go! ✨
                </span>
              </div>
              <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-violet-100'} rounded-full overflow-hidden`}>
                <div 
                  className={`h-full bg-gradient-to-r ${theme.primary} rounded-full transition-all duration-1000 relative overflow-hidden`}
                  style={{ width: `${((7.5 - a1c) / 1.0) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className={`text-xs ${theme.textSecondary}`}>💎 Almost perfect crystal clarity</p>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 bg-gradient-to-r ${theme.primary} rounded-full animate-pulse`}></div>
                  <span className={`text-xs ${darkMode ? 'text-violet-400' : 'text-violet-600'} font-medium`}>Excellent</span>
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
              <span>Crystal AI</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-22 h-22 rounded-2xl border-4 ${darkMode ? 'border-slate-600' : 'border-violet-200'} relative overflow-hidden bg-gradient-to-br ${darkMode ? 'from-slate-700 to-slate-800' : 'from-violet-50 to-purple-50'}`}>
                <div className={`absolute inset-2 rounded-xl bg-gradient-to-br ${theme.accent} flex items-center justify-center shadow-lg`}>
                  <span className="text-white font-bold text-xl">9.4</span>
                </div>
              </div>
              <div className={`absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg`}>
                <span className="text-white text-xs font-bold">A+</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className={`font-bold ${theme.text} mb-1`}>Rainbow Buddha Bowl</h4>
              <p className={`text-sm ${theme.textSecondary} mb-2`}>Perfectly balanced for clarity ✨</p>
              <div className="flex flex-wrap gap-2">
                <div className={`px-3 py-1 ${darkMode ? 'bg-violet-400/20 text-violet-400 border border-violet-400/30' : 'bg-violet-100 text-violet-700 border border-violet-200'} text-xs rounded-full font-medium`}>
                  🌈 Colorful
                </div>
                <div className={`px-3 py-1 ${darkMode ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'bg-cyan-100 text-cyan-700 border border-cyan-200'} text-xs rounded-full font-medium`}>
                  💎 Premium
                </div>
                <div className={`px-3 py-1 ${darkMode ? 'bg-purple-400/20 text-purple-400 border border-purple-400/30' : 'bg-purple-100 text-purple-700 border border-purple-200'} text-xs rounded-full font-medium`}>
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
            <h3 className={`text-lg font-bold ${theme.text}`}>VictoryTrack™ Crystal</h3>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          
          <div className="flex items-center space-x-6 mb-6">
            <div className="text-center">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-2 relative shadow-xl">
                <span className="text-3xl animate-pulse">🔥</span>
                <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-sm font-bold">{streak}</span>
                </div>
              </div>
              <p className={`text-xs ${theme.textSecondary} font-medium`}>Day Streak</p>
              <p className={`text-xs ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>Crystal clear!</p>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${theme.textSecondary} font-medium`}>Crystal Level 4</span>
                <span className={`text-sm font-bold ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}>320/400 XP</span>
              </div>
              <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-violet-100'} rounded-full overflow-hidden border ${darkMode ? 'border-slate-600' : 'border-violet-200'}`}>
                <div 
                  className={`h-full bg-gradient-to-r ${theme.primary} rounded-full transition-all duration-1000 relative overflow-hidden`}
                  style={{ width: '80%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                </div>
              </div>
              <p className={`text-xs ${theme.textSecondary} mt-2 flex items-center`}>
                <Diamond className="w-3 h-3 mr-1" />
                80 XP to unlock Diamond Master badge
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '💎', name: 'Crystal Clear', earned: true },
              { icon: '🌟', name: 'Bright Star', earned: true },
              { icon: '🎨', name: 'Colorful', earned: true },
              { icon: '👑', name: 'Diamond', earned: false }
            ].map((achievement, i) => (
              <div key={i} className={`text-center p-4 rounded-2xl transition-all duration-300 ${
                achievement.earned 
                  ? darkMode
                    ? 'bg-gradient-to-br from-slate-700/50 to-slate-800/30 border-2 border-slate-600/50 shadow-lg'
                    : 'bg-gradient-to-br from-white to-violet-50 border-2 border-violet-200 shadow-lg'
                  : darkMode
                    ? 'bg-slate-800/30 border-2 border-slate-700/30'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200'
              }`}>
                <div className={`text-2xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
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
              <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
            </div>
            <p className="font-bold text-left">Insulin Calculator</p>
            <p className="text-xs opacity-80 text-left mt-1">Crystal precision</p>
          </button>
          <button className={`p-5 rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-xl transform hover:scale-105 hover:shadow-2xl transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6" />
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="font-bold text-left">Activity Log</p>
            <p className="text-xs opacity-80 text-left mt-1">Track movement</p>
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
                  : `${theme.textSecondary} hover:${darkMode ? 'bg-slate-700/50' : 'bg-violet-100'} hover:${theme.text}`
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

export default CrystalDashboard;