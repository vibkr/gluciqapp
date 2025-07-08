import React, { useState, useEffect } from 'react';
import { 
  Home, Target, Activity, Users, Gift, Trophy, Zap, Flame, Star, Crown,
  Search, Plus, Calculator, Settings, User, Camera, Bell, Download,
  ChevronRight, ChevronLeft, Check, X, Info, AlertTriangle
} from 'lucide-react';

// Design System Theme
const theme = {
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    legendary: 'linear-gradient(135deg, #FFD700 0%, #FFA000 25%, #FF6B35 50%, #E91E63 75%, #9C27B0 100%)',
    epic: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
    rare: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
    common: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
    streakFire: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    xpEnergy: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
    levelProgression: 'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)',
    achievementGlow: 'linear-gradient(135deg, #FFEAA7 0%, #FAB1A0 100%)',
    healthExcellent: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    healthGood: 'linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)',
    healthWarning: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
    healthCritical: 'linear-gradient(135deg, #e17055 0%, #d63031 100%)',
    bgCosmic: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
  },
  glass: {
    ultraLight: 'rgba(255, 255, 255, 0.05)',
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    strong: 'rgba(255, 255, 255, 0.25)',
    ultraStrong: 'rgba(255, 255, 255, 0.35)',
  },
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.8)',
    tertiary: 'rgba(255, 255, 255, 0.6)',
    quaternary: 'rgba(255, 255, 255, 0.4)',
    disabled: 'rgba(255, 255, 255, 0.3)',
  },
  borderGlow: 'rgba(255, 255, 255, 0.2)',
  borderFocus: 'rgba(0, 201, 255, 0.6)',
  shadowCosmic: '0 8px 32px rgba(31, 38, 135, 0.37)',
  shadowElevated: '0 12px 40px rgba(255, 255, 255, 0.1)',
  shadowLegendary: '0 8px 30px rgba(255, 215, 0, 0.4)',
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    xxxxl: '40px',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    xxl: '20px',
    xxxl: '24px',
    xxxxl: '32px',
    full: '9999px',
  }
};

