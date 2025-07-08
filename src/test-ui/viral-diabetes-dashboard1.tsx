import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Minus, Target, Award, Zap, Brain, Calculator, Heart, Activity, Sun, Moon, Droplet, Syringe, Sparkles, Trophy, Star, ChevronRight, Plus } from 'lucide-react';

const ViralDiabetesDashboard = () => {
  const [currentTheme, setCurrentTheme] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentGlucose, setCurrentGlucose] = useState(145);
  const [selectedTab, setSelectedTab] = useState('today');

  // Theme configurations with distinct visual identities
  const themes = [
    {
      name: "Aurora",
      light: {
        primary: "from-violet-600 to-purple-600",
        secondary: "from-pink-500 to-rose-500",
        accent: "from-cyan-400 to-blue-500",
        bg: "bg-gradient-to-br from-violet-50 via-white to-pink-50",
        cardBg: "bg-white/70 backdrop-blur-xl",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        border: "border-white/20"
      },
      dark: {
        primary: "from-violet-500 to-purple-500",
        secondary: "from-pink-400 to-rose-400",
        accent: "from-cyan-300 to-blue-400",
        bg: "bg-gradient-to-br from-gray-900 via-violet-900/20 to-purple-900/20",
        cardBg: "bg-gray-800/70 backdrop-blur-xl",
        text: "text-white",
        textSecondary: "text-gray-300",
        border: "border-gray-700/30"
      }
    },
    {
      name: "Ocean",
      light: {
        primary: "from-blue-600 to-indigo-600",
        secondary: "from-teal-500 to-emerald-500",
        accent: "from-orange-400 to-amber-500",
        bg: "bg-gradient-to-br from-blue-50 via-white to-teal-50",
        cardBg: "bg-white/80 backdrop-blur-xl",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        border: "border-white/30"
      },
      dark: {
        primary: "from-blue-500 to-indigo-500",
        secondary: "from-teal-400 to-emerald-400",
        accent: "from-orange-300 to-amber-400",
        bg: "bg-gradient-to-br from-gray-900 via-blue-900/20 to-teal-900/20",
        cardBg: "bg-gray-800/80 backdrop-blur-xl",
        text: "text-white",
        textSecondary: "text-gray-300",
        border: "border-gray-700/40"
      }
    },
    {
      name: "Forest",
      light: {
        primary: "from-emerald-600 to-green-600",
        secondary: "from-lime-500 to-green-500",
        accent: "from-yellow-400 to-orange-500",
        bg: "bg-gradient-to-br from-emerald-50 via-white to-lime-50",
        cardBg: "bg-white/75 backdrop-blur-xl",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        border: "border-white/25"
      },
      dark: {
        primary: "from-emerald-500 to-green-500",
        secondary: "from-lime-400 to-green-400",
        accent: "from-yellow-300 to-orange-400",
        bg: "bg-gradient-to-br from-gray-900 via-emerald-900/20 to-green-900/20",
        cardBg: "bg-gray-800/75 backdrop-blur-xl",
        text: "text-white",
        textSecondary: "text-gray-300",
        border: "border-gray-700/35"
      }
    },
    {
      name: "Sunset",
      light: {
        primary: "from-orange-600 to-red-600",
        secondary: "from-pink-500 to-orange-500",
        accent: "from-purple-400 to-pink-500",
        bg: "bg-gradient-to-br from-orange-50 via-white to-pink-50",
        cardBg: "bg-white/65 backdrop-blur-xl",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        border: "border-white/20"
      },
      dark: {
        primary: "from-orange-500 to-red-500",
        secondary: "from-pink-400 to-orange-400",
        accent: "from-purple-300 to-pink-400",
        bg: "bg-gradient-to-br from-gray-900 via-orange-900/20 to-red-900/20",
        cardBg: "bg-gray-800/65 backdrop-blur-xl",
        text: "text-white",
        textSecondary: "text-gray-300",
        border: "border-gray-700/25"
      }
    },
    {
      name: "Midnight",
      light: {
        primary: "from-slate-600 to-gray-600",
        secondary: "from-blue-500 to-indigo-500",
        accent: "from-violet-400 to-purple-500",
        bg: "bg-gradient-to-br from-slate-50 via-white to-blue-50",
        cardBg: "bg-white/85 backdrop-blur-xl",
        text: "text-gray-900",
        textSecondary: "text-gray-600",
        border: "border-white/35"
      },
      dark: {
        primary: "from-slate-500 to-gray-500",
        secondary: "from-blue-400 to-indigo-400",
        accent: "from-violet-300 to-purple-400",
        bg: "bg-gradient-to-br from-black via-slate-900/30 to-blue-900/20",
        cardBg: "bg-gray-900/85 backdrop-blur-xl",
        text: "text-white",
        textSecondary: "text-gray-300",
        border: "border-gray-600/35"
      }
    }
  ];

  const currentColors = themes[currentTheme][isDarkMode ? 'dark' : 'light'];

  // Simulate glucose trend data
  const glucoseTrend = [
    { time: '6:00', value: 120 },
    { time: '8:00', value: 165 },
    { time: '10:00', value: 140 },
    { time: '12:00', value: 180 },
    { time: '14:00', value: 155 },
    { time: '16:00', value: currentGlucose },
  ];

  const getGlucoseStatus = (value) => {
    if (value < 70) return { status: 'Low', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (value > 180) return { status: 'High', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { status: 'In Range', color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  const glucoseStatus = getGlucoseStatus(currentGlucose);

  // Navigation Component
  const Navigation = () => (
    <div className={`fixed bottom-6 left-6 right-6 ${currentColors.cardBg} ${currentColors.border} border rounded-2xl p-2 shadow-xl z-50`}>
      <div className="flex justify-around items-center">
        {[
          { id: 'today', icon: Activity, label: 'Today', badge: true },
          { id: 'glucose', icon: Droplet, label: 'Glucose' },
          { id: 'insulin', icon: Syringe, label: 'Insulin' },
          { id: 'insights', icon: Brain, label: 'AI Insights', badge: true },
          { id: 'progress', icon: Trophy, label: 'Progress' }
        ].map(({ id, icon: Icon, label, badge }) => (
          <button
            key={id}
            onClick={() => setSelectedTab(id)}
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
              selectedTab === id 
                ? `bg-gradient-to-r ${currentColors.primary} text-white shadow-lg transform scale-105` 
                : `${currentColors.text} hover:bg-gray-100/50 ${isDarkMode ? 'hover:bg-white/10' : ''}`
            }`}
          >
            <Icon size={20} className={selectedTab === id ? 'text-white' : ''} />
            <span className={`text-xs mt-1 ${selectedTab === id ? 'text-white font-medium' : currentColors.textSecondary}`}>
              {label}
            </span>
            {badge && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r ${currentColors.secondary} rounded-full animate-pulse`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Glucose Hero Component
  const GlucoseHero = () => (
    <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${currentColors.primary} opacity-5`} />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-lg font-semibold ${currentColors.text}`}>Current Glucose</h2>
          <p className={`${currentColors.textSecondary} text-sm`}>Last updated 2 min ago</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${glucoseStatus.bg} ${glucoseStatus.color} text-sm font-medium`}>
          {glucoseStatus.status}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`text-5xl font-bold bg-gradient-to-r ${currentColors.primary} bg-clip-text text-transparent`}>
          {currentGlucose}
        </div>
        <div className="flex flex-col">
          <span className={`${currentColors.textSecondary} text-sm`}>mg/dL</span>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-green-500 text-sm font-medium">+5</span>
          </div>
        </div>
      </div>

      {/* Mini trend chart */}
      <div className="flex items-end gap-2 h-12 mb-4">
        {glucoseTrend.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full bg-gradient-to-t ${currentColors.primary} rounded-t opacity-70`}
              style={{ height: `${(point.value / 200) * 100}%` }}
            />
            <span className={`text-xs ${currentColors.textSecondary} mt-1`}>
              {point.time.split(':')[0]}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className={`text-lg font-semibold ${currentColors.text}`}>87%</div>
          <div className={`text-xs ${currentColors.textSecondary}`}>Time in Range</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${currentColors.text}`}>6.8%</div>
          <div className={`text-xs ${currentColors.textSecondary}`}>Est. A1C</div>
        </div>
        <div className="text-center">
          <div className={`text-lg font-semibold ${currentColors.text}`}>24</div>
          <div className={`text-xs ${currentColors.textSecondary}`}>CV</div>
        </div>
      </div>
    </div>
  );

  // A1C Progress Component
  const A1CProgress = () => (
    <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-3xl p-6 mb-6 shadow-xl`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-semibold ${currentColors.text}`}>A1C Progress</h3>
        <span className={`text-sm ${currentColors.textSecondary}`}>Target: &lt;7.0%</span>
      </div>
      
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className={`${currentColors.textSecondary} opacity-20`}
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#a1cGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(6.8 / 10) * 251} 251`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${currentColors.text}`}>6.8%</span>
          </div>
          <defs>
            <linearGradient id="a1cGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-green-500">↓ 0.3%</div>
            <span className={`text-sm ${currentColors.textSecondary}`}>from last quarter</span>
          </div>
          <div className={`text-sm ${currentColors.textSecondary}`}>
            On track to reach &lt;7.0% by March 2025
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {[
          { label: 'Glucose Control', value: 85, color: 'bg-green-500' },
          { label: 'Exercise', value: 72, color: 'bg-blue-500' },
          { label: 'Medication', value: 95, color: 'bg-purple-500' }
        ].map((factor, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className={`text-sm ${currentColors.textSecondary} w-24`}>{factor.label}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 ${factor.color} rounded-full transition-all duration-1000`}
                style={{ width: `${factor.value}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${currentColors.text} w-8`}>{factor.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  // GlucoBalance Score Component
  const GlucoBalanceScore = () => (
    <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentColors.accent} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-lg font-semibold ${currentColors.text}`}>GlucoBalance™</h3>
          <p className={`text-sm ${currentColors.textSecondary}`}>AI-Powered Food Scoring</p>
        </div>
        <Sparkles className={`text-yellow-500`} size={24} />
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className={`${currentColors.textSecondary} opacity-20`}
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              stroke="url(#glucoGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${(8.5 / 10) * 201} 201`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold bg-gradient-to-r ${currentColors.primary} bg-clip-text text-transparent`}>8.5</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className={`font-medium ${currentColors.text} mb-1`}>Grilled Salmon & Vegetables</h4>
          <p className={`text-sm ${currentColors.textSecondary} mb-2`}>Excellent glucose impact</p>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-600 text-xs rounded-full">Low GI</span>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-600 text-xs rounded-full">High Protein</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className={`text-sm font-medium ${currentColors.text}`}>+15mg/dL</div>
          <div className={`text-xs ${currentColors.textSecondary}`}>Est. Impact</div>
        </div>
        <div>
          <div className={`text-sm font-medium ${currentColors.text}`}>2.5hr</div>
          <div className={`text-xs ${currentColors.textSecondary}`}>Peak Time</div>
        </div>
        <div>
          <div className={`text-sm font-medium ${currentColors.text}`}>A+</div>
          <div className={`text-xs ${currentColors.textSecondary}`}>Nutrition</div>
        </div>
      </div>

      <defs>
        <linearGradient id="glucoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
    </div>
  );

  // Insulin Calculator Component
  const InsulinCalculator = () => (
    <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-3xl p-6 mb-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${currentColors.text}`}>Smart Insulin Calculator</h3>
        <Calculator className={`${currentColors.textSecondary}`} size={20} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className={`text-sm ${currentColors.textSecondary} mb-1`}>Current BG</div>
          <div className={`text-xl font-bold ${currentColors.text}`}>{currentGlucose} mg/dL</div>
        </div>
        <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className={`text-sm ${currentColors.textSecondary} mb-1`}>Target BG</div>
          <div className={`text-xl font-bold ${currentColors.text}`}>120 mg/dL</div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className={`text-sm ${currentColors.textSecondary} block mb-2`}>Carbs (g)</label>
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'} ${currentColors.text}`}>
              <Minus size={16} />
            </button>
            <span className={`text-lg font-semibold ${currentColors.text} min-w-12 text-center`}>45</span>
            <button className={`p-2 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'} ${currentColors.text}`}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentColors.primary} text-white mb-4`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-90">Recommended Dose</div>
            <div className="text-2xl font-bold">4.2 units</div>
          </div>
          <Syringe size={24} />
        </div>
      </div>

      <div className="text-center">
        <button className={`px-6 py-3 bg-gradient-to-r ${currentColors.secondary} text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300`}>
          Log Insulin Dose
        </button>
      </div>
    </div>
  );

  // AI Insights Component
  const AIInsights = () => (
    <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-3xl p-6 mb-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${currentColors.text}`}>AI Health Insights</h3>
        <div className="flex items-center gap-2">
          <Brain className="text-purple-500" size={20} />
          <span className="px-2 py-1 bg-purple-500/20 text-purple-600 text-xs rounded-full">New</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-r from-blue-50 to-purple-50'} border border-blue-200/30`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${currentColors.text} mb-1`}>Pattern Detected</h4>
              <p className={`text-sm ${currentColors.textSecondary} mb-3`}>
                Your glucose tends to spike 30% higher after pasta meals. Consider pairing with protein.
              </p>
              <button className="text-blue-500 text-sm font-medium hover:underline">
                View recommendations →
              </button>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20' : 'bg-gradient-to-r from-green-50 to-emerald-50'} border border-green-200/30`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Target size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${currentColors.text} mb-1`}>Goal Achievement</h4>
              <p className={`text-sm ${currentColors.textSecondary} mb-3`}>
                Great progress! You're 3 days away from your longest time-in-range streak.
              </p>
              <button className="text-green-500 text-sm font-medium hover:underline">
                View streak →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Achievement System Component
  const AchievementSystem = () => (
    <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-3xl p-6 mb-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${currentColors.text}`}>Achievements</h3>
        <Trophy className="text-yellow-500" size={20} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentColors.secondary} flex items-center justify-center`}>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">7</span>
          </div>
        </div>
        <div>
          <h4 className={`font-semibold ${currentColors.text}`}>7-Day Streak!</h4>
          <p className={`text-sm ${currentColors.textSecondary}`}>Glucose in range daily</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '🎯', name: 'Bullseye', unlocked: true },
          { emoji: '⭐', name: 'Superstar', unlocked: true },
          { emoji: '💎', name: 'Diamond', unlocked: false },
        ].map((achievement, index) => (
          <div key={index} className={`p-3 rounded-2xl text-center ${achievement.unlocked ? `bg-gradient-to-br ${currentColors.accent} text-white` : `${isDarkMode ? 'bg-white/5' : 'bg-gray-100'} ${currentColors.textSecondary}`}`}>
            <div className="text-2xl mb-1">{achievement.emoji}</div>
            <div className="text-xs font-medium">{achievement.name}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Quick Actions Component
  const QuickActions = () => (
    <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-3xl p-6 mb-24 shadow-xl`}>
      <h3 className={`text-lg font-semibold ${currentColors.text} mb-4`}>Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Droplet, label: 'Log Glucose', color: currentColors.primary },
          { icon: Syringe, label: 'Log Insulin', color: currentColors.secondary },
          { icon: Heart, label: 'Log Food', color: currentColors.accent },
          { icon: Activity, label: 'Log Exercise', color: currentColors.primary }
        ].map((action, index) => (
          <button key={index} className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transition-all duration-300 hover:scale-105`}>
            <action.icon size={20} className="mb-2" />
            <div className="text-sm font-medium">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${currentColors.bg} transition-all duration-500`}>
      {/* Theme and Mode Controls */}
      <div className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center">
        <div className={`${currentColors.cardBg} ${currentColors.border} border rounded-2xl p-2 shadow-xl`}>
          <select 
            value={currentTheme} 
            onChange={(e) => setCurrentTheme(Number(e.target.value))}
            className={`bg-transparent ${currentColors.text} text-sm px-3 py-1 rounded-xl outline-none`}
          >
            {themes.map((theme, index) => (
              <option key={index} value={index} className="bg-white dark:bg-gray-800">
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`${currentColors.cardBg} ${currentColors.border} border rounded-2xl p-3 shadow-xl hover:scale-105 transition-all duration-300`}
        >
          {isDarkMode ? <Sun className="text-yellow-500" size={20} /> : <Moon className={`${currentColors.text}`} size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold ${currentColors.text} mb-2`}>
              Good afternoon, Sarah
            </h1>
            <p className={`${currentColors.textSecondary}`}>
              Your glucose is looking great today! 
            </p>
          </div>

          {/* Dynamic Component Rendering Based on Theme */}
          {currentTheme === 0 && (
            <>
              <GlucoseHero />
              <A1CProgress />
              <GlucoBalanceScore />
              <AIInsights />
              <AchievementSystem />
              <QuickActions />
            </>
          )}
          
          {currentTheme === 1 && (
            <>
              <GlucoseHero />
              <InsulinCalculator />
              <A1CProgress />
              <AIInsights />
              <GlucoBalanceScore />
              <QuickActions />
            </>
          )}
          
          {currentTheme === 2 && (
            <>
              <GlucoBalanceScore />
              <GlucoseHero />
              <AchievementSystem />
              <InsulinCalculator />
              <AIInsights />
              <QuickActions />
            </>
          )}
          
          {currentTheme === 3 && (
            <>
              <AchievementSystem />
              <GlucoseHero />
              <AIInsights />
              <A1CProgress />
              <InsulinCalculator />
              <QuickActions />
            </>
          )}
          
          {currentTheme === 4 && (
            <>
              <AIInsights />
              <GlucoseHero />
              <GlucoBalanceScore />
              <AchievementSystem />
              <A1CProgress />
              <QuickActions />
            </>
          )}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default ViralDiabetesDashboard;