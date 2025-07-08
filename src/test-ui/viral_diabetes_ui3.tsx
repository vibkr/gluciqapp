import React, { useState, useEffect } from 'react';
import { 
  Activity, Bell, Calendar, Camera, ChevronDown, ChevronRight, 
  Droplets, Heart, Home, Menu, Moon, Plus, Settings, 
  Star, Sun, Target, TrendingUp, Trophy, User, Zap,
  Play, Pause, BarChart3, Brain, Coffee, Utensils, Clock,
  Award, Shield, Sparkles, Flame, Globe, BookOpen, AlertTriangle,
  Battery, Scale, Dumbbell, Pill, Eye, Thermometer, Wind,
  MapPin, Smartphone, Wifi, Timer, CheckCircle, XCircle
} from 'lucide-react';

const DiabetesManagementSystem = () => {
  const [currentType, setCurrentType] = useState('type1');
  const [currentTheme, setCurrentTheme] = useState('neon');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isAnimating, setIsAnimating] = useState(false);
  const [glucoseValue, setGlucoseValue] = useState(142);
  const [ketoneValue, setKetoneValue] = useState(0.3);

  // Enhanced themes for each diabetes type
  const themes = {
    // Type 1 Themes - Focus on precision and monitoring
    neon: {
      name: 'Neon Pulse',
      primary: isDarkMode ? 'from-cyan-400 to-blue-500' : 'from-cyan-500 to-blue-600',
      secondary: isDarkMode ? 'from-purple-400 to-pink-500' : 'from-purple-500 to-pink-600',
      accent: isDarkMode ? 'from-green-400 to-teal-500' : 'from-green-500 to-teal-600',
      background: isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50',
      card: isDarkMode ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white/80 backdrop-blur-xl border-white/30',
      text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600'
    },
    electric: {
      name: 'Electric Storm',
      primary: isDarkMode ? 'from-yellow-400 to-orange-500' : 'from-yellow-500 to-orange-600',
      secondary: isDarkMode ? 'from-indigo-400 to-purple-500' : 'from-indigo-500 to-purple-600',
      accent: isDarkMode ? 'from-pink-400 to-red-500' : 'from-pink-500 to-red-600',
      background: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-yellow-50 to-orange-50',
      card: isDarkMode ? 'bg-gray-800/60 backdrop-blur-xl border-gray-700/50' : 'bg-white/80 backdrop-blur-xl border-white/30',
      text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600'
    },
    crystal: {
      name: 'Crystal Clear',
      primary: isDarkMode ? 'from-blue-400 to-indigo-500' : 'from-blue-500 to-indigo-600',
      secondary: isDarkMode ? 'from-teal-400 to-cyan-500' : 'from-teal-500 to-cyan-600',
      accent: isDarkMode ? 'from-violet-400 to-purple-500' : 'from-violet-500 to-purple-600',
      background: isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50',
      card: isDarkMode ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white/90 backdrop-blur-xl border-white/40',
      text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600'
    },
    plasma: {
      name: 'Plasma Wave',
      primary: isDarkMode ? 'from-purple-400 to-indigo-500' : 'from-purple-500 to-indigo-600',
      secondary: isDarkMode ? 'from-pink-400 to-purple-500' : 'from-pink-500 to-purple-600',
      accent: isDarkMode ? 'from-cyan-400 to-blue-500' : 'from-cyan-500 to-blue-600',
      background: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-indigo-50',
      card: isDarkMode ? 'bg-gray-800/60 backdrop-blur-xl border-gray-700/50' : 'bg-white/80 backdrop-blur-xl border-white/30',
      text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600'
    },
    arctic: {
      name: 'Arctic Glow',
      primary: isDarkMode ? 'from-blue-300 to-cyan-400' : 'from-blue-400 to-cyan-500',
      secondary: isDarkMode ? 'from-teal-300 to-blue-400' : 'from-teal-400 to-blue-500',
      accent: isDarkMode ? 'from-cyan-300 to-teal-400' : 'from-cyan-400 to-teal-500',
      background: isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-cyan-50 to-blue-50',
      card: isDarkMode ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white/85 backdrop-blur-xl border-white/35',
      text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
      textSecondary: isDarkMode ? 'text-slate-300' : 'text-slate-600'
    }
  };

  const theme = themes[currentTheme];

  const handleViewChange = (newView) => {
    if (newView === currentView) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView(newView);
      setIsAnimating(false);
    }, 200);
  };

  // Type 1 Diabetes Components
  const CGMHeroCard = () => (
    <div className={`${theme.card} rounded-3xl p-6 shadow-2xl border relative overflow-hidden transform hover:scale-105 transition-all duration-500`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.primary} opacity-10 animate-pulse`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className={`${theme.textSecondary} text-sm font-medium uppercase tracking-wider`}>
                Continuous Glucose Monitor
              </h3>
            </div>
            <div className="flex items-end gap-3">
              <span className={`text-6xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent animate-pulse`}>
                {glucoseValue}
              </span>
              <div className="mb-3">
                <span className={`${theme.textSecondary} text-lg`}>mg/dL</span>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm font-medium">Stable</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-3xl bg-gradient-to-r ${theme.primary} shadow-2xl animate-bounce`}>
            <Droplets className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className={`${theme.textSecondary} text-sm font-medium`}>24-Hour Trend</span>
            <span className={`${theme.text} text-sm font-semibold`}>Last reading: 2 min ago</span>
          </div>
          <div className="h-20 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 opacity-30"></div>
            <svg className="w-full h-full" viewBox="0 0 300 80">
              <path 
                d="M0,60 Q75,45 150,50 T300,40" 
                stroke="url(#glucoseGradient)" 
                strokeWidth="3" 
                fill="none"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="glucoseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Time in Range', value: '78%', color: 'text-green-500', bg: 'bg-green-100' },
            { label: 'Avg Glucose', value: '156', color: 'text-blue-500', bg: 'bg-blue-100' },
            { label: 'Variability', value: 'Low', color: 'text-purple-500', bg: 'bg-purple-100' }
          ].map((stat, index) => (
            <div key={index} className={`p-3 rounded-2xl ${stat.bg} ${isDarkMode ? 'bg-opacity-20' : 'bg-opacity-50'} text-center transform hover:scale-110 transition-all duration-300`}>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className={`${theme.textSecondary} text-xs`}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className={`py-3 px-4 bg-gradient-to-r ${theme.primary} text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
            Calibrate CGM
          </button>
          <button className={`py-3 px-4 bg-gradient-to-r ${theme.accent} text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
            View History
          </button>
        </div>
      </div>
    </div>
  );

  const InsulinDashboard = () => (
    <div className={`${theme.card} rounded-3xl p-6 shadow-2xl border relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.secondary} opacity-5`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`${theme.textSecondary} text-sm font-medium uppercase tracking-wider`}>
              Insulin Management
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${theme.secondary} text-white`}>
                <Zap className="w-5 h-5" />
              </div>
              <span className={`text-2xl font-bold ${theme.text}`}>Smart Dosing</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
            <span className={`${theme.textSecondary} text-sm`}>Pen 78% full</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-2xl ${theme.card} border`}>
            <div className="flex items-center gap-2 mb-2">
              <Battery className={`w-4 h-4 ${theme.textSecondary}`} />
              <span className={`${theme.textSecondary} text-sm`}>Rapid Acting</span>
            </div>
            <div className={`text-2xl font-bold ${theme.text}`}>4.5u</div>
            <div className={`${theme.textSecondary} text-xs`}>Last: 2h ago</div>
          </div>
          <div className={`p-4 rounded-2xl ${theme.card} border`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-4 h-4 ${theme.textSecondary}`} />
              <span className={`${theme.textSecondary} text-sm`}>Long Acting</span>
            </div>
            <div className={`text-2xl font-bold ${theme.text}`}>22u</div>
            <div className={`${theme.textSecondary} text-xs`}>Next: 6h</div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl bg-gradient-to-r ${theme.accent} bg-opacity-10 border mb-4`}>
          <div className="flex items-center gap-3 mb-3">
            <Brain className={`w-6 h-6 ${theme.textSecondary}`} />
            <span className={`${theme.text} font-semibold`}>AI Recommendation</span>
          </div>
          <p className={`${theme.textSecondary} text-sm mb-3`}>
            Based on your current glucose (142 mg/dL) and planned meal (45g carbs), 
            recommend 6.2 units rapid-acting insulin.
          </p>
          <div className="flex gap-2">
            <button className={`px-4 py-2 bg-gradient-to-r ${theme.accent} text-white rounded-xl text-sm font-medium hover:scale-105 transition-all duration-300`}>
              Accept
            </button>
            <button className={`px-4 py-2 ${theme.card} border rounded-xl text-sm font-medium hover:scale-105 transition-all duration-300`}>
              Adjust
            </button>
          </div>
        </div>

        <button className={`w-full py-4 bg-gradient-to-r ${theme.secondary} text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Log Insulin Dose
          </div>
        </button>
      </div>
    </div>
  );

  const KetoneMonitor = () => (
    <div className={`${theme.card} rounded-3xl p-6 shadow-2xl border relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.accent} opacity-5`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`${theme.textSecondary} text-sm font-medium uppercase tracking-wider`}>
              Ketone Monitoring
            </h3>
            <div className="flex items-end gap-2 mt-2">
              <span className={`text-4xl font-bold ${ketoneValue < 0.6 ? 'text-green-500' : ketoneValue < 1.5 ? 'text-yellow-500' : 'text-red-500'}`}>
                {ketoneValue}
              </span>
              <span className={`${theme.textSecondary} text-lg mb-1`}>mmol/L</span>
            </div>
          </div>
          <div className={`p-4 rounded-3xl ${ketoneValue < 0.6 ? 'bg-green-500' : ketoneValue < 1.5 ? 'bg-yellow-500' : 'bg-red-500'} shadow-lg`}>
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className={`${theme.textSecondary} text-sm`}>Risk Level</span>
            <span className={`text-sm font-semibold ${ketoneValue < 0.6 ? 'text-green-500' : ketoneValue < 1.5 ? 'text-yellow-500' : 'text-red-500'}`}>
              {ketoneValue < 0.6 ? 'Normal' : ketoneValue < 1.5 ? 'Elevated' : 'High Risk'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                ketoneValue < 0.6 ? 'bg-green-500' : ketoneValue < 1.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min((ketoneValue / 3) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className={`p-4 rounded-2xl ${ketoneValue > 1.5 ? 'bg-red-100' : 'bg-blue-100'} ${isDarkMode ? 'bg-opacity-20' : 'bg-opacity-50'} mb-4`}>
          <p className={`${theme.text} text-sm font-medium`}>
            {ketoneValue < 0.6 
              ? '✓ Ketones are within normal range. Continue current management.'
              : ketoneValue < 1.5 
              ? '⚠ Ketones are elevated. Monitor closely and consider extra insulin.'
              : '🚨 High ketone levels detected. Contact healthcare provider immediately.'
            }
          </p>
        </div>

        <button className={`w-full py-3 bg-gradient-to-r ${theme.accent} text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          Test Ketones Now
        </button>
      </div>
    </div>
  );

  // Type 2 Components
  const MedicationTracker = () => (
    <div className={`${theme.card} rounded-3xl p-6 shadow-2xl border relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.primary} opacity-5`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`${theme.textSecondary} text-sm font-medium uppercase tracking-wider`}>
              Medication Adherence
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <div className={`text-4xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                94%
              </div>
              <span className={`${theme.textSecondary} text-lg`}>This week</span>
            </div>
          </div>
          <div className={`p-4 rounded-3xl bg-gradient-to-r ${theme.primary} shadow-lg`}>
            <Pill className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { name: 'Metformin', time: '8:00 AM', status: 'taken', next: '8:00 PM' },
            { name: 'Glipizide', time: '8:00 AM', status: 'taken', next: 'Tomorrow' },
            { name: 'Jardiance', time: '8:00 AM', status: 'taken', next: 'Tomorrow' }
          ].map((med, index) => (
            <div key={index} className={`p-4 rounded-2xl ${theme.card} border`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className={`${theme.text} font-semibold`}>{med.name}</div>
                  <div className={`${theme.textSecondary} text-sm`}>Last taken: {med.time}</div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="text-right">
                    <div className={`${theme.textSecondary} text-xs`}>Next dose</div>
                    <div className={`${theme.text} text-sm font-medium`}>{med.next}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={`w-full py-4 bg-gradient-to-r ${theme.primary} text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
          Set Reminder
        </button>
      </div>
    </div>
  );

  const LifestyleTracker = () => (
    <div className={`${theme.card} rounded-3xl p-6 shadow-2xl border relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.secondary} opacity-5`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`${theme.textSecondary} text-sm font-medium uppercase tracking-wider`}>
              Lifestyle Goals
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Dumbbell className={`w-6 h-6 ${theme.textSecondary}`} />
              <span className={`text-xl font-bold ${theme.text}`}>Today's Progress</span>
            </div>
          </div>
          <div className={`p-4 rounded-3xl bg-gradient-to-r ${theme.secondary} shadow-lg`}>
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-2xl ${theme.card} border text-center`}>
            <div className="relative w-16 h-16 mx-auto mb-3">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" 
                        className="text-gray-200" />
                <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" 
                        className={`bg-gradient-to-r ${theme.secondary} stroke-current`}
                        strokeDasharray="175.92" strokeDashoffset="52.78" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${theme.text}`}>8.2k</span>
              </div>
            </div>
            <div className={`${theme.text} font-semibold`}>Steps</div>
            <div className={`${theme.textSecondary} text-xs`}>Goal: 10k</div>
          </div>

          <div className={`p-4 rounded-2xl ${theme.card} border text-center`}>
            <div className="relative w-16 h-16 mx-auto mb-3">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" 
                        className="text-gray-200" />
                <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" 
                        className={`bg-gradient-to-r ${theme.accent} stroke-current`}
                        strokeDasharray="175.92" strokeDashoffset="87.96" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${theme.text}`}>45</span>
              </div>
            </div>
            <div className={`${theme.text} font-semibold`}>Exercise</div>
            <div className={`${theme.textSecondary} text-xs`}>Goal: 90 min</div>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Water Intake', value: '6/8 glasses', progress: 75 },
            { label: 'Sleep Quality', value: '7.5 hours', progress: 88 },
            { label: 'Stress Level', value: 'Low', progress: 90 }
          ].map((metric, index) => (
            <div key={index} className={`p-3 rounded-xl ${theme.card} border`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`${theme.text} text-sm font-medium`}>{metric.label}</span>
                <span className={`${theme.textSecondary} text-sm`}>{metric.value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-full bg-gradient-to-r ${theme.accent} rounded-full transition-all duration-1000`}
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Metabolic Syndrome Components
  const ComprehensiveMetrics = () => (
    <div className={`${theme.card} rounded-3xl p-6 shadow-2xl border relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.primary} opacity-5`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`${theme.textSecondary} text-sm font-medium uppercase tracking-wider`}>
              Metabolic Health Score
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" 
                          className="text-gray-200" />
                  <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" 
                          className={`bg-gradient-to-r ${theme.primary} stroke-current`}
                          strokeDasharray="175.92" strokeDashoffset="35.18" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent`}>
                    82
                  </span>
                </div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${theme.text}`}>Good</div>
                <div className={`${theme.textSecondary} text-sm`}>Improving trend</div>
              </div>
            </div>
          </div>
          <div className={`p-4 rounded-3xl bg-gradient-to-r ${theme.primary} shadow-lg`}>
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Blood Pressure', value: '118/76', status: 'optimal', color: 'text-green-500' },
            { label: 'Cholesterol', value: '165 mg/dL', status: 'good', color: 'text-blue-500' },
            { label: 'Triglycerides', value: '98 mg/dL', status: 'normal', color: 'text-green-500' },
            { label: 'Waist Circumf.', value: '34 inches', status: 'target', color: 'text-purple-500' }
          ].map((metric, index) => (
            <div key={index} className={`p-3 rounded-2xl ${theme.card} border text-center`}>
              <div className={`text-sm font-bold ${metric.color}`}>{metric.value}</div>
              <div className={`${theme.textSecondary} text-xs`}>{metric.label}</div>
              <div className={`text-xs ${metric.color} capitalize`}>{metric.status}</div>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-2xl bg-gradient-to-r ${theme.accent} bg-opacity-10 border`}>
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className={`${theme.text} font-semibold`}>Achievement Unlocked!</span>
          </div>
          <p className={`${theme.textSecondary} text-sm`}>
            You've maintained healthy blood pressure for 30 days straight!
          </p>
        </div>
      </div>
    </div>
  );

  const RiskFactorMonitor = () => (
    <div className={`${theme.card} rounded-3xl p-6 shadow-2xl border relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${theme.secondary} opacity-5`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className={`${theme.textSecondary} text-sm font-medium uppercase tracking-wider`}>
              Risk Factor Analysis
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Shield className={`w-6 h-6 ${theme.textSecondary}`} />
              <span className={`text-xl font-bold ${theme.text}`}>Low Risk Profile</span>
            </div>
          </div>
          <div className={`p-4 rounded-3xl bg-gradient-to-r ${theme.secondary} shadow-lg`}>
            <Eye className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          {[
            { 
              factor: 'Cardiovascular Risk', 
              level: 'Low', 
              percentage: 15, 
              color: 'text-green-500',
              bg: 'bg-green-100',
              trend: '↓ Improving'
            },
            { 
              factor: 'Diabetes Progression', 
              level: 'Moderate', 
              percentage: 35, 
              color: 'text-yellow-500',
              bg: 'bg-yellow-100',
              trend: '→ Stable'
            },
            { 
              factor: 'Stroke Risk', 
              level: 'Low', 
              percentage: 20, 
              color: 'text-green-500',
              bg: 'bg-green-100',
              trend: '↓ Improving'
            }
          ].map((risk, index) => (
            <div key={index} className={`p-4 rounded-2xl ${theme.card} border`}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className={`${theme.text} font-semibold`}>{risk.factor}</div>
                  <div className={`${risk.color} text-sm font-medium`}>{risk.level} Risk</div>
                </div>
                <div className="text-right">
                  <div className={`${theme.text} text-lg font-bold`}>{risk.percentage}%</div>
                  <div className={`${theme.textSecondary} text-xs`}>{risk.trend}</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    risk.level === 'Low' ? 'bg-green-500' : 
                    risk.level === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${risk.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Enhanced Navigation with animations
  const NavigationBar = () => {
    const getNavigationItems = () => {
      switch(currentType) {
        case 'type1':
          return [
            { icon: Home, label: 'Dashboard', view: 'dashboard' },
            { icon: Droplets, label: 'CGM', view: 'cgm' },
            { icon: Zap, label: 'Insulin', view: 'insulin' },
            { icon: AlertTriangle, label: 'Ketones', view: 'ketones' },
            { icon: User, label: 'Profile', view: 'profile' }
          ];
        case 'type2':
          return [
            { icon: Home, label: 'Dashboard', view: 'dashboard' },
            { icon: Pill, label: 'Meds', view: 'medications' },
            { icon: Activity, label: 'Lifestyle', view: 'lifestyle' },
            { icon: BarChart3, label: 'Progress', view: 'progress' },
            { icon: User, label: 'Profile', view: 'profile' }
          ];
        case 'metabolic':
          return [
            { icon: Home, label: 'Dashboard', view: 'dashboard' },
            { icon: Heart, label: 'Metrics', view: 'metrics' },
            { icon: Shield, label: 'Risk', view: 'risk' },
            { icon: Target, label: 'Goals', view: 'goals' },
            { icon: User, label: 'Profile', view: 'profile' }
          ];
        default:
          return [];
      }
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent">
        <div className={`${theme.card} rounded-3xl shadow-2xl border backdrop-blur-xl mx-auto max-w-md`}>
          <div className="flex justify-around items-center p-2">
            {getNavigationItems().map((tab, index) => (
              <button
                key={tab.view}
                onClick={() => handleViewChange(tab.view)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-500 transform ${
                  tab.view === currentView 
                    ? `bg-gradient-to-r ${theme.primary} shadow-xl scale-110 -translate-y-1` 
                    : 'hover:bg-gray-100 hover:scale-105'
                } ${isDarkMode && tab.view !== currentView ? 'hover:bg-gray-700' : ''}`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <tab.icon className={`w-5 h-5 transition-all duration-300 ${
                  tab.view === currentView ? 'text-white' : theme.textSecondary
                }`} />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  tab.view === currentView ? 'text-white' : theme.textSecondary
                }`}>
                  {tab.label}
                </span>
                {tab.view === currentView && (
                  <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const content = (() => {
      switch(currentType) {
        case 'type1':
          switch(currentView) {
            case 'dashboard':
            case 'cgm':
              return (
                <div className="space-y-6">
                  <CGMHeroCard />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InsulinDashboard />
                    <KetoneMonitor />
                  </div>
                </div>
              );
            case 'insulin':
              return <InsulinDashboard />;
            case 'ketones':
              return <KetoneMonitor />;
            default:
              return <CGMHeroCard />;
          }
        case 'type2':
          switch(currentView) {
            case 'dashboard':
            case 'medications':
              return (
                <div className="space-y-6">
                  <MedicationTracker />
                  <LifestyleTracker />
                </div>
              );
            case 'lifestyle':
              return <LifestyleTracker />;
            default:
              return <MedicationTracker />;
          }
        case 'metabolic':
          switch(currentView) {
            case 'dashboard':
            case 'metrics':
              return (
                <div className="space-y-6">
                  <ComprehensiveMetrics />
                  <RiskFactorMonitor />
                </div>
              );
            case 'risk':
              return <RiskFactorMonitor />;
            default:
              return <ComprehensiveMetrics />;
          }
        default:
          return <CGMHeroCard />;
      }
    })();

    return (
      <div className={`transition-all duration-500 transform ${
        isAnimating ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
      }`}>
        {content}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.background} transition-all duration-700`}>
      {/* Enhanced Header */}
      <div className="p-6 pb-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-4xl font-bold ${theme.text} mb-2`}>
              {currentType === 'type1' ? 'Type 1 Management' :
               currentType === 'type2' ? 'Type 2 Care' :
               'Metabolic Health'}
            </h1>
            <p className={`${theme.textSecondary} text-lg`}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Diabetes Type Selector */}
            <div className="relative">
              <select 
                value={currentType}
                onChange={(e) => setCurrentType(e.target.value)}
                className={`${theme.card} border rounded-2xl px-4 py-3 ${theme.text} appearance-none cursor-pointer text-sm font-medium shadow-lg backdrop-blur-xl`}
              >
                <option value="type1">Type 1 Diabetes</option>
                <option value="type2">Type 2 Diabetes</option>
                <option value="metabolic">Metabolic Syndrome</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textSecondary} pointer-events-none`} />
            </div>

            {/* Theme Selector */}
            <div className="relative">
              <select 
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                className={`${theme.card} border rounded-2xl px-4 py-3 ${theme.text} appearance-none cursor-pointer text-sm font-medium shadow-lg backdrop-blur-xl`}
              >
                {Object.entries(themes).map(([key, themeObj]) => (
                  <option key={key} value={key}>{themeObj.name}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textSecondary} pointer-events-none`} />
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-2xl ${theme.card} border shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 backdrop-blur-xl`}
            >
              <div className="relative">
                {isDarkMode ? 
                  <Sun className={`w-5 h-5 ${theme.textSecondary} transition-all duration-300`} /> : 
                  <Moon className={`w-5 h-5 ${theme.textSecondary} transition-all duration-300`} />
                }
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-32">
        {renderContent()}
      </div>

      {/* Enhanced Navigation */}
      <NavigationBar />
    </div>
  );
};

export default DiabetesManagementSystem;