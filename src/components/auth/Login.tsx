import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Mail, Lock, Chrome, Moon, Sun, Sparkles, AlertCircle, Loader } from 'lucide-react';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const { login, signup, loginWithGoogle, startGuestSession, isLoading, error, clearError } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.log('Login error handled by store');
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await signup(email, password, displayName);
      setEmail('');
      setPassword('');
      setDisplayName('');
      setIsSignup(false);
    } catch (err) {
      console.log('Signup error handled by store');
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await loginWithGoogle();
    } catch (err) {
      console.log('Google login error handled by store');
    }
  };

  const handleGuestSession = () => {
    clearError();
    startGuestSession();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <div className="mx-auto max-w-md px-4 py-6 sm:py-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">ResumePro</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">ATS-ready resumes in minutes</p>
            </div>
          </div>
          <button
            onClick={() => toggleDarkMode()}
            className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 flex items-center justify-center transition-all"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>
        </div>

        <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 backdrop-blur-sm">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setIsSignup(false); clearError(); }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                !isSignup
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignup(true); clearError(); }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                isSignup
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <h1 className="text-2xl font-black tracking-tight mb-1">
            {isSignup ? 'Create Account' : 'Welcome back'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isSignup ? 'Create your account to start building resumes' : 'Sign in to continue building your resume'}
          </p>

          <form onSubmit={isSignup ? handleEmailSignup : handleEmailLogin} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-11 px-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-slate-800 disabled:opacity-50"
                  placeholder="John Doe"
                  required={isSignup}
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-slate-800 disabled:opacity-50"
                  placeholder="you@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white dark:bg-slate-800 disabled:opacity-50"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="mt-4 w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-semibold rounded-xl hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/50 dark:hover:to-orange-900/50 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5" />
              Google
            </button>

            <button
              onClick={handleGuestSession}
              disabled={isLoading}
              className="mt-3 w-full h-11 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 hover:shadow-lg border border-emerald-500 dark:border-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Continue as Guest
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
