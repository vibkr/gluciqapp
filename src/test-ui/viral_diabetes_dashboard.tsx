import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Droplet, Activity, Target, TrendingUp, Trophy, 
  Zap, Star, Award, Heart, ArrowUp, ArrowDown, Minus,
  Shield, Gamepad2, Crown, Sparkles, Calculator, Brain,
  Bell, Settings, Users, Calendar, Apple, Clock, Flame,
  ChevronRight, Plus, Eye, Coffee, Utensils
} from 'lucide-react';

const ViralDiabetesDashboard = () => {
  const [currentTheme, setCurrentTheme] = useState('midnight');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [currentGlucose, setCurrentGlucose] = useState(125);
  const [timeInRange, setTimeInRange] = useState(89);
  const [currentStreak, setCurrentStreak] = useState(23);
  const [a1cValue, setA1cValue] = useState(6.4);
  const [glucoBalance, setGlucoBalance] = useState(92);
  const [playerLevel, setPlayerLevel] = useState(12);
  const [xp, setXp] = useState(2340);
  const [xpToNext, setXpToNext] = useState(2500);

  // 8 Premium Theme System
  const themes = {
    midnight: {
      name: 'Midnight Pro',
      bg: isDarkMode ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50',
      cardBg: isDarkMode ? 'bg-slate-800/60 backdrop-blur-xl border-slate-600/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border-purple-400/30' : 'bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-xl border-indigo-200/50',
      primary: isDarkMode ? 'from-indigo-500 to-purple-600' : 'from-indigo-600 to-purple-600',
      secondary: isDarkMode ? 'from-purple-500 to-pink-600' : 'from-purple-600 to-pink-600',
      accent: isDarkMode ? 'from-cyan-400 to-blue-500' : 'from-cyan-500 to-blue-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500'
    },
    aurora: {
      name: 'Aurora Dreams',
      bg: isDarkMode ? 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      cardBg: isDarkMode ? 'bg-emerald-800/60 backdrop-blur-xl border-emerald-600/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-emerald-900/80 to-teal-900/80 backdrop-blur-xl border-emerald-400/30' : 'bg-gradient-to-br from-white/90 to-emerald-50/90 backdrop-blur-xl border-emerald-200/50',
      primary: isDarkMode ? 'from-emerald-500 to-teal-600' : 'from-emerald-600 to-teal-600',
      secondary: isDarkMode ? 'from-teal-500 to-cyan-600' : 'from-teal-600 to-cyan-600',
      accent: isDarkMode ? 'from-green-400 to-emerald-500' : 'from-green-500 to-emerald-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-emerald-200' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-emerald-300' : 'text-slate-500'
    },
    sunset: {
      name: 'Sunset Blaze',
      bg: isDarkMode ? 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900' : 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50',
      cardBg: isDarkMode ? 'bg-red-800/60 backdrop-blur-xl border-red-600/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-orange-900/80 to-red-900/80 backdrop-blur-xl border-orange-400/30' : 'bg-gradient-to-br from-white/90 to-orange-50/90 backdrop-blur-xl border-orange-200/50',
      primary: isDarkMode ? 'from-orange-500 to-red-600' : 'from-orange-600 to-red-600',
      secondary: isDarkMode ? 'from-red-500 to-pink-600' : 'from-red-600 to-pink-600',
      accent: isDarkMode ? 'from-yellow-400 to-orange-500' : 'from-yellow-500 to-orange-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-orange-200' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-orange-300' : 'text-slate-500'
    },
    ocean: {
      name: 'Ocean Depths',
      bg: isDarkMode ? 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
      cardBg: isDarkMode ? 'bg-blue-800/60 backdrop-blur-xl border-blue-600/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-blue-900/80 to-cyan-900/80 backdrop-blur-xl border-cyan-400/30' : 'bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-xl border-blue-200/50',
      primary: isDarkMode ? 'from-blue-500 to-cyan-600' : 'from-blue-600 to-cyan-600',
      secondary: isDarkMode ? 'from-cyan-500 to-teal-600' : 'from-cyan-600 to-teal-600',
      accent: isDarkMode ? 'from-sky-400 to-blue-500' : 'from-sky-500 to-blue-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-blue-200' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-blue-300' : 'text-slate-500'
    },
    neon: {
      name: 'Neon Cyber',
      bg: isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-violet-50',
      cardBg: isDarkMode ? 'bg-gray-800/60 backdrop-blur-xl border-purple-500/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-gray-900/80 to-purple-900/80 backdrop-blur-xl border-violet-400/30' : 'bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-xl border-purple-200/50',
      primary: isDarkMode ? 'from-purple-500 to-violet-600' : 'from-purple-600 to-violet-600',
      secondary: isDarkMode ? 'from-violet-500 to-fuchsia-600' : 'from-violet-600 to-fuchsia-600',
      accent: isDarkMode ? 'from-pink-400 to-purple-500' : 'from-pink-500 to-purple-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-purple-200' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-purple-300' : 'text-slate-500'
    },
    forest: {
      name: 'Forest Sage',
      bg: isDarkMode ? 'bg-gradient-to-br from-green-900 via-lime-900 to-emerald-900' : 'bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50',
      cardBg: isDarkMode ? 'bg-green-800/60 backdrop-blur-xl border-green-600/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-green-900/80 to-emerald-900/80 backdrop-blur-xl border-lime-400/30' : 'bg-gradient-to-br from-white/90 to-green-50/90 backdrop-blur-xl border-green-200/50',
      primary: isDarkMode ? 'from-green-500 to-lime-600' : 'from-green-600 to-lime-600',
      secondary: isDarkMode ? 'from-lime-500 to-emerald-600' : 'from-lime-600 to-emerald-600',
      accent: isDarkMode ? 'from-yellow-400 to-green-500' : 'from-yellow-500 to-green-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-green-200' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-green-300' : 'text-slate-500'
    },
    rose: {
      name: 'Rose Gold',
      bg: isDarkMode ? 'bg-gradient-to-br from-pink-900 via-rose-900 to-red-900' : 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50',
      cardBg: isDarkMode ? 'bg-rose-800/60 backdrop-blur-xl border-rose-600/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-pink-900/80 to-rose-900/80 backdrop-blur-xl border-pink-400/30' : 'bg-gradient-to-br from-white/90 to-pink-50/90 backdrop-blur-xl border-pink-200/50',
      primary: isDarkMode ? 'from-pink-500 to-rose-600' : 'from-pink-600 to-rose-600',
      secondary: isDarkMode ? 'from-rose-500 to-red-600' : 'from-rose-600 to-red-600',
      accent: isDarkMode ? 'from-amber-400 to-pink-500' : 'from-amber-500 to-pink-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-pink-200' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-pink-300' : 'text-slate-500'
    },
    cosmic: {
      name: 'Cosmic Void',
      bg: isDarkMode ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50',
      cardBg: isDarkMode ? 'bg-indigo-800/60 backdrop-blur-xl border-indigo-500/40' : 'bg-white/80 backdrop-blur-xl border-white/60',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-xl border-purple-400/30' : 'bg-gradient-to-br from-white/90 to-indigo-50/90 backdrop-blur-xl border-indigo-200/50',
      primary: isDarkMode ? 'from-indigo-500 to-purple-600' : 'from-indigo-600 to-purple-600',
      secondary: isDarkMode ? 'from-purple-500 to-violet-600' : 'from-purple-600 to-violet-600',
      accent: isDarkMode ? 'from-blue-400 to-indigo-500' : 'from-blue-500 to-indigo-600',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-indigo-200' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-indigo-300' : 'text-slate-500'
    }
  };

  const theme = themes[currentTheme];

  // Floating animation component
  const FloatingElement = ({ children, delay = 0, className = "" }) => (
    <div 
      className={`animate-float ${className}`}
      style={{animationDelay: `${delay}s`}}
    >
      {children}
    </div>
  );

  // Pulsing orb component
  const PulsingOrb = ({ size = "w-3 h-3", color = "bg-purple-400", delay = 0, className = "" }) => (
    <div 
      className={`${size} ${color} rounded-full animate-ping opacity-40 ${className}`}
      style={{animationDelay: `${delay}s`}}
    />
  );

  // XP Progress Bar with animations
  const XPProgressBar = ({ current, max, level }) => {
    const percentage = (current / max) * 100;
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className={`font-bold ${theme.text}`}>Level {level}</span>
            <span className={`text-sm px-2 py-1 rounded-full bg-gradient-to-r ${theme.accent} text-white font-bold`}>
              Legendary
            </span>
          </div>
          <span className={`text-sm ${theme.textMuted}`}>{current}/{max} XP</span>
        </div>
        <div className="relative h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${theme.primary} rounded-full transition-all duration-1000 ease-out relative`}
            style={{width: `${percentage}%`}}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    );
  };

  // Quest/Achievement Card
  const QuestCard = ({ title, description, reward, completed = false, progress = 100 }) => (
    <div className={`${theme.cardBg} border rounded-2xl p-4 relative overflow-hidden transition-all duration-300 hover:scale-105`}>
      {completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 animate-pulse" />
      )}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-xl ${completed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : `bg-gradient-to-br ${theme.primary}`}`}>
            {completed ? <Trophy className="w-5 h-5 text-white" /> : <Target className="w-5 h-5 text-white" />}
          </div>
          {completed && (
            <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
              <span className="text-green-400 text-xs font-bold">COMPLETE</span>
            </div>
          )}
        </div>
        <h4 className={`font-bold ${theme.text} mb-1`}>{title}</h4>
        <p className={`text-sm ${theme.textMuted} mb-3`}>{description}</p>
        {!completed && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className={theme.textMuted}>Progress</span>
              <span className={theme.textMuted}>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${theme.secondary} transition-all duration-500`}
                style={{width: `${progress}%`}}
              />
            </div>
          </div>
        )}
        <div className={`text-sm font-bold bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>
          {reward}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme.bg} relative overflow-hidden`}>
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <PulsingOrb size="w-2 h-2" color="bg-purple-400" delay={0} className="absolute top-20 left-10" />
        <PulsingOrb size="w-3 h-3" color="bg-pink-400" delay={1} className="absolute top-40 right-20" />
        <PulsingOrb size="w-2 h-2" color="bg-blue-400" delay={2} className="absolute bottom-40 left-20" />
        <PulsingOrb size="w-4 h-4" color="bg-yellow-400" delay={3} className="absolute bottom-20 right-10" />
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6 relative z-10">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pt-8 pb-4">
          <div className="flex items-center space-x-3">
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              className={`${theme.cardBg} ${theme.text} border rounded-xl px-3 py-2 text-sm font-medium backdrop-blur-lg`}
            >
              {Object.entries(themes).map(([key, t]) => (
                <option key={key} value={key} className="bg-gray-800 text-white">{t.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            <FloatingElement delay={0}>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-3 rounded-xl ${theme.cardBg} border backdrop-blur-lg hover:scale-110 transition-all duration-300`}
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className={theme.textMuted} />}
              </button>
            </FloatingElement>
            <FloatingElement delay={0.2}>
              <button className={`p-3 rounded-xl ${theme.cardBg} border backdrop-blur-lg hover:scale-110 transition-all duration-300 relative`}>
                <Bell size={20} className={theme.text} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </FloatingElement>
          </div>
        </div>

        {/* Player Progress Header */}
        <div className={`${theme.cardHero} border rounded-3xl p-6 shadow-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                Health Champion Jordan
              </h1>
              <p className={`${theme.textSecondary} flex items-center space-x-2`}>
                <Shield className="w-4 h-4" />
                <span>Legendary Glucose Guardian</span>
              </p>
            </div>
            <FloatingElement delay={0.5}>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.primary} flex items-center justify-center text-white font-bold text-lg border-4 border-white/20`}>
                {playerLevel}
              </div>
            </FloatingElement>
          </div>
          <XPProgressBar current={xp} max={xpToNext} level={playerLevel} />
        </div>

        {/* Quest Complete Notification */}
        <div className={`${theme.cardBg} border rounded-2xl p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className={`font-bold ${theme.text}`}>Quest Complete!</h4>
                <p className={`text-sm ${theme.textMuted}`}>14-day streak achievement unlocked</p>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-sm">
              +250 XP
            </div>
          </div>
        </div>

        {/* Hero Glucose Monitor */}
        <div className={`${theme.cardHero} border rounded-3xl p-6 shadow-2xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.primary} animate-pulse`}>
                  <Droplet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${theme.text}`}>Glucose Status</h3>
                  <p className={`text-sm ${theme.textMuted}`}>Last updated 2 min ago</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                <span className="text-green-400 text-sm font-bold">IN RANGE</span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className={`text-6xl font-black bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                  {currentGlucose}
                </div>
                <div className={`text-lg ${theme.textMuted} font-medium`}>mg/dL</div>
                <div className="absolute -top-2 -right-8">
                  <TrendingUp className="w-6 h-6 text-green-400 animate-bounce" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.text}`}>{timeInRange}%</div>
                  <div className={`text-xs ${theme.textMuted}`}>Time in Range</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.text}`}>135</div>
                  <div className={`text-xs ${theme.textMuted}`}>Avg Glucose</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${theme.text}`}>12%</div>
                  <div className={`text-xs ${theme.textMuted}`}>Variability</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GlucoBalance AI Card */}
        <div className={`${theme.cardBg} border rounded-3xl p-6 shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-lg font-bold ${theme.text} flex items-center space-x-2`}>
                <Brain className="w-5 h-5" />
                <span>GlucoBalance™</span>
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                  <span className="text-blue-400 text-xs font-bold">AI Powered</span>
                </div>
              </div>
            </div>
            <FloatingElement delay={1}>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.secondary} flex items-center justify-center text-white font-bold text-lg relative`}>
                {glucoBalance}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">A+</span>
                </div>
              </div>
            </FloatingElement>
          </div>

          <div className={`${theme.cardBg} border rounded-2xl p-4 mb-4`}>
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🥑</div>
              <div className="flex-1">
                <h4 className={`font-bold ${theme.text}`}>Avocado Toast + Eggs</h4>
                <p className={`text-sm ${theme.textMuted}`}>Optimized for your evening dose</p>
                <div className="flex space-x-2 mt-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Perfect Timing</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">Low GL</span>
                </div>
              </div>
              <button className={`p-2 rounded-xl bg-gradient-to-br ${theme.accent} text-white hover:scale-110 transition-transform`}>
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Daily Quests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-xl font-bold ${theme.text} flex items-center space-x-2`}>
              <Gamepad2 className="w-5 h-5" />
              <span>Daily Quests</span>
            </h3>
            <span className={`text-sm ${theme.textMuted} px-3 py-1 rounded-full ${theme.cardBg} border`}>
              3/4 Complete
            </span>
          </div>

          <div className="space-y-3">
            <QuestCard
              title="Hydration Hero"
              description="Drink 8 glasses of water"
              reward="+50 XP"
              completed={true}
            />
            <QuestCard
              title="Glucose Guardian"
              description="Stay in range for 4+ hours"
              reward="+75 XP"
              completed={true}
            />
            <QuestCard
              title="Exercise Champion"
              description="Complete 30 min activity"
              reward="+100 XP"
              progress={65}
            />
          </div>
        </div>

        {/* VictoryTrack Progress */}
        <div className={`${theme.cardBg} border rounded-3xl p-6 shadow-xl`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-lg font-bold ${theme.text} flex items-center space-x-2`}>
                <Trophy className="w-5 h-5" />
                <span>VictoryTrack™</span>
              </h3>
            </div>
            <div className="text-2xl">🏆</div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <FloatingElement delay={0.3}>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${theme.accent} flex items-center justify-center relative`}>
                <Flame className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {currentStreak}
                </div>
              </div>
            </FloatingElement>
            <div className="flex-1">
              <div className={`font-bold ${theme.text}`}>Level 5 Progress</div>
              <div className={`text-sm ${theme.textMuted}`}>Day Streak</div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className={theme.textMuted}>380/400 XP</span>
                  <span className={theme.textMuted}>95%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${theme.primary} transition-all duration-500`} style={{width: '95%'}} />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className={`text-sm ${theme.textMuted} flex items-center justify-center space-x-1`}>
              <Sparkles className="w-4 h-4" />
              <span>20 XP to unlock Diabetes Ninja badge</span>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Target, name: 'Perfect Week', unlocked: true },
              { icon: Award, name: 'Diamond TIR', unlocked: true },
              { icon: Brain, name: 'Data Wizard', unlocked: true },
              { icon: Gamepad2, name: 'Ninja', unlocked: false }
            ].map((badge, i) => (
              <div 
                key={i}
                className={`aspect-square rounded-2xl border p-3 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 ${
                  badge.unlocked 
                    ? `${theme.cardBg} border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-orange-400/10` 
                    : `${theme.cardBg} opacity-50`
                }`}
              >
                <badge.icon size={20} className={badge.unlocked ? 'text-yellow-400' : theme.textMuted} />
                <span className={`text-xs font-medium mt-1 ${badge.unlocked ? theme.text : theme.textMuted}`}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className={`${theme.cardBg} border backdrop-blur-xl rounded-3xl shadow-2xl p-2 max-w-md mx-auto`}>
            <div className="flex justify-around">
              {[
                { id: 'today', icon: Activity, label: 'Today', badge: '3' },
                { id: 'glucose', icon: Droplet, label: 'Glucose' },
                { id: 'insulin', icon: Zap, label: 'Insulin' },
                { id: 'insights', icon: Brain, label: 'Insights', badge: '2' },
                { id: 'progress', icon: Trophy, label: 'Progress' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 transform relative ${
                    activeTab === tab.id 
                      ? `bg-gradient-to-t ${theme.primary} shadow-lg scale-105` 
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="relative">
                    <tab.icon 
                      size={24} 
                      className={`${
                        activeTab === tab.id ? 'text-white' : theme.textSecondary
                      } transition-colors duration-300`}
                    />
                    {tab.badge && (
                      <div className={`absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r ${theme.accent} rounded-full flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{tab.badge}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${
                    activeTab === tab.id ? 'text-white' : theme.textSecondary
                  }`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pb-20"></div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ViralDiabetesDashboard;