// Cosmic Background Component
const CosmicBackground = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 8,
  }));

  return (
    <div className="cosmic-bg">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="achievement-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Dashboard Screen Component
const DashboardScreen = ({ player, onCelebrate }) => {
  const [quests, setQuests] = useState([
    {
      id: 'hydration',
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water',
      icon: '💧',
      progress: 100,
      completed: true,
      reward: '50',
      rewardType: 'XP',
    },
    {
      id: 'glucose',
      title: 'Glucose Guardian',
      description: 'Stay in range for 4+ hours',
      icon: '📊',
      progress: 100,
      completed: true,
      reward: '75',
      rewardType: 'XP',
    },
    {
      id: 'steps',
      title: 'Step Master Challenge',
      description: 'Walk 10,000 steps today',
      icon: '🚶',
      progress: 84,
      completed: false,
      reward: '75',
      rewardType: 'XP',
      rarity: 'legendary',
    },
    {
      id: 'meal',
      title: 'Mindful Eating',
      description: 'Log meals with mindfulness',
      icon: '🧘',
      progress: 67,
      completed: false,
      reward: '100',
      rewardType: 'XP',
    },
  ]);

  const healthData = {
    glucoseValue: 142,
    trendIcon: '↗️',
    trendText: 'Stable rising',
    scoreLabel: 'Excellent',
    scoreBadge: 'Good',
    score: 7.2,
    scorePercentage: 72,
  };

  const achievement = {
    title: 'Quest Complete!',
    description: '14-day streak achievement unlocked',
    reward: '+250 XP',
  };

  const achievements = [
    { type: 'streak', icon: <Flame size={24} />, value: 14, label: 'Day Streak' },
    { type: 'xp', icon: <Star size={24} />, value: '12,450', label: 'Total XP' },
  ];

  const leaderboard = [
    { name: 'Sarah M.', streak: 21, score: 18520 },
    { name: 'Mike R.', streak: 18, score: 16890 },
    { name: 'You (Jordan)', streak: 14, score: 12450 },
    { name: 'Alex P.', streak: 12, score: 11230 },
  ];

  const handleQuestClick = (questId) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId && !quest.completed
        ? { ...quest, progress: Math.min(100, quest.progress + 10) }
        : quest
    ));
  };

  return (
    <div className="screen-content">
      {/* Player Profile Header */}
      <div className="player-profile">
        <div className="player-avatar">
          <Trophy size={24} />
          <div className="player-rank">{player.rank}</div>
        </div>
        <div className="player-info">
          <div className="player-name">{player.name}</div>
          <div className="player-title">{player.title}</div>
          <div className="level-progress">
            <div className="level-bar">
              <div className="level-fill" style={{ width: `${player.levelProgress}%` }}>
                <div className="level-shimmer" />
              </div>
            </div>
            <div className="level-text">
              <span>Level {player.level} → Level {player.level + 1}</span>
              <div className="xp-display">{player.xp.toLocaleString()} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="achievement-banner" onClick={onCelebrate}>
        <div className="achievement-shimmer" />
        <div className="banner-content">
          <div className="banner-icon">🎯</div>
          <div className="banner-text">
            <div className="banner-title">{achievement.title}</div>
            <div className="banner-description">{achievement.description}</div>
          </div>
          <div className="banner-reward">{achievement.reward}</div>
        </div>
      </div>

      {/* Health Hero Card */}
      <div className="health-hero">
        <div className="hero-rotation" />
        <div className="hero-content">
          <div className="hero-header">
            <div className="hero-title">
              <Zap size={18} className="hero-icon" />
              Health Power Level
            </div>
            <div className="health-score">{healthData.scoreLabel}</div>
          </div>
          
          <div className="glucose-display">
            <div className="glucose-value">{healthData.glucoseValue}</div>
            <div className="glucose-trend">
              <span>{healthData.trendIcon}</span>
              <span>{healthData.trendText}</span>
            </div>
          </div>
          
          <div className="glucobalance-score">
            <div className="score-header">
              <div className="score-title">GlucoBalance™ Score</div>
              <div className="score-badge">{healthData.scoreBadge}</div>
            </div>
            <div className="score-circle">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4"/>
                <circle 
                  cx="30" cy="30" r="25" fill="none" stroke="url(#scoreGradient)" strokeWidth="4" 
                  strokeDasharray="157" strokeDashoffset={157 - (157 * healthData.scorePercentage / 100)} 
                  strokeLinecap="round" transform="rotate(-90 30 30)"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00C9FF"/>
                    <stop offset="100%" stopColor="#92FE9D"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="score-value">{healthData.score}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="daily-quests">
        <div className="quests-header">
          <div className="quests-title">🎮 Daily Quests</div>
          <div className="quests-progress">
            {quests.filter(q => q.completed).length}/{quests.length} Complete
          </div>
        </div>
        {quests.map(quest => (
          <div 
            key={quest.id}
            className={`quest-item ${quest.completed ? 'completed' : ''}`}
            onClick={() => handleQuestClick(quest.id)}
          >
            <div className={`quest-icon ${quest.rarity || ''}`}>
              {quest.icon}
            </div>
            <div className="quest-content">
              <div className="quest-title">{quest.title}</div>
              <div className="quest-description">{quest.description}</div>
              <div className="quest-progress-bar">
                <div className="quest-progress-fill" style={{ width: `${quest.progress}%` }} />
              </div>
            </div>
            <div className="quest-reward">
              <div className="reward-value">{quest.completed ? '✓' : quest.reward}</div>
              <div className="reward-type">{quest.completed ? 'Complete' : quest.rewardType}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <div key={index} className={`achievement-card ${achievement.type}`}>
            {achievement.type === 'streak' && <div className="streak-indicator" />}
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-value">{achievement.value}</div>
            <div className="achievement-label">{achievement.label}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard Preview */}
      <div className="leaderboard-preview">
        <div className="leaderboard-header">
          <div className="leaderboard-title">🏆 Weekly Champions</div>
          <div className="view-all">View All</div>
        </div>
        {leaderboard.map((user, index) => (
          <div
            key={index}
            className={`leaderboard-item ${user.name.includes('You') ? 'current-user' : ''}`}
          >
            <div className={`rank-badge ${index < 3 ? ['first', 'second', 'third'][index] : ''}`}>
              {index + 1 === 1 ? <Crown size={16} /> : 
               index + 1 === 2 ? <Star size={16} /> : 
               index + 1 === 3 ? <Trophy size={16} /> : index + 1}
            </div>
            <div className="leaderboard-user">
              <div className="user-name">{user.name}</div>
              <div className="user-streak">{user.streak}-day streak</div>
            </div>
            <div className="user-score">{user.score.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Food Logging Screen Component
const FoodLoggingScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [recentFoods] = useState([
    { id: 1, name: 'Greek Yogurt', carbs: 12, calories: 100, icon: '🥛' },
    { id: 2, name: 'Banana', carbs: 27, calories: 105, icon: '🍌' },
    { id: 3, name: 'Oatmeal', carbs: 54, calories: 150, icon: '🥣' },
    { id: 4, name: 'Apple', carbs: 25, calories: 95, icon: '🍎' },
  ]);

  const [quickAddFoods] = useState([
    { id: 1, name: 'Water', carbs: 0, calories: 0, icon: '💧' },
    { id: 2, name: 'Coffee', carbs: 2, calories: 5, icon: '☕' },
    { id: 3, name: 'Salad', carbs: 15, calories: 50, icon: '🥗' },
    { id: 4, name: 'Protein Bar', carbs: 20, calories: 200, icon: '🍫' },
  ]);

  const [loggedFoods, setLoggedFoods] = useState([
    { id: 1, name: 'Greek Yogurt', carbs: 12, calories: 100, meal: 'breakfast', time: '8:30 AM' },
    { id: 2, name: 'Banana', carbs: 27, calories: 105, meal: 'breakfast', time: '8:32 AM' },
  ]);

  const meals = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅' },
    { id: 'lunch', name: 'Lunch', icon: '☀️' },
    { id: 'dinner', name: 'Dinner', icon: '🌙' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' },
  ];

  const addFood = (food) => {
    const newEntry = {
      ...food,
      id: Date.now(),
      meal: selectedMeal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLoggedFoods(prev => [...prev, newEntry]);
  };

  const removeFood = (id) => {
    setLoggedFoods(prev => prev.filter(food => food.id !== id));
  };

  const getTotalNutrition = (meal) => {
    const mealFoods = loggedFoods.filter(food => food.meal === meal);
    return {
      carbs: mealFoods.reduce((sum, food) => sum + food.carbs, 0),
      calories: mealFoods.reduce((sum, food) => sum + food.calories, 0),
    };
  };

  return (
    <div className="screen-content">
      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title">🍽️ Food Logging</h1>
        <div className="xp-badge">+15 XP per log</div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Meal Selector */}
      <div className="meal-selector">
        {meals.map(meal => (
          <button
            key={meal.id}
            className={`meal-button ${selectedMeal === meal.id ? 'active' : ''}`}
            onClick={() => setSelectedMeal(meal.id)}
          >
            <span className="meal-icon">{meal.icon}</span>
            <span className="meal-name">{meal.name}</span>
            {loggedFoods.some(food => food.meal === meal.id) && (
              <div className="meal-indicator" />
            )}
          </button>
        ))}
      </div>

      {/* Current Meal Summary */}
      <div className="meal-summary">
        <div className="summary-header">
          <h3>{meals.find(m => m.id === selectedMeal)?.name} Summary</h3>
          <div className="summary-badge">
            {loggedFoods.filter(food => food.meal === selectedMeal).length} items
          </div>
        </div>
        <div className="nutrition-grid">
          <div className="nutrition-item">
            <div className="nutrition-value">{getTotalNutrition(selectedMeal).carbs}g</div>
            <div className="nutrition-label">Carbs</div>
          </div>
          <div className="nutrition-item">
            <div className="nutrition-value">{getTotalNutrition(selectedMeal).calories}</div>
            <div className="nutrition-label">Calories</div>
          </div>
        </div>
      </div>

      {/* Quick Add Foods */}
      <div className="food-section">
        <h3 className="section-title">⚡ Quick Add</h3>
        <div className="food-grid">
          {quickAddFoods.map(food => (
            <div key={food.id} className="food-item quick-add" onClick={() => addFood(food)}>
              <div className="food-icon">{food.icon}</div>
              <div className="food-name">{food.name}</div>
              <div className="food-nutrition">{food.carbs}g carbs</div>
              <Plus size={16} className="add-icon" />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Foods */}
      <div className="food-section">
        <h3 className="section-title">🕒 Recent Foods</h3>
        <div className="food-list">
          {recentFoods.map(food => (
            <div key={food.id} className="food-item-row" onClick={() => addFood(food)}>
              <div className="food-icon">{food.icon}</div>
              <div className="food-details">
                <div className="food-name">{food.name}</div>
                <div className="food-nutrition">{food.carbs}g carbs • {food.calories} cal</div>
              </div>
              <Plus size={20} className="add-icon" />
            </div>
          ))}
        </div>
      </div>

      {/* Logged Foods */}
      {loggedFoods.filter(food => food.meal === selectedMeal).length > 0 && (
        <div className="food-section">
          <h3 className="section-title">📝 Logged for {meals.find(m => m.id === selectedMeal)?.name}</h3>
          <div className="logged-foods">
            {loggedFoods
              .filter(food => food.meal === selectedMeal)
              .map(food => (
                <div key={food.id} className="logged-food-item">
                  <div className="food-icon">{food.icon}</div>
                  <div className="food-details">
                    <div className="food-name">{food.name}</div>
                    <div className="food-nutrition">{food.carbs}g carbs • {food.calories} cal</div>
                    <div className="food-time">{food.time}</div>
                  </div>
                  <button className="remove-button" onClick={() => removeFood(food.id)}>
                    <X size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Insulin Calculator Screen Component
const InsulinCalculatorScreen = () => {
  const [currentBG, setCurrentBG] = useState('');
  const [targetBG, setTargetBG] = useState('120');
  const [carbGrams, setCarbGrams] = useState('');
  const [correctionFactor, setCorrectionFactor] = useState('50');
  const [carbRatio, setCarbRatio] = useState('15');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([
    { id: 1, time: '2:30 PM', bg: 180, carbs: 45, insulin: 4.5, type: 'meal' },
    { id: 2, time: '10:15 AM', bg: 160, carbs: 0, insulin: 0.8, type: 'correction' },
    { id: 3, time: '7:45 AM', bg: 95, carbs: 60, insulin: 4.0, type: 'meal' },
  ]);

  const calculateInsulin = () => {
    const bg = parseFloat(currentBG);
    const target = parseFloat(targetBG);
    const carbs = parseFloat(carbGrams) || 0;
    const cf = parseFloat(correctionFactor);
    const cr = parseFloat(carbRatio);

    if (!bg || !cf || !cr) return;

    const correctionDose = Math.max(0, (bg - target) / cf);
    const mealDose = carbs / cr;
    const totalDose = correctionDose + mealDose;

    const newResult = {
      correctionDose: correctionDose.toFixed(1),
      mealDose: mealDose.toFixed(1),
      totalDose: totalDose.toFixed(1),
      bg,
      carbs,
      target,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setResult(newResult);

    // Add to history
    if (totalDose > 0) {
      const historyEntry = {
        id: Date.now(),
        time: newResult.timestamp,
        bg,
        carbs,
        insulin: parseFloat(newResult.totalDose),
        type: carbs > 0 ? 'meal' : 'correction'
      };
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
    }
  };

  const getBGStatus = (bg) => {
    if (bg < 70) return { status: 'critical', color: 'var(--gradient-health-critical)' };
    if (bg < 80) return { status: 'low', color: 'var(--gradient-health-warning)' };
    if (bg <= 180) return { status: 'good', color: 'var(--gradient-health-good)' };
    if (bg <= 250) return { status: 'high', color: 'var(--gradient-health-warning)' };
    return { status: 'critical', color: 'var(--gradient-health-critical)' };
  };

  return (
    <div className="screen-content">
      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title">🧮 Insulin Calculator</h1>
        <div className="safety-badge">
          <AlertTriangle size={16} />
          Always consult your doctor
        </div>
      </div>

      {/* Calculator Form */}
      <div className="calculator-card">
        <h3 className="card-title">Calculate Dosage</h3>
        
        <div className="form-group">
          <label className="form-label">Current Blood Glucose (mg/dL)</label>
          <input
            type="number"
            placeholder="Enter current BG"
            value={currentBG}
            onChange={(e) => setCurrentBG(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Target BG</label>
            <input
              type="number"
              placeholder="120"
              value={targetBG}
              onChange={(e) => setTargetBG(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Carbs (g)</label>
            <input
              type="number"
              placeholder="0"
              value={carbGrams}
              onChange={(e) => setCarbGrams(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Correction Factor</label>
            <input
              type="number"
              placeholder="50"
              value={correctionFactor}
              onChange={(e) => setCorrectionFactor(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Carb Ratio</label>
            <input
              type="number"
              placeholder="15"
              value={carbRatio}
              onChange={(e) => setCarbRatio(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <button className="calculate-button" onClick={calculateInsulin}>
          <Calculator size={20} />
          Calculate Insulin
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="result-card">
          <div className="result-header">
            <h3 className="card-title">Recommended Dosage</h3>
            <div className="result-time">{result.timestamp}</div>
          </div>
          
          <div className="result-summary">
            <div className="total-dose" style={{ background: getBGStatus(result.bg).color }}>
              <div className="dose-value">{result.totalDose}</div>
              <div className="dose-label">Total Units</div>
            </div>
          </div>

          <div className="dose-breakdown">
            <div className="breakdown-item">
              <div className="breakdown-label">Correction Dose</div>
              <div className="breakdown-value">{result.correctionDose} units</div>
              <div className="breakdown-detail">
                ({result.bg} - {result.target}) ÷ {correctionFactor}
              </div>
            </div>
            <div className="breakdown-item">
              <div className="breakdown-label">Meal Dose</div>
              <div className="breakdown-value">{result.mealDose} units</div>
              <div className="breakdown-detail">
                {result.carbs}g ÷ {carbRatio}
              </div>
            </div>
          </div>

          {result.bg < 70 && (
            <div className="warning-alert">
              <AlertTriangle size={20} />
              <div>
                <div className="alert-title">Critical Low BG</div>
                <div className="alert-message">Treat hypoglycemia before taking insulin</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div className="history-section">
        <h3 className="section-title">📊 Recent Calculations</h3>
        <div className="history-list">
          {history.map(entry => (
            <div key={entry.id} className="history-item">
              <div className="history-icon">
                {entry.type === 'meal' ? '🍽️' : '🩸'}
              </div>
              <div className="history-details">
                <div className="history-main">
                  <span className="history-insulin">{entry.insulin} units</span>
                  <span className="history-bg">{entry.bg} mg/dL</span>
                </div>
                <div className="history-meta">
                  {entry.carbs > 0 && <span>{entry.carbs}g carbs • </span>}
                  <span>{entry.time}</span>
                </div>
              </div>
              <div className="history-type">{entry.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Settings Screen Component
const SettingsScreen = ({ player, setPlayer }) => {
  const [notifications, setNotifications] = useState({
    bgAlerts: true,
    mealReminders: true,
    achievementUpdates: true,
    weeklyReports: false,
  });

  const [targets, setTargets] = useState({
    minBG: '70',
    maxBG: '180',
    a1cGoal: '7.0',
    dailyCarbs: '150',
  });

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first quest', icon: '👶', earned: true },
    { id: 2, name: 'Streak Master', description: '7-day logging streak', icon: '🔥', earned: true },
    { id: 3, name: 'Glucose Guardian', description: '24 hours in range', icon: '🛡️', earned: true },
    { id: 4, name: 'Hydration Hero', description: 'Log 8 glasses of water', icon: '💧', earned: true },
    { id: 5, name: 'Perfect Week', description: 'All goals met for 7 days', icon: '⭐', earned: false },
    { id: 6, name: 'Level Up!', description: 'Reach level 15', icon: '🚀', earned: false },
  ];

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateTarget = (key, value) => {
    setTargets(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="screen-content">
      {/* Header */}
      <div className="screen-header">
        <h1 className="screen-title">⚙️ Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="settings-section">
        <h3 className="section-title">👤 Profile</h3>
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              <Trophy size={32} />
              <div className="profile-level">Lv.{player.level}</div>
            </div>
            <div className="profile-info">
              <div className="profile-name">{player.name}</div>
              <div className="profile-title">{player.title}</div>
              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{player.xp.toLocaleString()}</span>
                  <span className="stat-label">Total XP</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">#{player.rank}</span>
                  <span className="stat-label">Global Rank</span>
                </div>
              </div>
            </div>
            <button className="edit-profile-btn">
              <User size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Health Targets */}
      <div className="settings-section">
        <h3 className="section-title">🎯 Health Targets</h3>
        <div className="targets-card">
          <div className="target-row">
            <div className="target-label">Blood Glucose Range</div>
            <div className="target-inputs">
              <input
                type="number"
                value={targets.minBG}
                onChange={(e) => updateTarget('minBG', e.target.value)}
                className="target-input"
                placeholder="Min"
              />
              <span className="target-separator">-</span>
              <input
                type="number"
                value={targets.maxBG}
                onChange={(e) => updateTarget('maxBG', e.target.value)}
                className="target-input"
                placeholder="Max"
              />
              <span className="target-unit">mg/dL</span>
            </div>
          </div>
          <div className="target-row">
            <div className="target-label">A1C Goal</div>
            <div className="target-inputs">
              <input
                type="number"
                value={targets.a1cGoal}
                onChange={(e) => updateTarget('a1cGoal', e.target.value)}
                className="target-input"
                step="0.1"
              />
              <span className="target-unit">%</span>
            </div>
          </div>
          <div className="target-row">
            <div className="target-label">Daily Carb Limit</div>
            <div className="target-inputs">
              <input
                type="number"
                value={targets.dailyCarbs}
                onChange={(e) => updateTarget('dailyCarbs', e.target.value)}
                className="target-input"
              />
              <span className="target-unit">grams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <h3 className="section-title">🔔 Notifications</h3>
        <div className="notifications-card">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="notification-row">
              <div className="notification-info">
                <div className="notification-name">
                  {key === 'bgAlerts' && 'Blood Glucose Alerts'}
                  {key === 'mealReminders' && 'Meal Reminders'}
                  {key === 'achievementUpdates' && 'Achievement Updates'}
                  {key === 'weeklyReports' && 'Weekly Reports'}
                </div>
                <div className="notification-description">
                  {key === 'bgAlerts' && 'Get notified when BG is out of range'}
                  {key === 'mealReminders' && 'Reminders to log meals and snacks'}
                  {key === 'achievementUpdates' && 'Celebrate your achievements'}
                  {key === 'weeklyReports' && 'Weekly health summary reports'}
                </div>
              </div>
              <button
                className={`toggle-switch ${value ? 'active' : ''}`}
                onClick={() => toggleNotification(key)}
              >
                <div className="toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Gallery */}
      <div className="settings-section">
        <h3 className="section-title">🏆 Achievement Gallery</h3>
        <div className="achievements-gallery">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`gallery-achievement ${achievement.earned ? 'earned' : ''}`}>
              <div className="achievement-icon-large">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-description">{achievement.description}</div>
              {achievement.earned && <div className="earned-badge">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="settings-section">
        <h3 className="section-title">📊 Data & Privacy</h3>
        <div className="data-actions">
          <button className="data-action-btn">
            <Download size={20} />
            <div>
              <div className="action-title">Export Data</div>
              <div className="action-description">Download your health data</div>
            </div>
            <ChevronRight size={20} />
          </button>
          <button className="data-action-btn">
            <Settings size={20} />
            <div>
              <div className="action-title">Privacy Settings</div>
              <div className="action-description">Manage data sharing preferences</div>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'food', icon: Target, label: 'Food' },
    { id: 'calculator', icon: Calculator, label: 'Insulin' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="bottom-nav">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <div
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={20} className="nav-icon" />
            <div className="nav-label">{tab.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// Main App Component
const HealthApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [player, setPlayer] = useState({
    name: 'Health Champion Jordan',
    title: 'Legendary Glucose Guardian',
    level: 12,
    levelProgress: 73,
    xp: 2340,
    rank: 47,
  });

  const celebrateAchievement = () => {
    console.log('🎉 Achievement celebration!');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardScreen player={player} onCelebrate={celebrateAchievement} />;
      case 'food':
        return <FoodLoggingScreen />;
      case 'calculator':
        return <InsulinCalculatorScreen />;
      case 'settings':
        return <SettingsScreen player={player} setPlayer={setPlayer} />;
      default:
        return <DashboardScreen player={player} onCelebrate={celebrateAchievement} />;
    }
  };

  return (
    <div className="mobile-container">
      <CosmicBackground />
      
      <div className="main-content">
        {renderActiveScreen()}
      </div>

      <div className="fab">
        <Trophy size={24} />
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <style jsx>{`
        .mobile-container {
          width: 390px;
          height: 844px;
          background: ${theme.gradients.bgCosmic};
          border-radius: 40px;
          overflow: hidden;
          box-shadow: ${theme.shadowCosmic};
          position: relative;
          display: flex;
          flex-direction: column;
          border: 2px solid ${theme.borderGlow};
          backdrop-filter: blur(20px);
          margin: 0 auto;
        }

        .cosmic-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.6;
        }

        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .achievement-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: ${theme.gradients.legendary};
          border-radius: 50%;
          animation: float-particle 8s ease-in-out infinite;
        }

        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-20px) rotate(90deg); opacity: 1; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-25px) rotate(270deg); opacity: 1; }
        }

        .main-content {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 90px;
        }

        .main-content::-webkit-scrollbar {
          display: none;
        }

        .screen-content {
          padding: ${theme.spacing.xl};
          min-height: calc(100vh - 90px);
        }

        /* Screen Headers */
        .screen-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.xxl};
        }

        .screen-title {
          font-size: 24px;
          font-weight: 800;
          color: ${theme.text.primary};
          margin: 0;
        }

        .xp-badge, .safety-badge {
          background: ${theme.gradients.xpEnergy};
          color: white;
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          border-radius: ${theme.radius.full};
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: ${theme.spacing.xs};
        }

        .safety-badge {
          background: ${theme.gradients.healthWarning};
        }

        /* Dashboard Styles */
        .player-profile {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.lg};
          margin-bottom: ${theme.spacing.lg};
        }

        .player-avatar {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background: ${theme.gradients.legendary};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          border: 3px solid rgba(255, 215, 0, 0.5);
          animation: legendary-glow 3s ease-in-out infinite alternate;
        }

        @keyframes legendary-glow {
          from { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            border-color: rgba(255, 215, 0, 0.5);
          }
          to { 
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
            border-color: rgba(255, 215, 0, 1);
          }
        }

        .player-rank {
          position: absolute;
          top: -5px;
          right: -5px;
          background: ${theme.gradients.legendary};
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
        }

        .player-info {
          flex: 1;
        }

        .player-name {
          font-size: 22px;
          font-weight: 800;
          color: ${theme.text.primary};
          margin-bottom: 4px;
        }

        .player-title {
          font-size: 14px;
          color: ${theme.text.secondary};
          margin-bottom: ${theme.spacing.sm};
        }

        .level-progress {
          position: relative;
          margin-bottom: 4px;
        }

        .level-bar {
          width: 100%;
          height: 12px;
          background: ${theme.glass.light};
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid ${theme.borderGlow};
        }

        .level-fill {
          height: 100%;
          background: ${theme.gradients.xpEnergy};
          border-radius: 6px;
          transition: width 0.8s ease;
          position: relative;
          overflow: hidden;
        }

        .level-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .level-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: ${theme.text.secondary};
          margin-top: 4px;
        }

        .xp-display {
          background: ${theme.gradients.xpEnergy};
          color: white;
          padding: 4px ${theme.spacing.sm};
          border-radius: ${theme.radius.sm};
          font-size: 11px;
          font-weight: 700;
        }

        .achievement-banner {
          background: ${theme.glass.medium};
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
          margin-bottom: ${theme.spacing.xxl};
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .achievement-banner:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 215, 0, 0.6);
          box-shadow: 0 8px 30px rgba(255, 215, 0, 0.2);
        }

        .achievement-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
          animation: achievement-shimmer 4s ease-in-out infinite;
        }

        @keyframes achievement-shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.md};
          position: relative;
          z-index: 2;
        }

        .banner-icon {
          font-size: 28px;
          animation: bounce-celebration 2s ease-in-out infinite;
        }

        @keyframes bounce-celebration {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-5deg); }
          75% { transform: translateY(-2px) rotate(5deg); }
        }

        .banner-text {
          flex: 1;
        }

        .banner-title {
          font-size: 14px;
          font-weight: 700;
          color: ${theme.text.primary};
          margin-bottom: 2px;
        }

        .banner-description {
          font-size: 12px;
          color: ${theme.text.secondary};
        }

        .banner-reward {
          background: ${theme.gradients.legendary};
          color: white;
          padding: 6px ${theme.spacing.md};
          border-radius: ${theme.radius.md};
          font-size: 12px;
          font-weight: 700;
        }

        .health-hero {
          background: ${theme.glass.strong};
          backdrop-filter: blur(30px);
          border: 2px solid ${theme.borderGlow};
          border-radius: ${theme.radius.xxl};
          padding: ${theme.spacing.xxl};
          margin-bottom: ${theme.spacing.xl};
          position: relative;
          overflow: hidden;
        }

        .hero-rotation {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(0, 201, 255, 0.1), transparent);
          animation: rotate-hero 15s linear infinite;
        }

        @keyframes rotate-hero {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-content {
          position: relative;
          z-index: 2;
        }

        .hero-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.xl};
        }

        .hero-title {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.sm};
          font-size: 18px;
          font-weight: 700;
          color: ${theme.text.primary};
        }

        .hero-icon {
          color: #00C9FF;
        }

        .health-score {
          background: ${theme.gradients.healthExcellent};
          color: white;
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .glucose-display {
          text-align: center;
          margin-bottom: ${theme.spacing.xl};
        }

        .glucose-value {
          font-size: 56px;
          font-weight: 900;
          color: ${theme.text.primary};
          font-family: 'SF Mono', monospace;
          margin-bottom: ${theme.spacing.sm};
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .glucose-trend {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: ${theme.spacing.sm};
          color: ${theme.text.secondary};
          font-size: 14px;
          font-weight: 600;
        }

        .glucobalance-score {
          background: ${theme.glass.medium};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
        }

        .score-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.md};
        }

        .score-title {
          font-size: 14px;
          font-weight: 600;
          color: ${theme.text.primary};
        }

        .score-badge {
          background: ${theme.gradients.common};
          color: white;
          padding: 4px ${theme.spacing.sm};
          border-radius: ${theme.radius.sm};
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .score-circle {
          position: relative;
          width: 60px;
          height: 60px;
          margin: 0 auto ${theme.spacing.md};
        }

        .score-value {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          font-weight: 800;
          color: ${theme.text.primary};
        }

        .daily-quests {
          background: ${theme.glass.medium};
          backdrop-filter: blur(20px);
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.xl};
          padding: ${theme.spacing.xxl};
          margin-bottom: ${theme.spacing.xl};
        }

        .quests-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.xl};
        }

        .quests-title {
          font-size: 18px;
          font-weight: 700;
          color: ${theme.text.primary};
        }

        .quests-progress {
          background: ${theme.glass.light};
          color: ${theme.text.secondary};
          padding: 6px ${theme.spacing.md};
          border-radius: ${theme.radius.md};
          font-size: 12px;
          font-weight: 600;
        }

        .quest-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.lg};
          padding: ${theme.spacing.lg};
          background: ${theme.glass.light};
          border-radius: ${theme.radius.lg};
          margin-bottom: ${theme.spacing.md};
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .quest-item:hover {
          background: ${theme.glass.medium};
          border-color: ${theme.borderGlow};
          transform: translateX(4px);
        }

        .quest-item.completed {
          background: ${theme.gradients.common};
          border-color: rgba(76, 175, 80, 0.5);
        }

        .quest-icon {
          width: 48px;
          height: 48px;
          border-radius: 24px;
          background: ${theme.gradients.rare};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .quest-icon.legendary {
          background: ${theme.gradients.legendary};
          animation: legendary-pulse 2s ease-in-out infinite;
        }

        @keyframes legendary-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .quest-content {
          flex: 1;
        }

        .quest-title {
          font-size: 14px;
          font-weight: 600;
          color: ${theme.text.primary};
          margin-bottom: 4px;
        }

        .quest-description {
          font-size: 12px;
          color: ${theme.text.secondary};
          margin-bottom: ${theme.spacing.sm};
        }

        .quest-progress-bar {
          width: 100%;
          height: 6px;
          background: ${theme.glass.light};
          border-radius: 3px;
          overflow: hidden;
        }

        .quest-progress-fill {
          height: 100%;
          background: ${theme.gradients.xpEnergy};
          border-radius: 3px;
          transition: width 0.8s ease;
        }

        .quest-reward {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .reward-value {
          background: ${theme.gradients.xpEnergy};
          color: white;
          padding: 6px 10px;
          border-radius: ${theme.radius.md};
          font-size: 12px;
          font-weight: 700;
        }

        .reward-type {
          font-size: 9px;
          color: ${theme.text.tertiary};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${theme.spacing.lg};
          margin-bottom: ${theme.spacing.xl};
        }

        .achievement-card {
          background: ${theme.glass.medium};
          backdrop-filter: blur(20px);
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.xl};
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .achievement-card:hover {
          transform: translateY(-4px);
          background: ${theme.glass.strong};
          box-shadow: ${theme.shadowElevated};
        }

        .achievement-card.streak {
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(247, 147, 30, 0.2));
          border-color: rgba(255, 107, 53, 0.3);
        }

        .streak-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: ${theme.gradients.streakFire};
        }

        .achievement-icon {
          margin-bottom: ${theme.spacing.md};
          color: white;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .achievement-value {
          font-size: 28px;
          font-weight: 800;
          color: ${theme.text.primary};
          margin-bottom: 4px;
        }

        .achievement-label {
          font-size: 12px;
          color: ${theme.text.secondary};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .leaderboard-preview {
          background: ${theme.glass.medium};
          backdrop-filter: blur(20px);
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.xl};
          padding: ${theme.spacing.xxl};
          margin-bottom: 100px;
        }

        .leaderboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.xl};
        }

        .leaderboard-title {
          font-size: 18px;
          font-weight: 700;
          color: ${theme.text.primary};
        }

        .view-all {
          color: ${theme.text.secondary};
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.lg};
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          background: ${theme.glass.light};
          border-radius: ${theme.radius.md};
          margin-bottom: ${theme.spacing.sm};
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .leaderboard-item:hover {
          background: ${theme.glass.medium};
          border-color: ${theme.borderGlow};
        }

        .leaderboard-item.current-user {
          background: linear-gradient(135deg, rgba(0, 201, 255, 0.2), rgba(146, 254, 157, 0.2));
          border-color: rgba(0, 201, 255, 0.3);
        }

        .rank-badge {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          background: ${theme.gradients.rare};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .rank-badge.first {
          background: ${theme.gradients.legendary};
        }

        .rank-badge.second {
          background: linear-gradient(135deg, #C0C0C0, #E5E5E5);
        }

        .rank-badge.third {
          background: linear-gradient(135deg, #CD7F32, #D4A574);
        }

        .leaderboard-user {
          flex: 1;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: ${theme.text.primary};
          margin-bottom: 2px;
        }

        .user-streak {
          font-size: 11px;
          color: ${theme.text.secondary};
        }

        .user-score {
          font-size: 16px;
          font-weight: 700;
          color: ${theme.text.primary};
        }

        /* Food Logging Styles */
        .search-container {
          position: relative;
          margin-bottom: ${theme.spacing.xl};
        }

        .search-icon {
          position: absolute;
          left: ${theme.spacing.lg};
          top: 50%;
          transform: translateY(-50%);
          color: ${theme.text.tertiary};
        }

        .search-input {
          width: 100%;
          background: ${theme.glass.medium};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.full};
          padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 48px;
          color: ${theme.text.primary};
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: ${theme.borderFocus};
          box-shadow: 0 0 0 3px rgba(0, 201, 255, 0.1);
          outline: none;
        }

        .search-input::placeholder {
          color: ${theme.text.quaternary};
        }

        .meal-selector {
          display: flex;
          gap: ${theme.spacing.sm};
          margin-bottom: ${theme.spacing.xl};
          padding: ${theme.spacing.sm};
          background: ${theme.glass.light};
          border-radius: ${theme.radius.xl};
        }

        .meal-button {
          flex: 1;
          background: transparent;
          border: none;
          color: ${theme.text.tertiary};
          padding: ${theme.spacing.md};
          border-radius: ${theme.radius.lg};
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${theme.spacing.xs};
        }

        .meal-button.active {
          background: ${theme.glass.medium};
          color: ${theme.text.primary};
          box-shadow: ${theme.shadowElevated};
        }

        .meal-icon {
          font-size: 16px;
        }

        .meal-name {
          font-size: 11px;
        }

        .meal-indicator {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 6px;
          height: 6px;
          background: ${theme.gradients.xpEnergy};
          border-radius: 50%;
        }

        .meal-summary {
          background: ${theme.glass.medium};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
          margin-bottom: ${theme.spacing.xl};
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.md};
        }

        .summary-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: ${theme.text.primary};
        }

        .summary-badge {
          background: ${theme.glass.light};
          color: ${theme.text.secondary};
          padding: 4px ${theme.spacing.sm};
          border-radius: ${theme.radius.sm};
          font-size: 11px;
          font-weight: 600;
        }

        .nutrition-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${theme.spacing.lg};
        }

        .nutrition-item {
          text-align: center;
        }

        .nutrition-value {
          font-size: 24px;
          font-weight: 800;
          color: ${theme.text.primary};
          margin-bottom: 2px;
        }

        .nutrition-label {
          font-size: 12px;
          color: ${theme.text.secondary};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .food-section {
          margin-bottom: ${theme.spacing.xxl};
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: ${theme.text.primary};
          margin-bottom: ${theme.spacing.lg};
        }

        .food-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${theme.spacing.md};
        }

        .food-item {
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .food-item:hover {
          background: ${theme.glass.medium};
          transform: translateY(-2px);
        }

        .food-item.quick-add {
          border-color: ${theme.borderFocus};
        }

        .food-icon {
          font-size: 24px;
          margin-bottom: ${theme.spacing.sm};
        }

        .food-name {
          font-size: 14px;
          font-weight: 600;
          color: ${theme.text.primary};
          margin-bottom: 4px;
        }

        .food-nutrition {
          font-size: 12px;
          color: ${theme.text.secondary};
        }

        .add-icon {
          position: absolute;
          top: ${theme.spacing.sm};
          right: ${theme.spacing.sm};
          color: ${theme.text.tertiary};
        }

        .food-list {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.sm};
        }

        .food-item-row {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.md};
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .food-item-row:hover {
          background: ${theme.glass.medium};
          transform: translateX(4px);
        }

        .food-details {
          flex: 1;
        }

        .logged-foods {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.sm};
        }

        .logged-food-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.md};
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
        }

        .food-time {
          font-size: 11px;
          color: ${theme.text.quaternary};
          margin-top: 2px;
        }

        .remove-button {
          background: ${theme.gradients.healthCritical};
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-button:hover {
          transform: scale(1.1);
        }

        /* Calculator Styles */
        .calculator-card {
          background: ${theme.glass.medium};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.xl};
          padding: ${theme.spacing.xxl};
          margin-bottom: ${theme.spacing.xl};
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: ${theme.text.primary};
          margin-bottom: ${theme.spacing.lg};
        }

        .form-group {
          margin-bottom: ${theme.spacing.lg};
        }

        .form-label {
          display: block;
          margin-bottom: ${theme.spacing.sm};
          font-size: 12px;
          font-weight: 600;
          color: ${theme.text.secondary};
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          width: 100%;
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          color: ${theme.text.primary};
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: ${theme.borderFocus};
          box-shadow: 0 0 0 3px rgba(0, 201, 255, 0.1);
          outline: none;
        }

        .form-input::placeholder {
          color: ${theme.text.quaternary};
        }

        .form-row {
          display: flex;
          gap: ${theme.spacing.md};
        }

        .form-row .form-group {
          flex: 1;
        }

        .calculate-button {
          width: 100%;
          background: ${theme.gradients.xpEnergy};
          border: none;
          color: white;
          padding: ${theme.spacing.lg};
          border-radius: ${theme.radius.lg};
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: ${theme.spacing.sm};
        }

        .calculate-button:hover {
          transform: translateY(-2px);
          box-shadow: ${theme.shadowElevated};
        }

        .result-card {
          background: ${theme.glass.strong};
          border: 2px solid ${theme.borderGlow};
          border-radius: ${theme.radius.xl};
          padding: ${theme.spacing.xxl};
          margin-bottom: ${theme.spacing.xl};
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.xl};
        }

        .result-time {
          font-size: 12px;
          color: ${theme.text.tertiary};
        }

        .result-summary {
          text-align: center;
          margin-bottom: ${theme.spacing.xl};
        }

        .total-dose {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: ${theme.spacing.xl};
          border-radius: ${theme.radius.xl};
          color: white;
        }

        .dose-value {
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 4px;
        }

        .dose-label {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .dose-breakdown {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.lg};
        }

        .breakdown-item {
          background: ${theme.glass.light};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
        }

        .breakdown-label {
          font-size: 12px;
          color: ${theme.text.secondary};
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .breakdown-value {
          font-size: 18px;
          font-weight: 700;
          color: ${theme.text.primary};
          margin-bottom: 2px;
        }

        .breakdown-detail {
          font-size: 11px;
          color: ${theme.text.tertiary};
        }

        .warning-alert {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.md};
          background: ${theme.gradients.healthCritical};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
          margin-top: ${theme.spacing.lg};
          color: white;
        }

        .alert-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .alert-message {
          font-size: 12px;
        }

        .history-section {
          margin-bottom: ${theme.spacing.xxl};
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.sm};
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.md};
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
        }

        .history-icon {
          font-size: 20px;
        }

        .history-details {
          flex: 1;
        }

        .history-main {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.md};
          margin-bottom: 2px;
        }

        .history-insulin {
          font-size: 16px;
          font-weight: 700;
          color: ${theme.text.primary};
        }

        .history-bg {
          font-size: 14px;
          color: ${theme.text.secondary};
        }

        .history-meta {
          font-size: 11px;
          color: ${theme.text.tertiary};
        }

        .history-type {
          background: ${theme.glass.medium};
          color: ${theme.text.secondary};
          padding: 4px ${theme.spacing.sm};
          border-radius: ${theme.radius.sm};
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
        }

        /* Settings Styles */
        .settings-section {
          margin-bottom: ${theme.spacing.xxxxl};
        }

        .profile-card {
          background: ${theme.glass.medium};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.xl};
          padding: ${theme.spacing.xxl};
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.lg};
        }

        .profile-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 40px;
          background: ${theme.gradients.legendary};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          border: 3px solid rgba(255, 215, 0, 0.5);
          animation: legendary-glow 3s ease-in-out infinite alternate;
        }

        .profile-level {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: ${theme.gradients.levelProgression};
          color: white;
          padding: 4px ${theme.spacing.sm};
          border-radius: ${theme.radius.sm};
          font-size: 10px;
          font-weight: 700;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 20px;
          font-weight: 800;
          color: ${theme.text.primary};
          margin-bottom: 4px;
        }

        .profile-title {
          font-size: 14px;
          color: ${theme.text.secondary};
          margin-bottom: ${theme.spacing.md};
        }

        .profile-stats {
          display: flex;
          gap: ${theme.spacing.lg};
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: ${theme.text.primary};
        }

        .stat-label {
          font-size: 11px;
          color: ${theme.text.tertiary};
          text-transform: uppercase;
        }

        .edit-profile-btn {
          background: ${theme.glass.medium};
          border: 1px solid ${theme.borderGlow};
          color: ${theme.text.primary};
          width: 48px;
          height: 48px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-profile-btn:hover {
          background: ${theme.glass.strong};
          transform: scale(1.1);
        }

        .targets-card, .notifications-card {
          background: ${theme.glass.medium};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.xl};
          padding: ${theme.spacing.xxl};
        }

        .target-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: ${theme.spacing.lg} 0;
          border-bottom: 1px solid ${theme.glass.light};
        }

        .target-row:last-child {
          border-bottom: none;
        }

        .target-label {
          font-size: 14px;
          font-weight: 600;
          color: ${theme.text.primary};
        }

        .target-inputs {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.sm};
        }

        .target-input {
          width: 60px;
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.md};
          padding: ${theme.spacing.sm};
          color: ${theme.text.primary};
          font-size: 14px;
          text-align: center;
        }

        .target-separator {
          color: ${theme.text.tertiary};
          font-weight: 600;
        }

        .target-unit {
          font-size: 12px;
          color: ${theme.text.tertiary};
          min-width: 40px;
        }

        .notification-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: ${theme.spacing.lg} 0;
          border-bottom: 1px solid ${theme.glass.light};
        }

        .notification-row:last-child {
          border-bottom: none;
        }

        .notification-info {
          flex: 1;
        }

        .notification-name {
          font-size: 14px;
          font-weight: 600;
          color: ${theme.text.primary};
          margin-bottom: 2px;
        }

        .notification-description {
          font-size: 12px;
          color: ${theme.text.secondary};
        }

        .toggle-switch {
          width: 48px;
          height: 28px;
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: 14px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-switch.active {
          background: ${theme.gradients.xpEnergy};
          border-color: transparent;
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 10px;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .toggle-switch.active .toggle-thumb {
          transform: translateX(20px);
        }

        .achievements-gallery {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${theme.spacing.lg};
        }

        .gallery-achievement {
          background: ${theme.glass.light};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .gallery-achievement.earned {
          background: ${theme.glass.medium};
          border-color: rgba(76, 175, 80, 0.5);
        }

        .gallery-achievement:not(.earned) {
          opacity: 0.5;
        }

        .achievement-icon-large {
          font-size: 32px;
          margin-bottom: ${theme.spacing.sm};
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .achievement-name {
          font-size: 12px;
          font-weight: 600;
          color: ${theme.text.primary};
          margin-bottom: 4px;
        }

        .achievement-description {
          font-size: 10px;
          color: ${theme.text.tertiary};
        }

        .earned-badge {
          position: absolute;
          top: ${theme.spacing.sm};
          right: ${theme.spacing.sm};
          background: ${theme.gradients.common};
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .data-actions {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.sm};
        }

        .data-action-btn {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.lg};
          background: ${theme.glass.medium};
          border: 1px solid ${theme.borderGlow};
          border-radius: ${theme.radius.lg};
          padding: ${theme.spacing.lg};
          color: ${theme.text.primary};
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .data-action-btn:hover {
          background: ${theme.glass.strong};
          transform: translateY(-2px);
        }

        .action-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .action-description {
          font-size: 12px;
          color: ${theme.text.secondary};
        }

        .fab {
          position: absolute;
          bottom: 110px;
          right: ${theme.spacing.xl};
          width: 64px;
          height: 64px;
          border-radius: 32px;
          background: ${theme.gradients.legendary};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: ${theme.shadowLegendary};
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 100;
          border: 2px solid rgba(255, 215, 0, 0.3);
          animation: fab-legendary 3s ease-in-out infinite;
        }

        @keyframes fab-legendary {
          0%, 100% { box-shadow: ${theme.shadowLegendary}; }
          50% { box-shadow: 0 12px 40px rgba(255, 215, 0, 0.8); }
        }

        .fab:hover {
          transform: scale(1.1);
          animation: none;
          box-shadow: 0 12px 40px rgba(255, 215, 0, 0.8);
        }

        .bottom-nav {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 90px;
          background: ${theme.glass.strong};
          backdrop-filter: blur(30px);
          border-top: 1px solid ${theme.borderGlow};
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding-bottom: ${theme.spacing.xl};
          z-index: 50;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: ${theme.text.tertiary};
          padding: ${theme.spacing.sm};
          border-radius: ${theme.radius.md};
        }

        .nav-item.active {
          color: ${theme.text.primary};
          transform: translateY(-2px);
          background: ${theme.glass.light};
        }

        .nav-item:hover {
          color: ${theme.text.secondary};
          background: ${theme.glass.light};
        }

        .nav-icon {
          margin-bottom: 2px;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
        }

        .nav-label {
          font-size: 11px;
          font-weight: 600;
        }

        @media (max-width: 400px) {
          .mobile-container {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default HealthApp;