import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Home, 
  Activity, 
  Utensils, 
  User, 
  ChevronRight, 
  Plus, 
  Droplets, 
  Flame, 
  Timer, 
  Footprints,
  Play,
  CheckCircle2,
  Settings,
  LogOut,
  Trophy,
  Zap,
  Mic,
  Search,
  ScanBarcode
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import { UserProfile, DailyStats, Workout } from './types';
import { getAICoachAdvice } from './services/gemini';

// --- Mock Data ---
const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    title: 'Full Body HIIT',
    category: 'HIIT',
    duration: 30,
    calories: 350,
    difficulty: 'Intermediate',
    image: 'https://picsum.photos/seed/hiit/400/200',
    exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers', 'Plank']
  },
  {
    id: '2',
    title: 'Strength Core',
    category: 'Strength',
    duration: 45,
    calories: 280,
    difficulty: 'Beginner',
    image: 'https://picsum.photos/seed/strength/400/200',
    exercises: ['Squats', 'Pushups', 'Lunges', 'Deadlifts']
  },
  {
    id: '3',
    title: 'Morning Yoga',
    category: 'Yoga',
    duration: 20,
    calories: 120,
    difficulty: 'Beginner',
    image: 'https://picsum.photos/seed/yoga/400/200',
    exercises: ['Sun Salutation', 'Warrior I', 'Warrior II', 'Child Pose']
  }
];

const WEIGHT_DATA = [
  { day: 'Mon', weight: 82 },
  { day: 'Tue', weight: 81.8 },
  { day: 'Wed', weight: 81.5 },
  { day: 'Thu', weight: 81.7 },
  { day: 'Fri', weight: 81.2 },
  { day: 'Sat', weight: 81.0 },
  { day: 'Sun', weight: 80.8 },
];

