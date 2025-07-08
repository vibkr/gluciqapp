import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Droplet, Activity, Target, TrendingUp, Trophy, 
  Zap, Star, Award, Heart, ArrowUp, ArrowDown, Minus,
  Shield, Gamepad2, Crown, Sparkles, Calculator, Brain,
  Bell, Settings, Users, Calendar, Apple, Clock, Flame,
  ChevronRight, Plus, Eye, Coffee, Utensils, Timer,
  Camera, Share2, MessageCircle, ThumbsUp, Bookmark,
  Search, Filter, Map, Home, User, ChevronDown,
  PlayCircle, PauseCircle, RotateCcw, Send, Edit3,
  Scissors, Volume2, Wifi, Battery, Signal, Menu
} from 'lucide-react';

const ViralDiabetesApp = () => {
  const [currentTheme, setCurrentTheme] = useState('cosmic');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentGlucose, setCurrentGlucose] = useState(125);
  const [timeInRange, setTimeInRange] = useState(89);
  const [currentStreak, setCurrentStreak] = useState(23);
  const [a1cValue, setA1cValue] = useState(6.4);
  const [glucoBalance, setGlucoBalance] = useState(92);
  const [playerLevel, setPlayerLevel] = useState(12);
  const [xp, setXp] = useState(2340);
  const [xpToNext, setXpToNext] = useState(2500);
  const [insulinDose, setInsulinDose] = useState(0);
  const [carbIntake, setCarbIntake] = useState(45);
  const [fastingHours, setFastingHours] = useState(14);
  const [fastingStarted, setFastingStarted] = useState(false);

  // 5 Premium Theme System
  const themes = {
    cosmic: {
      name: 'Cosmic Purple',
      bg: isDarkMode ? 'bg-gradient-to-br from-purple-900 via-black to-indigo-900' : 'bg-gradient-to-br from-purple-50 via-white to-indigo-50',
      cardBg: isDarkMode ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-white/70 backdrop-blur-xl border-white/20',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border-purple-300/20' : 'bg-gradient-to-br from-purple-100/70 to-indigo-100/70 backdrop-blur-xl border-purple-200/30',
      primary: 'from-purple-500 to-indigo-600',
      secondary: 'from-pink-500 to-purple-600',
      accent: 'from-yellow-400 to-orange-500',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-purple-200' : 'text-purple-700',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600'
    },
    ocean: {
      name: 'Ocean Breeze',
      bg: isDarkMode ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50',
      cardBg: isDarkMode ? 'bg-white/5 backdrop-blur-xl border-cyan-300/10' : 'bg-white/70 backdrop-blur-xl border-cyan-200/20',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border-cyan-300/20' : 'bg-gradient-to-br from-cyan-100/70 to-blue-100/70 backdrop-blur-xl border-cyan-200/30',
      primary: 'from-cyan-500 to-blue-600',
      secondary: 'from-teal-500 to-cyan-600',
      accent: 'from-emerald-400 to-teal-500',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-cyan-200' : 'text-cyan-700',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600'
    },
    sunset: {
      name: 'Sunset Vibes',
      bg: isDarkMode ? 'bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900' : 'bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50',
      cardBg: isDarkMode ? 'bg-white/5 backdrop-blur-xl border-orange-300/10' : 'bg-white/70 backdrop-blur-xl border-orange-200/20',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border-orange-300/20' : 'bg-gradient-to-br from-orange-100/70 to-red-100/70 backdrop-blur-xl border-orange-200/30',
      primary: 'from-orange-500 to-red-600',
      secondary: 'from-yellow-500 to-orange-600',
      accent: 'from-pink-400 to-red-500',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-orange-200' : 'text-orange-700',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600'
    },
    forest: {
      name: 'Forest Green',
      bg: isDarkMode ? 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      cardBg: isDarkMode ? 'bg-white/5 backdrop-blur-xl border-green-300/10' : 'bg-white/70 backdrop-blur-xl border-green-200/20',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-xl border-emerald-300/20' : 'bg-gradient-to-br from-emerald-100/70 to-green-100/70 backdrop-blur-xl border-emerald-200/30',
      primary: 'from-emerald-500 to-green-600',
      secondary: 'from-teal-500 to-emerald-600',
      accent: 'from-lime-400 to-green-500',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-emerald-200' : 'text-emerald-700',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600'
    },
    royal: {
      name: 'Royal Gold',
      bg: isDarkMode ? 'bg-gradient-to-br from-gray-900 via-yellow-900 to-amber-900' : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
      cardBg: isDarkMode ? 'bg-white/5 backdrop-blur-xl border-yellow-300/10' : 'bg-white/70 backdrop-blur-xl border-yellow-200/20',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl border-yellow-300/20' : 'bg-gradient-to-br from-yellow-100/70 to-amber-100/70 backdrop-blur-xl border-yellow-200/30',
      primary: 'from-yellow-500 to-amber-600',
      secondary: 'from-amber-500 to-yellow-600',
      accent: 'from-orange-400 to-red-500',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-yellow-200' : 'text-yellow-700',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600'
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

  // Dashboard Component
  const DashboardPage = () => (
    <div className="space-y-6">
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

      {/* A1C Progress Card */}
      <div className={`${theme.cardBg} border rounded-3xl p-6 shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-lg font-bold ${theme.text}`}>A1C Progress</h3>
            <p className={`text-sm ${theme.textMuted}`}>Target: 6.5% or below</p>
          </div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
            {a1cValue}%
          </div>
        </div>
        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full bg-gradient-to-r ${theme.secondary} transition-all duration-1000`}
            style={{width: '78%'}}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className={theme.textMuted}>Below 7%</span>
          <span className="text-green-400 font-bold">Excellent Control!</span>
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
    </div>
  );

  // Insulin Calculator Page
  const InsulinCalculatorPage = () => (
    <div className="space-y-6">
      <div className={`${theme.cardHero} border rounded-3xl p-6 shadow-2xl`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.primary}`}>
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme.text}`}>Smart Insulin Calculator</h2>
            <p className={`${theme.textMuted}`}>AI-powered dose recommendations</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Glucose Input */}
          <div className={`${theme.cardBg} border rounded-2xl p-4`}>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>Current Glucose</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={currentGlucose}
                onChange={(e) => setCurrentGlucose(e.target.value)}
                className={`flex-1 p-3 rounded-xl ${theme.cardBg} border ${theme.text} bg-transparent`}
                placeholder="Enter glucose level"
              />
              <span className={`${theme.textMuted} font-medium`}>mg/dL</span>
            </div>
          </div>

          {/* Carb Input */}
          <div className={`${theme.cardBg} border rounded-2xl p-4`}>
            <label className={`block text-sm font-medium ${theme.text} mb-2`}>Carbohydrates</label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                value={carbIntake}
                onChange={(e) => setCarbIntake(e.target.value)}
                className={`flex-1 p-3 rounded-xl ${theme.cardBg} border ${theme.text} bg-transparent`}
                placeholder="Enter carbs"
              />
              <span className={`${theme.textMuted} font-medium`}>grams</span>
            </div>
          </div>

          {/* Recommended Dose */}
          <div className={`${theme.cardHero} border rounded-2xl p-6`}>
            <div className="text-center space-y-4">
              <h3 className={`text-lg font-bold ${theme.text}`}>Recommended Dose</h3>
              <div className={`text-5xl font-black bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                {Math.round((currentGlucose - 100) / 30 + carbIntake / 10)}
              </div>
              <div className={`text-lg ${theme.textMuted} font-medium`}>units</div>
              <div className="flex space-x-2 justify-center">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Safe Range</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">AI Verified</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className={`p-4 rounded-2xl bg-gradient-to-br ${theme.primary} text-white font-bold transition-transform hover:scale-105`}>
              Log Dose
            </button>
            <button className={`p-4 rounded-2xl ${theme.cardBg} border ${theme.text} font-bold transition-transform hover:scale-105`}>
              Set Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Food & Recipes Page
  const FoodRecipesPage = () => (
    <div className="space-y-6">
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

      {/* Recipe Categories */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: "🥗", name: "Salads", score: "A+" },
          { icon: "🍳", name: "Breakfast", score: "A" },
          { icon: "🥘", name: "Dinner", score: "B+" },
          { icon: "🍓", name: "Snacks", score: "A-" }
        ].map((category, i) => (
          <div key={i} className={`${theme.cardBg} border rounded-2xl p-4 text-center hover:scale-105 transition-transform`}>
            <div className="text-3xl mb-2">{category.icon}</div>
            <h4 className={`font-bold ${theme.text}`}>{category.name}</h4>
            <span className={`text-sm font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
              {category.score}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Meals */}
      <div className="space-y-4">
        <h3 className={`text-xl font-bold ${theme.text}`}>Recent Meals</h3>
        {[
          { meal: "Mediterranean Bowl", time: "2 hours ago", score: 94, carbs: 35 },
          { meal: "Grilled Salmon", time: "Yesterday", score: 88, carbs: 12 },
          { meal: "Quinoa Salad", time: "2 days ago", score: 92, carbs: 28 }
        ].map((meal, i) => (
          <div key={i} className={`${theme.cardBg} border rounded-2xl p-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.primary} flex items-center justify-center text-white font-bold`}>
                {meal.score}
              </div>
              <div>
                <h4 className={`font-bold ${theme.text}`}>{meal.meal}</h4>
                <p className={`text-sm ${theme.textMuted}`}>{meal.time} • {meal.carbs}g carbs</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${theme.textMuted}`} />
          </div>
        ))}
      </div>
    </div>
  );

  // Intermittent Fasting Page
  const FastingPage = () => (
    <div className="space-y-6">
      <div className={`${theme.cardHero} border rounded-3xl p-6 shadow-2xl`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.primary}`}>
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme.text}`}>Intermittent Fasting</h2>
            <p className={`${theme.textMuted}`}>16:8 Protocol Active</p>
          </div>
        </div>

        {/* Fasting Timer */}
        <div className="text-center space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                className="text-gray-300 dark:text-gray-700"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="88"
                cx="96"
                cy="96"
              />
              <circle
                className={`${fastingStarted ? 'text-green-400' : 'text-orange-400'}`}
                strokeWidth="8"
                strokeDasharray={`${(fastingHours / 16) * 552.64} 552.64`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="88"
                cx="96"
                cy="96"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <div className={`text-4xl font-black bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                {fastingHours}h
              </div>
              <div className={`text-sm ${theme.textMuted}`}>
                {fastingStarted ? 'Fasting' : 'Eating Window'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => setFastingStarted(!fastingStarted)}
              className={`w-full p-4 rounded-2xl ${fastingStarted ? 'bg-gradient-to-r from-red-500 to-pink-600' : `bg-gradient-to-r ${theme.primary}`} text-white font-bold transition-transform hover:scale-105`}
            >
              {fastingStarted ? (
                <div className="flex items-center justify-center space-x-2">
                  <PauseCircle size={20} />
                  <span>End Fast</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <PlayCircle size={20} />
                  <span>Start Fast</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Fasting Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${theme.cardBg} border rounded-2xl p-4 text-center`}>
          <Timer className={`w-8 h-8 ${theme.textSecondary} mx-auto mb-2`} />
          <div className={`text-2xl font-bold ${theme.text}`}>7</div>
          <div className={`text-sm ${theme.textMuted}`}>Day Streak</div>
        </div>
        <div className={`${theme.cardBg} border rounded-2xl p-4 text-center`}>
          <Target className={`w-8 h-8 ${theme.textSecondary} mx-auto mb-2`} />
          <div className={`text-2xl font-bold ${theme.text}`}>16h</div>
          <div className={`text-sm ${theme.textMuted}`}>Goal</div>
        </div>
      </div>

      {/* Fasting Benefits */}
      <div className="space-y-4">
        <h3 className={`text-xl font-bold ${theme.text}`}>Today's Benefits</h3>
        {[
          { benefit: "Improved Glucose Control", progress: 85 },
          { benefit: "Enhanced Fat Burning", progress: 70 },
          { benefit: "Cellular Repair", progress: 60 }
        ].map((item, i) => (
          <div key={i} className={`${theme.cardBg} border rounded-2xl p-4`}>
            <div className="flex justify-between mb-2">
              <span className={`font-medium ${theme.text}`}>{item.benefit}</span>
              <span className={`text-sm ${theme.textMuted}`}>{item.progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${theme.secondary} transition-all duration-500`}
                style={{width: `${item.progress}%`}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Community Page
  const CommunityPage = () => (
    <div className="space-y-6">
      <div className={`${theme.cardHero} border rounded-3xl p-6 shadow-2xl`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.primary}`}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme.text}`}>Community</h2>
            <p className={`${theme.textMuted}`}>Connect with 12.5k members</p>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className={`${theme.cardBg} border rounded-2xl p-4 text-center`}>
          <Trophy className={`w-6 h-6 ${theme.textSecondary} mx-auto mb-2`} />
          <div className={`text-xl font-bold ${theme.text}`}>#47</div>
          <div className={`text-xs ${theme.textMuted}`}>Leaderboard</div>
        </div>
        <div className={`${theme.cardBg} border rounded-2xl p-4 text-center`}>
          <Heart className={`w-6 h-6 ${theme.textSecondary} mx-auto mb-2`} />
          <div className={`text-xl font-bold ${theme.text}`}>156</div>
          <div className={`text-xs ${theme.textMuted}`}>Supporters</div>
        </div>
        <div className={`${theme.cardBg} border rounded-2xl p-4 text-center`}>
          <Star className={`w-6 h-6 ${theme.textSecondary} mx-auto mb-2`} />
          <div className={`text-xl font-bold ${theme.text}`}>4.9</div>
          <div className={`text-xs ${theme.textMuted}`}>Rating</div>
        </div>
      </div>

      {/* Community Posts */}
      <div className="space-y-4">
        <h3 className={`text-xl font-bold ${theme.text}`}>Recent Posts</h3>
        {[
          { user: "Sarah M.", time: "2h ago", content: "Just hit my 30-day streak! The community support has been amazing 🎉", likes: 24, comments: 8 },
          { user: "Mike K.", time: "4h ago", content: "Sharing my favorite low-carb breakfast recipe. Perfect for stable morning glucose!", likes: 18, comments: 12 },
          { user: "Emma R.", time: "6h ago", content: "Finally got my A1C below 7%! Thank you everyone for the motivation ❤️", likes: 42, comments: 15 }
        ].map((post, i) => (
          <div key={i} className={`${theme.cardBg} border rounded-2xl p-4`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.primary} flex items-center justify-center text-white font-bold`}>
                {post.user.charAt(0)}
              </div>
              <div>
                <h4 className={`font-bold ${theme.text}`}>{post.user}</h4>
                <p className={`text-xs ${theme.textMuted}`}>{post.time}</p>
              </div>
            </div>
            <p className={`${theme.text} mb-3`}>{post.content}</p>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1">
                <ThumbsUp className={`w-4 h-4 ${theme.textMuted}`} />
                <span className={`text-sm ${theme.textMuted}`}>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1">
                <MessageCircle className={`w-4 h-4 ${theme.textMuted}`} />
                <span className={`text-sm ${theme.textMuted}`}>{post.comments}</span>
              </button>
              <button className="flex items-center space-x-1">
                <Share2 className={`w-4 h-4 ${theme.textMuted}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Profile & Settings Page
  const ProfilePage = () => (
    <div className="space-y-6">
      <div className={`${theme.cardHero} border rounded-3xl p-6 shadow-2xl text-center`}>
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.primary} mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold`}>
          J
        </div>
        <h2 className={`text-2xl font-bold ${theme.text}`}>Jordan Smith</h2>
        <p className={`${theme.textMuted}`}>Type 1 Diabetes • 3 years</p>
        <div className="flex justify-center space-x-4 mt-4">
          <div className="text-center">
            <div className={`text-xl font-bold ${theme.text}`}>23</div>
            <div className={`text-xs ${theme.textMuted}`}>Day Streak</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${theme.text}`}>89%</div>
            <div className={`text-xs ${theme.textMuted}`}>Time in Range</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${theme.text}`}>6.4%</div>
            <div className={`text-xs ${theme.textMuted}`}>Latest A1C</div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {[
          { icon: User, title: "Personal Information", subtitle: "Update your profile details" },
          { icon: Bell, title: "Notifications", subtitle: "Manage your alerts and reminders" },
          { icon: Shield, title: "Privacy & Security", subtitle: "Control your data and privacy" },
          { icon: Settings, title: "App Preferences", subtitle: "Customize your experience" },
          { icon: Heart, title: "Health Data", subtitle: "Sync with health apps" },
          { icon: Share2, title: "Export Data", subtitle: "Download your health records" }
        ].map((item, i) => (
          <div key={i} className={`${theme.cardBg} border rounded-2xl p-4 flex items-center justify-between hover:scale-105 transition-transform`}>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.primary}`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className={`font-bold ${theme.text}`}>{item.title}</h4>
                <p className={`text-sm ${theme.textMuted}`}>{item.subtitle}</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 ${theme.textMuted}`} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'glucose': return <DashboardPage />;
      case 'insulin': return <InsulinCalculatorPage />;
      case 'food': return <FoodRecipesPage />;
      case 'fasting': return <FastingPage />;
      case 'community': return <CommunityPage />;
      case 'profile': return <ProfilePage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${theme.bg} relative overflow-hidden`}>
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <PulsingOrb size="w-2 h-2" color="bg-purple-400" delay={0} className="absolute top-20 left-10" />
        <PulsingOrb size="w-3 h-3" color="bg-pink-400" delay={1} className="absolute top-40 right-20" />
        <PulsingOrb size="w-2 h-2" color="bg-blue-400" delay={2} className="absolute bottom-40 left-20" />
        <PulsingOrb size="w-4 h-4" color="bg-yellow-400" delay={3} className="absolute bottom-20 right-10" />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 text-sm">
        <span className={`${theme.text} font-medium`}>12:42</span>
        <div className="flex items-center space-x-1">
          <Signal className={`w-4 h-4 ${theme.text}`} />
          <Wifi className={`w-4 h-4 ${theme.text}`} />
          <Battery className={`w-4 h-4 ${theme.text}`} />
          <span className={`${theme.text} text-xs`}>84%</span>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6 relative z-10">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pt-4 pb-4">
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
            <FloatingElement delay={0.4}>
              <button 
                onClick={() => setCurrentPage('profile')}
                className={`p-3 rounded-xl ${theme.cardBg} border backdrop-blur-lg hover:scale-110 transition-all duration-300`}
              >
                <Settings size={20} className={theme.text} />
              </button>
            </FloatingElement>
          </div>
        </div>

        {/* Page Content */}
        {renderPage()}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className={`${theme.cardBg} border backdrop-blur-xl rounded-3xl shadow-2xl p-2 max-w-md mx-auto`}>
            <div className="flex justify-around">
              {[
                { id: 'dashboard', icon: Home, label: 'Home', page: 'dashboard' },
                { id: 'glucose', icon: Droplet, label: 'Glucose', page: 'dashboard' },
                { id: 'insulin', icon: Zap, label: 'Insulin', page: 'insulin' },
                { id: 'food', icon: Apple, label: 'Food', page: 'food' },
                { id: 'fasting', icon: Clock, label: 'Fasting', page: 'fasting' },
                { id: 'community', icon: Users, label: 'Community', page: 'community' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(tab.page);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 transform relative ${
                    activeTab === tab.id 
                      ? `bg-gradient-to-t ${theme.primary} shadow-lg scale-105` 
                      : 'hover:scale-105'
                  }`}
                >
                  <tab.icon 
                    size={22} 
                    className={`${
                      activeTab === tab.id ? 'text-white' : theme.textSecondary
                    } transition-colors duration-300`}
                  />
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

export default ViralDiabetesApp;