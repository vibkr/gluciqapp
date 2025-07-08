import React, { useState, useEffect } from 'react';
import { Bell, Target, TrendingUp, Award, Zap, Plus, Brain, Heart, Activity, Droplet, Moon, Cpu } from 'lucide-react';

const MidnightDashboard = () => {
  const [currentGlucose, setCurrentGlucose] = useState(162);
  const [timeInRange, setTimeInRange] = useState(84);
  const [streak, setStreak] = useState(18);
  const [a1c, setA1c] = useState(6.4);

  // Simulate real-time glucose updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGlucose(prev => prev + (Math.random() - 0.5) * 15);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getGlucoseStatus = (value) => {
    if (value >= 70 && value <= 180) return 'optimal';
    if (value >= 60 && value <= 250) return 'normal';
    if (value > 250 || value < 60) return 'caution';
    return 'danger';
  };

  const getGlucoseColor = (status) => {
    const colors = {
      optimal: 'from-green-400 to-cyan-300',
      normal: 'from-cyan-400 to-blue-400',
      caution: 'from-amber-400 to-orange-400',
      danger: 'from-red-400 to-pink-400'
    };
    return colors[status] || colors.normal;
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Status Bar */}
      <div className="pt-12 pb-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Droplet className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Defeat
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Moon className="w-5 h-5 text-gray-400" />
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Glucose Section */}
      <div className="px-6 mb-8">
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/50">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm font-medium">Current Glucose</p>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-5xl font-bold bg-gradient-to-r ${getGlucoseColor(glucoseStatus)} bg-clip-text text-transparent animate-pulse`}>
                    {Math.round(currentGlucose)}
                  </span>
                  <span className="text-gray-400 text-lg">mg/dL</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">+1.8</span>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center relative overflow-hidden shadow-lg shadow-green-400/25">
                  <div className="absolute inset-2 rounded-full bg-black/20"></div>
                  <span className="text-white font-bold text-sm relative z-10">{timeInRange}%</span>
                </div>
              </div>
            </div>

            {/* Enhanced Mini Glucose Chart with Glow */}
            <div className="h-24 flex items-end space-x-1 mb-4 bg-slate-800/30 rounded-2xl p-3 border border-slate-700/30">
              {[...Array(24)].map((_, i) => {
                const height = 20 + Math.random() * 60;
                const isRecent = i >= 20;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm transition-all duration-500 ${
                      isRecent 
                        ? `bg-gradient-to-t ${getGlucoseColor(glucoseStatus)} shadow-lg`
                        : 'bg-gradient-to-t from-slate-600 to-slate-500 opacity-40'
                    }`}
                    style={{ 
                      height: `${height}%`,
                      filter: isRecent ? `drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))` : 'none'
                    }}
                  ></div>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Avg</p>
                  <p className="font-semibold text-white">148</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">TIR</p>
                  <p className="font-semibold text-green-400">{timeInRange}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">CV</p>
                  <p className="font-semibold text-cyan-400">15%</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-200">
                Log Reading
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* A1C Progress Story - Dark Mode Enhanced */}
      <div className="px-6 mb-8">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-black/25">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">A1C Journey</h3>
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-slate-700 relative">
                <div className="absolute inset-0 rounded-full">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="url(#a1cGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${((7.5 - a1c) / 1.5) * 283} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 drop-shadow-lg"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.6))' }}
                    />
                    <defs>
                      <linearGradient id="a1cGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{a1c}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Target: 6.5%</span>
                <span className="text-sm font-medium text-green-400">So close! ✨</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full transition-all duration-1000 shadow-lg"
                  style={{ 
                    width: `${((7.5 - a1c) / 1.0) * 100}%`,
                    filter: 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.6))'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">🎯 Estimated achievement: 2 weeks</p>
            </div>
          </div>
        </div>
      </div>

      {/* GlucoBalance™ Showcase - Premium Dark */}
      <div className="px-6 mb-8">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-black/25">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">GlucoBalance™</h3>
            <div className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs rounded-full font-medium shadow-lg shadow-cyan-500/25">
              <Cpu className="w-3 h-3 inline mr-1" />
              AI Powered
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-cyan-400/20"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-green-400/30">
                  <span className="text-white font-bold text-lg">9.2</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                <span className="text-white text-xs font-bold">A+</span>
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Avocado Toast + Eggs</h4>
              <p className="text-sm text-gray-400 mb-2">Optimized for your evening dose</p>
              <div className="flex space-x-2">
                <div className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded-full border border-green-400/30">Perfect Timing</div>
                <div className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded-full border border-cyan-400/30">Low GL</div>
              </div>
            </div>
            
            <button className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-200">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Achievement Gallery - Dark Premium */}
      <div className="px-6 mb-8">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-xl shadow-black/25">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">VictoryTrack™</h3>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          
          <div className="flex items-center space-x-6 mb-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-2 relative shadow-lg shadow-orange-500/30">
                <span className="text-2xl animate-pulse">🔥</span>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <span className="text-white text-xs font-bold">{streak}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Day Streak</p>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Level 5 Progress</span>
                <span className="text-sm font-medium text-cyan-400">380/400 XP</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-1000 shadow-lg"
                  style={{ 
                    width: '95%',
                    filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))'
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">✨ 20 XP to unlock Diabetes Ninja badge</p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '🎯', name: 'Perfect Week', earned: true, glow: 'shadow-amber-500/30' },
              { icon: '💎', name: 'Diamond TIR', earned: true, glow: 'shadow-cyan-500/30' },
              { icon: '🧠', name: 'Data Wizard', earned: true, glow: 'shadow-purple-500/30' },
              { icon: '🥷', name: 'Ninja', earned: false, glow: '' }
            ].map((achievement, i) => (
              <div key={i} className={`text-center p-3 rounded-2xl transition-all duration-300 ${
                achievement.earned 
                  ? `bg-gradient-to-br from-slate-700/50 to-slate-800/30 border border-slate-600/50 shadow-lg ${achievement.glow}` 
                  : 'bg-slate-800/30 border border-slate-700/30'
              }`}>
                <div className={`text-2xl mb-1 ${achievement.earned ? 'animate-pulse' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <p className={`text-xs ${achievement.earned ? 'text-white font-medium' : 'text-gray-500'}`}>
                  {achievement.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Quick Actions - Dark Mode */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/25 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-200">
            <Brain className="w-6 h-6 mb-2" />
            <p className="font-medium">Insulin Calculator</p>
            <p className="text-xs opacity-80">Smart dosing ready</p>
          </button>
          <button className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/25 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-200">
            <Activity className="w-6 h-6 mb-2" />
            <p className="font-medium">Log Activity</p>
            <p className="text-xs opacity-80">Track workout</p>
          </button>
        </div>
      </div>

      {/* Floating Navigation - Dark Premium */}
      <div className="fixed bottom-6 left-6 right-6">
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/50 p-2">
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
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                  : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
              }`}>
                <div className="relative">
                  <tab.icon className="w-5 h-5" />
                  {tab.notification && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
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

export default MidnightDashboard;