// --- Components ---

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary to-accent/20 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-24 h-24 bg-accent rounded-2xl flex items-center justify-center neon-glow-blue mb-6">
          <Dumbbell className="text-white w-12 h-12" />
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full -z-10"
        />
      </motion.div>
      <h1 className="text-4xl font-bold tracking-tighter mb-2 italic">FitWarrior</h1>
      <p className="text-soft-white/60 font-medium tracking-widest uppercase text-xs">Train Hard. Track Smart.</p>
    </div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: (profile: UserProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goal: 'Build Muscle',
    experience: 'Beginner',
    gender: 'Male',
    height: 175,
    weight: 75,
    age: 25,
    name: 'Gowtham'
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete({ ...profile, onboarded: true } as UserProfile);
  };

  return (
    <div className="min-h-screen bg-primary p-6 flex flex-col">
      <div className="flex justify-between items-center mb-12">
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div key={s} className={cn("h-1 w-8 rounded-full transition-colors", s <= step ? "bg-accent" : "bg-white/10")} />
          ))}
        </div>
        <button onClick={nextStep} className="text-accent font-semibold">Skip</button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-1"
          >
            <h2 className="text-3xl font-bold mb-8">What's Your Goal?</h2>
            <div className="grid gap-4">
              {['Lose Weight', 'Build Muscle', 'Stay Fit', 'Improve Endurance'].map((goal) => (
                <button
                  key={goal}
                  onClick={() => setProfile({ ...profile, goal: goal as any })}
                  className={cn(
                    "p-6 rounded-2xl border text-left transition-all",
                    profile.goal === goal ? "border-accent bg-accent/10" : "border-white/10 bg-white/5"
                  )}
                >
                  <span className="text-lg font-semibold">{goal}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-1"
          >
            <h2 className="text-3xl font-bold mb-8">Basic Data</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-soft-white/60 mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-soft-white/60 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:border-accent outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-soft-white/60 mb-2">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-soft-white/60 mb-2">Gender</label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:border-accent outline-none appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-1"
          >
            <h2 className="text-3xl font-bold mb-8">Experience Level</h2>
            <div className="grid gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setProfile({ ...profile, experience: level as any })}
                  className={cn(
                    "p-6 rounded-2xl border text-left transition-all",
                    profile.experience === level ? "border-accent bg-accent/10" : "border-white/10 bg-white/5"
                  )}
                >
                  <span className="text-lg font-semibold">{level}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={nextStep}
        className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg mt-8 flex items-center justify-center gap-2"
      >
        {step === 3 ? "Get Started" : "Continue"}
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const Permissions = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete();
  };

  const screens = [
    {
      title: "Activity Tracking",
      desc: "We track steps & workouts to measure progress and keep you on track.",
      icon: <Activity className="w-12 h-12 text-accent" />,
      btn: "Allow Activity Access"
    },
    {
      title: "Notifications",
      desc: "Daily reminders and motivational alerts to keep you consistent.",
      icon: <Zap className="w-12 h-12 text-secondary" />,
      btn: "Enable Notifications"
    },
    {
      title: "Health Sync",
      desc: "Sync with Google Fit or Apple Health for accurate insights.",
      icon: <Droplets className="w-12 h-12 text-blue-400" />,
      btn: "Sync Now"
    }
  ];

  const current = screens[step - 1];

  return (
    <div className="min-h-screen bg-primary p-8 flex flex-col items-center justify-center text-center">
      <motion.div
        key={step}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8"
      >
        {current.icon}
      </motion.div>
      <h2 className="text-3xl font-bold mb-4">{current.title}</h2>
      <p className="text-soft-white/60 mb-12 max-w-xs">{current.desc}</p>
      
      <div className="w-full space-y-4">
        <button
          onClick={next}
          className="w-full bg-accent text-white py-4 rounded-2xl font-bold"
        >
          {current.btn}
        </button>
        <button
          onClick={next}
          className="w-full text-soft-white/40 py-2 font-medium"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ profile }: { profile: UserProfile }) => {
  const [advice, setAdvice] = useState("Loading AI Coach advice...");
  
  useEffect(() => {
    const fetchAdvice = async () => {
      const res = await getAICoachAdvice(profile, { steps: 8432, calories: 450 });
      setAdvice(res);
    };
    fetchAdvice();
  }, [profile]);

  return (
    <div className="pb-24">
      <header className="p-6 flex justify-between items-center">
        <div>
          <p className="text-soft-white/60 text-sm">Hey {profile.name} 👋</p>
          <h1 className="text-2xl font-bold">Thursday, Mar 26</h1>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
          <User className="text-soft-white" />
        </div>
      </header>

      {/* AI Coach Advice */}
      <div className="px-6 mb-8">
        <div className="glass p-4 rounded-2xl border-l-4 border-accent">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-accent fill-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-accent">AI Coach</span>
          </div>
          <p className="text-sm leading-relaxed italic">"{advice}"</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 overflow-x-auto px-6 mb-8 no-scrollbar">
        {[
          { label: 'Steps', value: '8,432', icon: <Footprints className="text-accent" />, color: 'bg-accent/10' },
          { label: 'Calories', value: '450', icon: <Flame className="text-danger" />, color: 'bg-danger/10' },
          { label: 'Workout', value: '45m', icon: <Timer className="text-secondary" />, color: 'bg-secondary/10' },
          { label: 'Water', value: '1.5L', icon: <Droplets className="text-blue-400" />, color: 'bg-blue-400/10' },
        ].map((stat) => (
          <div key={stat.label} className="min-w-[140px] glass p-4 rounded-2xl">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.color)}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-soft-white/40 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Ring */}
      <div className="px-6 mb-8">
        <div className="glass p-8 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-3xl -z-10" />
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.9}
                strokeDashoffset={552.9 * (1 - 0.75)}
                strokeLinecap="round"
                className="text-accent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">75%</span>
              <span className="text-xs text-soft-white/40 uppercase">Daily Goal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Today's Workout</h3>
          <button className="text-accent text-sm font-semibold">View All</button>
        </div>
        <div className="relative rounded-3xl overflow-hidden h-48 group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/workout/800/400" 
            alt="Workout" 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <h4 className="text-2xl font-bold mb-1">Morning Power HIIT</h4>
            <div className="flex items-center gap-4 text-sm text-soft-white/80">
              <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> 30m</span>
              <span className="flex items-center gap-1"><Flame className="w-4 h-4" /> 350 kcal</span>
            </div>
            <button className="absolute bottom-6 right-6 w-12 h-12 bg-accent rounded-full flex items-center justify-center neon-glow-blue">
              <Play className="w-5 h-5 fill-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 grid grid-cols-2 gap-4">
        <button className="glass p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
            <Plus className="text-secondary" />
          </div>
          <span className="font-semibold">Log Meal</span>
        </button>
        <button className="glass p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center">
            <Droplets className="text-blue-400" />
          </div>
          <span className="font-semibold">Add Water</span>
        </button>
      </div>
    </div>
  );
};

