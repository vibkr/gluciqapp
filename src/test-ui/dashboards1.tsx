import React, { useState, useEffect } from 'react';
import { 
  Sun, Moon, Droplet, Activity, Target, TrendingUp, Trophy, 
  Zap, Star, Award, Heart, ArrowUp, ArrowDown, Minus,
  Shield, Gamepad2, Crown, Sparkles, Calculator, Brain,
  Bell, Settings, Users, Calendar, Apple, Clock, Flame,
  ChevronRight, Plus, Eye, Coffee, Utensils, MessageCircle,
  Share2, BarChart3, Timer, Syringe, Smartphone, Wifi,
  Volume2, VolumeX, Camera, Search, Filter, MapPin,
  ThumbsUp, Gift, Bookmark, Palette, Home, User,
  PieChart, LineChart, Globe, Compass, Mountain
} from 'lucide-react';

const ViralDiabetesDashboard = () => {
  const [currentTheme, setCurrentTheme] = useState('midnight');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentGlucose, setCurrentGlucose] = useState(125);
  const [timeInRange, setTimeInRange] = useState(89);
  const [currentStreak, setCurrentStreak] = useState(23);
  const [a1cValue, setA1cValue] = useState(6.4);
  const [glucoBalance, setGlucoBalance] = useState(92);
  const [playerLevel, setPlayerLevel] = useState(12);
  const [xp, setXp] = useState(2340);
  const [xpToNext, setXpToNext] = useState(2500);
  const [notifications, setNotifications] = useState(true);

  // 5 Premium Theme System with Light/Dark modes
  const themes = {
    midnight: {
      name: 'Midnight Pro',
      bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
      cardBg: isDarkMode ? 'bg-gray-800/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl' : 'bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl',
      text: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      primary: 'from-blue-500 to-purple-600',
      secondary: 'from-purple-500 to-pink-600',
      accent: 'from-orange-500 to-red-600',
      success: 'from-green-500 to-emerald-600',
      border: isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
    },
    ocean: {
      name: 'Ocean Breeze',
      bg: isDarkMode ? 'bg-slate-900' : 'bg-blue-50',
      cardBg: isDarkMode ? 'bg-slate-800/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl' : 'bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-xl',
      text: isDarkMode ? 'text-white' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600',
      textMuted: isDarkMode ? 'text-slate-400' : 'text-slate-500',
      primary: 'from-cyan-500 to-blue-600',
      secondary: 'from-blue-500 to-indigo-600',
      accent: 'from-teal-500 to-cyan-600',
      success: 'from-emerald-500 to-teal-600',
      border: isDarkMode ? 'border-slate-700/50' : 'border-blue-200/50'
    },
    forest: {
      name: 'Forest Zen',
      bg: isDarkMode ? 'bg-emerald-950' : 'bg-green-50',
      cardBg: isDarkMode ? 'bg-emerald-900/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-emerald-900/95 to-emerald-950/95 backdrop-blur-xl' : 'bg-gradient-to-br from-white/95 to-green-50/95 backdrop-blur-xl',
      text: isDarkMode ? 'text-white' : 'text-emerald-900',
      textSecondary: isDarkMode ? 'text-emerald-200' : 'text-emerald-700',
      textMuted: isDarkMode ? 'text-emerald-300' : 'text-emerald-600',
      primary: 'from-green-500 to-emerald-600',
      secondary: 'from-emerald-500 to-teal-600',
      accent: 'from-lime-500 to-green-600',
      success: 'from-green-600 to-emerald-700',
      border: isDarkMode ? 'border-emerald-700/50' : 'border-green-200/50'
    },
    sunset: {
      name: 'Sunset Glow',
      bg: isDarkMode ? 'bg-orange-950' : 'bg-orange-50',
      cardBg: isDarkMode ? 'bg-orange-900/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-orange-900/95 to-orange-950/95 backdrop-blur-xl' : 'bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-xl',
      text: isDarkMode ? 'text-white' : 'text-orange-900',
      textSecondary: isDarkMode ? 'text-orange-200' : 'text-orange-700',
      textMuted: isDarkMode ? 'text-orange-300' : 'text-orange-600',
      primary: 'from-orange-500 to-red-600',
      secondary: 'from-red-500 to-pink-600',
      accent: 'from-yellow-500 to-orange-600',
      success: 'from-green-500 to-emerald-600',
      border: isDarkMode ? 'border-orange-700/50' : 'border-orange-200/50'
    },
    royal: {
      name: 'Royal Purple',
      bg: isDarkMode ? 'bg-purple-950' : 'bg-purple-50',
      cardBg: isDarkMode ? 'bg-purple-900/90 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl',
      cardHero: isDarkMode ? 'bg-gradient-to-br from-purple-900/95 to-purple-950/95 backdrop-blur-xl' : 'bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl',
      text: isDarkMode ? 'text-white' : 'text-purple-900',
      textSecondary: isDarkMode ? 'text-purple-200' : 'text-purple-700',
      textMuted: isDarkMode ? 'text-purple-300' : 'text-purple-600',
      primary: 'from-purple-500 to-indigo-600',
      secondary: 'from-indigo-500 to-purple-600',
      accent: 'from-pink-500 to-purple-600',
      success: 'from-green-500 to-emerald-600',
      border: isDarkMode ? 'border-purple-700/50' : 'border-purple-200/50'
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

  // Glucose Chart Component
  const GlucoseChart = () => {
    const dataPoints = [120, 135, 125, 140, 130, 125, 118, 122, 128, 135, 130, 125];
    const maxValue = Math.max(...dataPoints);
    const minValue = Math.min(...dataPoints);
    
    return (
      <div className="h-32 relative">
        <svg className="w-full h-full" viewBox="0 0 300 120">
          <defs>
            <linearGradient id="glucose-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Target zone */}
          <rect x="0" y="20" width="300" height="60" fill="rgba(34, 197, 94, 0.1)" />
          
          {/* Data line */}
          <path
            d={`M ${dataPoints.map((point, index) => 
              `${(index * 300) / (dataPoints.length - 1)},${120 - ((point - minValue) / (maxValue - minValue)) * 100}`
            ).join(' L ')}`}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3"
            className="animate-draw"
          />
          
          {/* Fill area */}
          <path
            d={`M 0,120 L ${dataPoints.map((point, index) => 
              `${(index * 300) / (dataPoints.length - 1)},${120 - ((point - minValue) / (maxValue - minValue)) * 100}`
            ).join(' L ')} L 300,120 Z`}
            fill="url(#glucose-gradient)"
            className="animate-fill"
          />
          
          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={(index * 300) / (dataPoints.length - 1)}
              cy={120 - ((point - minValue) / (maxValue - minValue)) * 100}
              r="4"
              fill="rgb(59, 130, 246)"
              className="animate-bounce-in"
              style={{animationDelay: `${index * 0.1}s`}}
            />
          ))}
        </svg>
      </div>
    );
  };

  // Quest/Achievement Card
  const QuestCard = ({ title, description, reward, completed = false, progress = 100, icon: Icon = Target }) => (
    <div className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group`}>
      {completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 animate-pulse" />
      )}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-xl ${completed ? 'bg-gradient-to-br from-green-500 to-emerald-600' : `bg-gradient-to-br ${theme.primary}`} group-hover:scale-110 transition-transform`}>
            {completed ? <Trophy className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5 text-white" />}
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

  // AI Recommendation Card
  const AIRecommendationCard = ({ title, description, confidence, tags, action }) => (
    <div className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 group hover:scale-105 transition-all duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.primary}`}>
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className={`font-bold ${theme.text}`}>{title}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <div className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
                <span className="text-blue-400 text-xs font-bold">AI Powered</span>
              </div>
              <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-400/30">
                <span className="text-green-400 text-xs font-bold">{confidence}% Confidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className={`text-sm ${theme.textMuted} mb-3`}>{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, index) => (
          <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${theme.secondary} text-white`}>
            {tag}
          </span>
        ))}
      </div>
      
      <button className={`w-full py-2 px-4 rounded-xl bg-gradient-to-r ${theme.accent} text-white font-medium hover:scale-105 transition-transform`}>
        {action}
      </button>
    </div>
  );

  // Insulin Calculator Component
  const InsulinCalculator = () => (
    <div className={`${theme.cardBg} ${theme.border} border rounded-3xl p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${theme.text} flex items-center space-x-2`}>
          <Calculator className="w-5 h-5" />
          <span>Smart Insulin Calculator</span>
        </h3>
        <div className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
          <span className="text-blue-400 text-xs font-bold">AI Enhanced</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`text-sm font-medium ${theme.textMuted} block mb-2`}>Current Glucose</label>
          <div className={`${theme.cardBg} ${theme.border} border rounded-xl p-3 text-center`}>
            <span className={`text-2xl font-bold ${theme.text}`}>125</span>
            <span className={`text-sm ${theme.textMuted} ml-1`}>mg/dL</span>
          </div>
        </div>
        <div>
          <label className={`text-sm font-medium ${theme.textMuted} block mb-2`}>Target Glucose</label>
          <div className={`${theme.cardBg} ${theme.border} border rounded-xl p-3 text-center`}>
            <span className={`text-2xl font-bold ${theme.text}`}>100</span>
            <span className={`text-sm ${theme.textMuted} ml-1`}>mg/dL</span>
          </div>
        </div>
      </div>
      
      <div>
        <label className={`text-sm font-medium ${theme.textMuted} block mb-2`}>Carbs to Cover</label>
        <div className={`${theme.cardBg} ${theme.border} border rounded-xl p-3 text-center`}>
          <span className={`text-2xl font-bold ${theme.text}`}>45</span>
          <span className={`text-sm ${theme.textMuted} ml-1`}>grams</span>
        </div>
      </div>
      
      <div className={`bg-gradient-to-r ${theme.primary} rounded-2xl p-4 text-white text-center`}>
        <div className="text-sm font-medium mb-1">Recommended Dose</div>
        <div className="text-3xl font-bold">6.5 units</div>
        <div className="text-sm opacity-90 mt-2">3.5u correction + 3u meal coverage</div>
      </div>
      
      <button className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${theme.accent} text-white font-bold hover:scale-105 transition-transform`}>
        Log Insulin Dose
      </button>
    </div>
  );

  // Community Feed Component
  const CommunityFeed = () => (
    <div className="space-y-4">
      <h3 className={`text-lg font-bold ${theme.text} flex items-center space-x-2`}>
        <Users className="w-5 h-5" />
        <span>Community Wins</span>
      </h3>
      
      {[
        { name: 'Sarah M.', achievement: 'Reached 90 days in range!', time: '2h ago', likes: 24 },
        { name: 'Michael T.', achievement: 'Lost 15 lbs with steady glucose', time: '4h ago', likes: 18 },
        { name: 'Emma K.', achievement: 'Perfect week challenge completed', time: '6h ago', likes: 31 }
      ].map((post, index) => (
        <div key={index} className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 hover:scale-105 transition-transform`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.primary} flex items-center justify-center text-white font-bold`}>
                {post.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className={`font-medium ${theme.text}`}>{post.name}</div>
                <div className={`text-sm ${theme.textMuted}`}>{post.time}</div>
              </div>
            </div>
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <p className={`${theme.textSecondary} mb-3`}>{post.achievement}</p>
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <ThumbsUp className="w-4 h-4 text-blue-500" />
              <span className={`text-sm ${theme.textMuted}`}>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4 text-gray-500" />
              <span className={`text-sm ${theme.textMuted}`}>Comment</span>
            </button>
            <button className="hover:scale-105 transition-transform">
              <Share2 className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Intermittent Fasting Component
  const IntermittentFasting = () => {
    const fastingHours = 14;
    const totalHours = 16;
    const percentage = (fastingHours / totalHours) * 100;
    
    return (
      <div className={`${theme.cardBg} ${theme.border} border rounded-3xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${theme.text} flex items-center space-x-2`}>
            <Timer className="w-5 h-5" />
            <span>Intermittent Fasting</span>
          </h3>
          <div className="px-2 py-1 rounded-full bg-orange-500/20 border border-orange-400/30">
            <span className="text-orange-400 text-xs font-bold">16:8 Active</span>
          </div>
        </div>
        
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold ${theme.text} mb-2`}>
            {fastingHours}h {Math.floor((percentage % 1) * 60)}m
          </div>
          <div className={`text-sm ${theme.textMuted}`}>
            {totalHours - fastingHours}h {60 - Math.floor((percentage % 1) * 60)}m eating window left
          </div>
        </div>
        
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#fasting-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.83} 283`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-xl font-bold ${theme.text}`}>{Math.round(percentage)}%</div>
              <div className={`text-xs ${theme.textMuted}`}>Complete</div>
            </div>
          </div>
          <defs>
            <linearGradient id="fasting-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(249, 115, 22)" />
              <stop offset="100%" stopColor="rgb(234, 88, 12)" />
            </linearGradient>
          </defs>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${theme.textMuted}`}>Fasting started</span>
            <span className={`text-sm font-medium ${theme.text}`}>8:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${theme.textMuted}`}>Can eat at</span>
            <span className={`text-sm font-medium ${theme.text}`}>12:00 PM</span>
          </div>
        </div>
        
        <button className={`w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r ${theme.accent} text-white font-bold hover:scale-105 transition-transform`}>
          End Fast Early
        </button>
      </div>
    );
  };

  // Profile Settings Page
  const ProfilePage = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.primary} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}>
          JD
        </div>
        <h2 className={`text-2xl font-bold ${theme.text}`}>Jordan Davis</h2>
        <p className={`${theme.textMuted}`}>Health Champion • Level 12</p>
      </div>
      
      <div className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 space-y-4`}>
        <h3 className={`font-bold ${theme.text}`}>Health Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>89%</div>
            <div className={`text-sm ${theme.textMuted}`}>Time in Range</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>6.4%</div>
            <div className={`text-sm ${theme.textMuted}`}>Latest A1C</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>23</div>
            <div className={`text-sm ${theme.textMuted}`}>Day Streak</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>12</div>
            <div className={`text-sm ${theme.textMuted}`}>Achievement Level</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {[
          { icon: Settings, label: 'Account Settings', hasNotification: false },
          { icon: Bell, label: 'Notifications', hasNotification: true },
          { icon: Palette, label: 'Themes & Appearance', hasNotification: false },
          { icon: Shield, label: 'Privacy & Security', hasNotification: false },
          { icon: Heart, label: 'Health Data Export', hasNotification: false },
          { icon: Users, label: 'Community Settings', hasNotification: false }
        ].map((item, index) => (
          <div key={index} className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 flex items-center justify-between hover:scale-105 transition-transform`}>
            <div className="flex items-center space-x-3">
              <item.icon className={`w-5 h-5 ${theme.textSecondary}`} />
              <span className={`font-medium ${theme.text}`}>{item.label}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.hasNotification && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
              <ChevronRight className={`w-4 h-4 ${theme.textMuted}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Food & Recipes Page
  const FoodRecipesPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${theme.text}`}>Food & Recipes</h2>
        <button className={`p-2 rounded-xl ${theme.cardBg} ${theme.border} border`}>
          <Search className={`w-5 h-5 ${theme.textSecondary}`} />
        </button>
      </div>
      
      {/* GlucoBalance Food Suggestions */}
      <div className={`${theme.cardBg} ${theme.border} border rounded-3xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${theme.text} flex items-center space-x-2`}>
            <Brain className="w-5 h-5" />
            <span>GlucoBalance™ Recommendations</span>
          </h3>
          <div className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/30">
            <span className="text-blue-400 text-xs font-bold">AI Powered</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Mediterranean Bowl', score: 92, image: '🥗', tags: ['Low GL', 'High Protein'], time: 'Perfect for lunch' },
            { name: 'Salmon & Quinoa', score: 88, image: '🐟', tags: ['Omega-3', 'Balanced'], time: 'Great for dinner' },
            { name: 'Greek Yogurt Parfait', score: 85, image: '🥄', tags: ['Probiotic', 'Low Sugar'], time: 'Ideal for breakfast' }
          ].map((food, index) => (
            <div key={index} className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 hover:scale-105 transition-transform`}>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{food.image}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-bold ${theme.text}`}>{food.name}</h4>
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${theme.secondary} flex items-center justify-center text-white font-bold`}>
                      {food.score}
                    </div>
                  </div>
                  <p className={`text-sm ${theme.textMuted} mb-2`}>{food.time}</p>
                  <div className="flex space-x-2">
                    {food.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className={`p-2 rounded-xl bg-gradient-to-br ${theme.accent} text-white hover:scale-110 transition-transform`}>
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recipe Categories */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: 'Breakfast', icon: '🌅', count: 24 },
          { name: 'Lunch', icon: '🥪', count: 31 },
          { name: 'Dinner', icon: '🍽️', count: 28 },
          { name: 'Snacks', icon: '🍎', count: 19 }
        ].map((category, index) => (
          <div key={index} className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 text-center hover:scale-105 transition-transform`}>
            <div className="text-3xl mb-2">{category.icon}</div>
            <h4 className={`font-bold ${theme.text}`}>{category.name}</h4>
            <p className={`text-sm ${theme.textMuted}`}>{category.count} recipes</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Main Dashboard Content
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Player Progress Header */}
      <div className={`${theme.cardHero} ${theme.border} border rounded-3xl p-6 shadow-2xl`}>
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
      <div className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-400/30`}>
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
      <div className={`${theme.cardHero} ${theme.border} border rounded-3xl p-6 shadow-2xl relative overflow-hidden`}>
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

          <div className="text-center space-y-4 mb-6">
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
          
          <GlucoseChart />
        </div>
      </div>

      {/* A1C Progress Card */}
      <div className={`${theme.cardBg} ${theme.border} border rounded-3xl p-6 shadow-xl`}>
        <h3 className={`text-lg font-bold ${theme.text} mb-4 flex items-center space-x-2`}>
          <Target className="w-5 h-5" />
          <span>A1C Journey</span>
        </h3>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className={`text-4xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
              {a1cValue}%
            </div>
            <div className={`text-sm ${theme.textMuted}`}>Current A1C</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme.text}`}>6.0%</div>
            <div className={`text-sm ${theme.textMuted}`}>Target</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">↓0.3</div>
            <div className={`text-sm ${theme.textMuted}`}>3 months</div>
          </div>
        </div>
        
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
          <div className={`h-full bg-gradient-to-r ${theme.success} transition-all duration-1000`} style={{width: '75%'}} />
        </div>
        
        <div className="text-center">
          <p className={`text-sm ${theme.textMuted}`}>
            ✨ <strong>Predicted next A1C:</strong> 6.1% in 3 months
          </p>
        </div>
      </div>

      {/* GlucoBalance AI Card */}
      <div className={`${theme.cardBg} ${theme.border} border rounded-3xl p-6 shadow-xl`}>
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

        <div className={`${theme.cardBg} ${theme.border} border rounded-2xl p-4 mb-4`}>
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

      {/* AI Recommendations */}
      <AIRecommendationCard
        title="Optimize Your Morning Routine"
        description="Based on your glucose patterns, having protein within 30 minutes of waking could improve your morning stability."
        confidence={89}
        tags={['Personalized', 'Morning Routine', 'Glucose Stability']}
        action="View Detailed Plan"
      />

      {/* Daily Quests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${theme.text} flex items-center space-x-2`}>
            <Gamepad2 className="w-5 h-5" />
            <span>Daily Quests</span>
          </h3>
          <span className={`text-sm ${theme.textMuted} px-3 py-1 rounded-full ${theme.cardBg} ${theme.border} border`}>
            3/4 Complete
          </span>
        </div>

        <div className="space-y-3">
          <QuestCard
            title="Hydration Hero"
            description="Drink 8 glasses of water"
            reward="+50 XP"
            completed={true}
            icon={Droplet}
          />
          <QuestCard
            title="Glucose Guardian"
            description="Stay in range for 4+ hours"
            reward="+75 XP"
            completed={true}
            icon={Shield}
          />
          <QuestCard
            title="Exercise Champion"
            description="Complete 30 min activity"
            reward="+100 XP"
            progress={65}
            icon={Activity}
          />
          <QuestCard
            title="Mindful Eating"
            description="Log 3 meals with photos"
            reward="+60 XP"
            progress={33}
            icon={Camera}
          />
        </div>
      </div>

      {/* VictoryTrack Progress */}
      <div className={`${theme.cardBg} ${theme.border} border rounded-3xl p-6 shadow-xl`}>
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
            <div className={`text-sm ${theme.textMuted}`}>Day Streak • Personal best!</div>
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
                  : `${theme.cardBg} ${theme.border} opacity-50`
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

      {/* Intermittent Fasting */}
      <IntermittentFasting />

      {/* Community Feed */}
      <CommunityFeed />
    </div>
  );

  // Render appropriate page content
  const renderPageContent = () => {
    switch(currentPage) {
      case 'insulin':
        return <InsulinCalculator />;
      case 'profile':
        return <ProfilePage />;
      case 'food':
        return <FoodRecipesPage />;
      default:
        return <DashboardContent />;
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

      <div className="max-w-md mx-auto p-4 space-y-6 relative z-10">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between pt-8 pb-4">
          <div className="flex items-center space-x-3">
            <select
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              className={`${theme.cardBg} ${theme.text} ${theme.border} border rounded-xl px-3 py-2 text-sm font-medium backdrop-blur-lg`}
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
                className={`p-3 rounded-xl ${theme.cardBg} ${theme.border} border backdrop-blur-lg hover:scale-110 transition-all duration-300`}
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className={theme.textMuted} />}
              </button>
            </FloatingElement>
            <FloatingElement delay={0.2}>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`p-3 rounded-xl ${theme.cardBg} ${theme.border} border backdrop-blur-lg hover:scale-110 transition-all duration-300 relative`}
              >
                {notifications ? <Bell size={20} className={theme.text} /> : <VolumeX size={20} className={theme.textMuted} />}
                {notifications && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
              </button>
            </FloatingElement>
            <FloatingElement delay={0.4}>
              <button 
                onClick={() => setCurrentPage('profile')}
                className={`p-3 rounded-xl ${theme.cardBg} ${theme.border} border backdrop-blur-lg hover:scale-110 transition-all duration-300`}
              >
                <Settings size={20} className={theme.text} />
              </button>
            </FloatingElement>
          </div>
        </div>

        {/* Page Content */}
        {renderPageContent()}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <div className={`${theme.cardBg} ${theme.border} border backdrop-blur-xl rounded-3xl shadow-2xl p-2 max-w-md mx-auto`}>
            <div className="flex justify-around">
              {[
                { id: 'today', icon: Home, label: 'Today', page: 'dashboard', badge: '3' },
                { id: 'glucose', icon: Droplet, label: 'Glucose', page: 'dashboard' },
                { id: 'insulin', icon: Syringe, label: 'Insulin', page: 'insulin' },
                { id: 'food', icon: Apple, label: 'Food', page: 'food', badge: '2' },
                { id: 'progress', icon: Trophy, label: 'Progress', page: 'dashboard' }
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
                  <div className="relative">
                    <tab.icon 
                      size={24} 
                      className={`${
                        activeTab === tab.id ? 'text-white' : theme.textSecondary
                      } transition-colors duration-300`}
                    />
                    {tab.badge && (
                      <div className={`absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r ${theme.accent} rounded-full flex items-center justify-center animate-pulse`}>
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
        @keyframes draw {
          from { stroke-dasharray: 0 1000; }
          to { stroke-dasharray: 1000 0; }
        }
        @keyframes fill {
          from { fill-opacity: 0; }
          to { fill-opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-draw {
          animation: draw 2s ease-in-out;
        }
        .animate-fill {
          animation: fill 2s ease-in-out 1s both;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ViralDiabetesDashboard;