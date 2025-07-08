import React, { useState, useEffect } from 'react';
import { Camera, Search, Scan, Sun, Moon, Star, Apple, ChefHat, TrendingUp, Award, Plus, Filter } from 'lucide-react';

const CrystalThemeUI = () => {
  const [isDark, setIsDark] = useState(false);
  const [glucoScore, setGlucoScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    glucose: 0,
    nutrition: 0,
    personal: 0
  });

  useEffect(() => {
    // Animated GlucoBalance score
    const timer = setTimeout(() => {
      if (glucoScore < 87) {
        setGlucoScore(prev => prev + 1);
        setScoreBreakdown(prev => ({
          glucose: Math.min(prev.glucose + 0.8, 75),
          nutrition: Math.min(prev.nutrition + 0.6, 65),
          personal: Math.min(prev.personal + 0.9, 90)
        }));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [glucoScore]);

  const theme = {
    light: {
      bg: 'linear-gradient(135deg, #ffeef8 0%, #e6f3ff 100%)',
      cardBg: 'rgba(255, 255, 255, 0.98)',
      textPrimary: '#2d3748',
      textSecondary: '#718096',
      accent: 'linear-gradient(135deg, #a8e6cf 0%, #ffd3a5 100%)',
      glucoGradient: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)',
      scoreGlow: '0 0 30px rgba(168, 230, 207, 0.3)',
      pristine: 'rgba(255, 238, 248, 0.9)',
    },
    dark: {
      bg: 'linear-gradient(135deg, #1a0a1a 0%, #0a1a2e 100%)',
      cardBg: 'rgba(26, 10, 26, 0.95)',
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.8)',
      accent: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
      glucoGradient: 'linear-gradient(135deg, #00cec9 0%, #0984e3 100%)',
      scoreGlow: '0 0 30px rgba(162, 155, 254, 0.4)',
      pristine: 'rgba(26, 10, 26, 0.9)',
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  const foodItems = [
    {
      name: 'Quinoa Bowl',
      image: '🥗',
      score: 92,
      category: 'Lunch',
      carbs: 45,
      protein: 12,
      fiber: 8,
      trend: 'excellent'
    },
    {
      name: 'Greek Yogurt',
      image: '🥛',
      score: 88,
      category: 'Snack',
      carbs: 15,
      protein: 20,
      fiber: 2,
      trend: 'great'
    },
    {
      name: 'Salmon Fillet',
      image: '🐟',
      score: 95,
      category: 'Dinner',
      carbs: 2,
      protein: 35,
      fiber: 0,
      trend: 'excellent'
    }
  ];

  return (
    <div 
      className="min-h-screen transition-all duration-700"
      style={{ background: currentTheme.bg }}
    >
      {/* Floating Sparkles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            <Star 
              className="w-2 h-2 text-pink-300 animate-pulse" 
              style={{ animationDuration: `${2 + Math.random() * 2}s` }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20"
            style={{ background: currentTheme.cardBg }}
          >
            <ChefHat className="w-6 h-6" style={{ color: currentTheme.textPrimary }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: currentTheme.textPrimary }}>
              GlucoBalance™
            </h1>
            <p className="text-sm opacity-80" style={{ color: currentTheme.textSecondary }}>
              Smart food scoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-3 rounded-full backdrop-blur-xl border border-white/20 transition-all duration-300 hover:scale-110" style={{ background: currentTheme.cardBg }}>
            <Filter className="w-5 h-5" style={{ color: currentTheme.textPrimary }} />
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
        {/* GlucoBalance Hero Card */}
        <div 
          className="relative p-8 rounded-3xl backdrop-blur-xl border border-white/20 overflow-hidden transition-all duration-500"
          style={{ 
            background: currentTheme.cardBg,
            boxShadow: currentTheme.scoreGlow
          }}
        >
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="crystalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a8e6cf" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#ffd3a5" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <circle cx="100" cy="60" r="40" fill="url(#crystalGradient)" className="animate-pulse" />
              <circle cx="300" cy="120" r="30" fill="url(#crystalGradient)" className="animate-bounce" />
              <circle cx="200" cy="80" r="20" fill="url(#crystalGradient)" className="animate-ping" />
            </svg>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: currentTheme.textPrimary }}>
                Your Meal Score
              </h2>
              <p className="text-sm opacity-70" style={{ color: currentTheme.textSecondary }}>
                Personalized for your metabolism
              </p>
            </div>
            
            {/* Score Visualization */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(glucoScore / 100) * 439.6} 439.6`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#81ecec"/>
                    <stop offset="100%" stopColor="#74b9ff"/>
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div 
                  className="text-4xl font-bold mb-1"
                  style={{ 
                    color: currentTheme.textPrimary,
                    textShadow: '0 0 20px rgba(129, 236, 236, 0.3)'
                  }}
                >
                  {glucoScore}
                </div>
                <div className="text-sm opacity-60" style={{ color: currentTheme.textSecondary }}>
                  Excellent
                </div>
              </div>
            </div>
            
            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Glucose Impact', value: Math.round(scoreBreakdown.glucose), color: '#74b9ff' },
                { label: 'Nutrition Density', value: Math.round(scoreBreakdown.nutrition), color: '#a8e6cf' },
                { label: 'Personal Fit', value: Math.round(scoreBreakdown.personal), color: '#ffd3a5' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: item.color + '20' }}
                  >
                    <span className="text-lg font-bold" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: currentTheme.textSecondary }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Food Logging Quick Actions */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.textPrimary }}>
            Log Your Food
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Camera, label: 'Photo', color: '#74b9ff', description: 'Snap & analyze' },
              { icon: Search, label: 'Search', color: '#a8e6cf', description: 'Find foods' },
              { icon: Scan, label: 'Barcode', color: '#ffd3a5', description: 'Scan package' }
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ 
                  background: action.color + '10',
                  border: `1px solid ${action.color}20`
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: action.color + '20' }}
                >
                  <action.icon className="w-6 h-6" style={{ color: action.color }} />
                </div>
                <h4 className="font-semibold mb-1" style={{ color: currentTheme.textPrimary }}>
                  {action.label}
                </h4>
                <p className="text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                  {action.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Foods */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
              Recent Foods
            </h3>
            <button 
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ 
                background: currentTheme.accent,
                color: 'white'
              }}
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {foodItems.map((food, index) => (
              <div 
                key={index}
                className="flex items-center space-x-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                <div className="text-3xl">{food.image}</div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h4 className="font-semibold" style={{ color: currentTheme.textPrimary }}>
                      {food.name}
                    </h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {food.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs" style={{ color: currentTheme.textSecondary }}>
                    <span>Carbs: {food.carbs}g</span>
                    <span>Protein: {food.protein}g</span>
                    <span>Fiber: {food.fiber}g</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ 
                      color: food.score >= 90 ? '#22c55e' : food.score >= 80 ? '#eab308' : '#ef4444'
                    }}
                  >
                    {food.score}
                  </div>
                  <div className="text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                    Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Summary */}
        <div 
          className="p-6 rounded-3xl backdrop-blur-xl border border-white/20 transition-all duration-500"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: currentTheme.accent }}
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: currentTheme.textPrimary }}>
              Today's Nutrition
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { label: 'Average Score', value: '89', target: '85+', progress: 95 },
                { label: 'Meals Logged', value: '3', target: '3', progress: 100 }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm" style={{ color: currentTheme.textSecondary }}>
                      {stat.label}
                    </span>
                    <span className="text-sm font-medium" style={{ color: currentTheme.textPrimary }}>
                      {stat.value} / {stat.target}
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        background: currentTheme.glucoGradient,
                        width: `${stat.progress}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col justify-center items-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ background: currentTheme.accent }}
              >
                <Award className="w-8 h-8 text-white" />
              </div>
              <p className="text-center text-sm font-medium" style={{ color: currentTheme.textPrimary }}>
                Daily Goal
              </p>
              <p className="text-center text-xs opacity-60" style={{ color: currentTheme.textSecondary }}>
                Achieved!
              </p>
            </div>
          </div>
        </div>

        {/* Add Food Button */}
        <div className="flex justify-center">
          <button 
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            style={{ 
              background: currentTheme.accent,
              boxShadow: currentTheme.scoreGlow
            }}
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Bottom Navigation */}
        <div 
          className="fixed bottom-6 left-6 right-6 p-4 rounded-3xl backdrop-blur-xl border border-white/20"
          style={{ background: currentTheme.cardBg }}
        >
          <div className="flex justify-around">
            {[
              { icon: ChefHat, label: 'Foods', active: true },
              { icon: Camera, label: 'Log' },
              { icon: Star, label: 'Favorites' },
              { icon: TrendingUp, label: 'Trends' },
              { icon: Apple, label: 'Recipes' }
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

export default CrystalThemeUI;