const WorkoutLibrary = () => {
  const categories = ['All', 'Strength', 'Cardio', 'Yoga', 'HIIT', 'Home'];
  const [activeCat, setActiveCat] = useState('All');

  return (
    <div className="pb-24 p-6">
      <h1 className="text-3xl font-bold mb-6">Workout Library</h1>
      
      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={cn(
              "px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all",
              activeCat === cat ? "bg-accent text-white" : "bg-white/5 text-soft-white/60"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {MOCK_WORKOUTS.map((workout) => (
          <motion.div
            key={workout.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass rounded-3xl overflow-hidden"
          >
            <div className="h-40 relative">
              <img src={workout.image} alt={workout.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {workout.difficulty}
              </div>
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold mb-1">{workout.title}</h3>
                <p className="text-soft-white/40 text-sm">{workout.duration}m • {workout.calories} kcal</p>
              </div>
              <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Tracker = () => {
  return (
    <div className="pb-24 p-6">
      <h1 className="text-3xl font-bold mb-8">Progress</h1>

      <div className="glass p-6 rounded-3xl mb-8">
        <h3 className="text-lg font-bold mb-6">Weight Progress (kg)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEIGHT_DATA}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Area type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass p-6 rounded-3xl text-center">
          <p className="text-soft-white/40 text-xs uppercase tracking-widest mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-secondary">12 Days</p>
        </div>
        <div className="glass p-6 rounded-3xl text-center">
          <p className="text-soft-white/40 text-xs uppercase tracking-widest mb-1">Total Workouts</p>
          <p className="text-3xl font-bold text-accent">48</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Recent Achievements</h3>
        {[
          { title: 'Early Bird', desc: '5 workouts before 7 AM', icon: <Zap className="text-yellow-400" /> },
          { title: 'Hydration Pro', desc: '7 days water goal met', icon: <Droplets className="text-blue-400" /> },
        ].map((ach) => (
          <div key={ach.title} className="glass p-4 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
              {ach.icon}
            </div>
            <div>
              <h4 className="font-bold">{ach.title}</h4>
              <p className="text-sm text-soft-white/40">{ach.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Nutrition = () => {
  return (
    <div className="pb-24 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
          <ScanBarcode className="w-5 h-5 text-accent" />
        </button>
      </div>

      <div className="glass p-6 rounded-3xl mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-soft-white/40 text-xs uppercase tracking-widest">Calories Left</p>
            <p className="text-4xl font-bold">1,240</p>
          </div>
          <p className="text-soft-white/40 text-sm">Goal: 2,200</p>
        </div>
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-accent w-[45%]" />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { meal: 'Breakfast', cal: 450, items: 'Oatmeal, Banana, Coffee', icon: <Utensils className="text-orange-400" /> },
          { meal: 'Lunch', cal: 620, items: 'Chicken Salad, Quinoa', icon: <Utensils className="text-green-400" /> },
          { meal: 'Dinner', cal: 0, items: 'Not logged yet', icon: <Utensils className="text-blue-400" /> },
        ].map((m) => (
          <div key={m.meal} className="glass p-5 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                {m.icon}
              </div>
              <div>
                <h4 className="font-bold text-lg">{m.meal}</h4>
                <p className="text-sm text-soft-white/40">{m.items}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">{m.cal}</p>
              <p className="text-xs text-soft-white/40 uppercase">kcal</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-white/5 border border-dashed border-white/20 py-4 rounded-2xl mt-6 flex items-center justify-center gap-2 text-soft-white/60">
        <Plus className="w-5 h-5" />
        Add Snack
      </button>
    </div>
  );
};

const Profile = () => {
  return (
    <div className="pb-24 p-6">
      <div className="flex flex-col items-center mb-12">
        <div className="w-32 h-32 rounded-[2.5rem] bg-accent p-1 mb-6">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gowtham" 
            alt="Avatar" 
            className="w-full h-full rounded-[2.2rem] bg-primary"
          />
        </div>
        <h1 className="text-3xl font-bold">Gowtham</h1>
        <p className="text-accent font-semibold">Warrior Level 12</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="text-center">
          <p className="text-2xl font-bold">82</p>
          <p className="text-xs text-soft-white/40 uppercase">Weight</p>
        </div>
        <div className="text-center border-x border-white/10">
          <p className="text-2xl font-bold">175</p>
          <p className="text-xs text-soft-white/40 uppercase">Height</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">25</p>
          <p className="text-xs text-soft-white/40 uppercase">Age</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Achievements', icon: <Trophy className="w-5 h-5 text-yellow-500" /> },
          { label: 'Settings', icon: <Settings className="w-5 h-5 text-soft-white/60" /> },
          { label: 'Log Out', icon: <LogOut className="w-5 h-5 text-danger" />, color: 'text-danger' },
        ].map((item) => (
          <button key={item.label} className="w-full glass p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              {item.icon}
              <span className={cn("font-semibold", item.color)}>{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-soft-white/20" />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [permissions, setPermissions] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  if (loading) return <SplashScreen onComplete={() => setLoading(false)} />;
  
  if (!onboarded) return <Onboarding onComplete={(p) => { setProfile(p); setOnboarded(true); }} />;
  
  if (!permissions) return <Permissions onComplete={() => setPermissions(true)} />;

  return (
    <div className="min-h-screen bg-primary text-soft-white">
      <main className="max-w-md mx-auto min-h-screen relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dashboard profile={profile!} />
            </motion.div>
          )}
          {activeTab === 'workout' && (
            <motion.div key="workout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorkoutLibrary />
            </motion.div>
          )}
          {activeTab === 'tracker' && (
            <motion.div key="tracker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Tracker />
            </motion.div>
          )}
          {activeTab === 'nutrition' && (
            <motion.div key="nutrition" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Nutrition />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Profile />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass border-t border-white/10 px-6 py-4 flex justify-between items-center z-40">
          {[
            { id: 'home', icon: <Home className="w-6 h-6" /> },
            { id: 'workout', icon: <Dumbbell className="w-6 h-6" /> },
            { id: 'tracker', icon: <Activity className="w-6 h-6" /> },
            { id: 'nutrition', icon: <Utensils className="text-soft-white w-6 h-6" /> },
            { id: 'profile', icon: <User className="w-6 h-6" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative p-2 transition-all",
                activeTab === tab.id ? "text-accent" : "text-soft-white/40"
              )}
            >
              {tab.icon}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                />
              )}
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
