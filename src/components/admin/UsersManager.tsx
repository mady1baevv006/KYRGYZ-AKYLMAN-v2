import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Crown,
  Zap,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  UserPlus,
  Shield,
  RotateCcw,
  BookOpen,
  Calendar,
  X,
  Plus,
  School,
  Target,
  ArrowRight,
  Filter,
  Mail,
  Send,
  Globe,
  Smartphone,
  Key,
  RefreshCw,
} from 'lucide-react';
import { useAuth, UserProfile, ADMIN_EMAIL } from '../../context/AuthContext';
import { KYRGYZ_UNIVERSITIES } from '../../data/constants';

export const UsersManager: React.FC = () => {
  const {
    user: currentUser,
    adminGetAllUsers,
    adminSetUserSubscription,
    adminUpdateUser,
    adminDeleteUser,
    adminResetTrial,
    adminCreateUser,
  } = useAuth();

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'standard' | 'premium'>('all');
  const [authFilter, setAuthFilter] = useState<'all' | 'google' | 'telegram' | 'email_code' | 'sync'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newIdentifier, setNewIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('123456');
  const [newAuthProvider, setNewAuthProvider] = useState<'google' | 'telegram' | 'email_code' | 'password'>('email_code');
  const [newTargetScore, setNewTargetScore] = useState(215);
  const [newUniversity, setNewUniversity] = useState(KYRGYZ_UNIVERSITIES[0]);
  const [newPlan, setNewPlan] = useState<'free' | 'standard' | 'premium'>('premium');
  const [newIsPaid, setNewIsPaid] = useState(true);

  // Refresh users list
  const refreshList = () => {
    const list = adminGetAllUsers();
    const seenIds = new Set<string>();
    const deduplicated: UserProfile[] = [];
    for (const u of list) {
      if (u && u.id && !seenIds.has(u.id)) {
        seenIds.add(u.id);
        deduplicated.push(u);
      }
    }
    setUsersList(deduplicated);
  };

  useEffect(() => {
    refreshList();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Quick 1-click subscription actions
  const handleQuickSetPlan = (
    targetUser: UserProfile,
    plan: 'free' | 'standard' | 'premium',
    isPaid: boolean
  ) => {
    adminSetUserSubscription(targetUser.id, plan, isPaid, '2027-06-01');
    refreshList();
    const planName =
      plan === 'premium'
        ? 'Премиальная подписка (VIP)'
        : plan === 'standard'
        ? 'Доступная подписка'
        : 'Бесплатный тариф';
    showToast(`Пользователю ${targetUser.name} успешно установлен тариф «${planName}»!`);
  };

  const handleResetTrial = (targetUser: UserProfile) => {
    adminResetTrial(targetUser.id);
    refreshList();
    showToast(`Пользователю ${targetUser.name} сброшен 24-часовой пробный период!`);
  };

  const handleDelete = (targetUser: UserProfile) => {
    if (targetUser.identifier.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      showToast('Нельзя удалить главный аккаунт администратора!');
      return;
    }
    setUserToDelete(targetUser);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdentifier.trim()) return;

    const trimmedId = newIdentifier.trim();
    const isEmail = trimmedId.includes('@');
    const isTg = trimmedId.startsWith('@') || newAuthProvider === 'telegram';

    const res = adminCreateUser({
      name: newName.trim() || 'Ученик',
      identifier: trimmedId,
      email: isEmail ? trimmedId : undefined,
      telegramUsername: isTg ? trimmedId : undefined,
      authProvider: newAuthProvider,
      authProviders: [newAuthProvider],
      password: newPassword || '123456',
      targetScore: Number(newTargetScore) || 215,
      targetUniversity: newUniversity,
      subscriptionPlan: newPlan,
      isPaid: newIsPaid,
      subscriptionExpiry: '2027-06-01',
      registeredAt: new Date().toISOString(),
      avatar: '/avatars/snow_leopard.svg',
    });

    if (!res.success) {
      alert(res.error || 'Ошибка при создании пользователя');
      return;
    }

    refreshList();
    setIsAddUserModalOpen(false);
    setNewName('');
    setNewIdentifier('');
    setNewPassword('123456');
    setNewAuthProvider('email_code');
    showToast(`Пользователь ${trimmedId} успешно создан с тарифом ${newPlan}!`);
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    adminUpdateUser(editingUser.id, {
      name: editingUser.name,
      identifier: editingUser.identifier,
      password: editingUser.password,
      targetScore: Number(editingUser.targetScore) || 215,
      targetUniversity: editingUser.targetUniversity,
      subscriptionPlan: editingUser.subscriptionPlan,
      isPaid: editingUser.isPaid,
      subscriptionExpiry: editingUser.subscriptionExpiry || '2027-06-01',
    });

    refreshList();
    setEditingUser(null);
    showToast(`Данные пользователя ${editingUser.name} успешно обновлены!`);
  };

  // Check user providers helper
  const isUserGoogle = (u: UserProfile) =>
    u.authProvider === 'google' || Boolean(u.authProviders?.includes('google'));

  const isUserTelegram = (u: UserProfile) =>
    u.authProvider === 'telegram' ||
    Boolean(u.authProviders?.includes('telegram')) ||
    u.identifier.startsWith('@') ||
    Boolean(u.telegramUsername);

  const isUserEmailCode = (u: UserProfile) =>
    u.authProvider === 'email_code' || Boolean(u.authProviders?.includes('email_code'));

  const isUserSynchronized = (u: UserProfile) =>
    Boolean(
      (u.authProviders?.includes('google') && u.authProviders?.includes('email_code')) ||
        (isUserGoogle(u) && isUserEmailCode(u))
    );

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      u.name.toLowerCase().includes(query) ||
      u.identifier.toLowerCase().includes(query) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.telegramUsername && u.telegramUsername.toLowerCase().includes(query)) ||
      (u.targetUniversity && u.targetUniversity.toLowerCase().includes(query));

    if (!matchQuery) return false;

    // Plan filter
    if (planFilter === 'premium' && u.subscriptionPlan !== 'premium') return false;
    if (planFilter === 'standard' && u.subscriptionPlan !== 'standard') return false;
    if (planFilter === 'free' && u.subscriptionPlan && u.subscriptionPlan !== 'free') return false;

    // Auth method filter
    if (authFilter === 'google' && !isUserGoogle(u)) return false;
    if (authFilter === 'telegram' && !isUserTelegram(u)) return false;
    if (authFilter === 'email_code' && !isUserEmailCode(u)) return false;
    if (authFilter === 'sync' && !isUserSynchronized(u)) return false;

    return true;
  });

  // Metrics
  const totalCount = usersList.length;
  const premiumCount = usersList.filter((u) => u.subscriptionPlan === 'premium').length;
  const standardCount = usersList.filter((u) => u.subscriptionPlan === 'standard').length;
  const freeCount = usersList.filter((u) => u.subscriptionPlan === 'free' || !u.subscriptionPlan).length;

  const googleCount = usersList.filter(isUserGoogle).length;
  const telegramCount = usersList.filter(isUserTelegram).length;
  const emailCodeCount = usersList.filter(isUserEmailCode).length;
  const syncCount = usersList.filter(isUserSynchronized).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="rounded-3xl bg-[#06261d] border border-emerald-800/60 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>База данных и управление пользователями</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Все зарегистрированные пользователи
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/70 mt-1 max-w-2xl">
              Полный реестр всех способов авторизации: Telegram, Google вход, 6-значный код подтверждения почты, а также синхронизированные единые профили.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer hover:brightness-110 active:scale-95 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Добавить пользователя</span>
          </button>
        </div>

        {/* Quick Stats Grid: Plans & Providers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-emerald-800/60">
          <div className="p-3 rounded-2xl bg-[#031510] border border-emerald-900/80">
            <span className="text-[10px] font-bold text-emerald-300/70 uppercase tracking-wider block">
              Всего
            </span>
            <span className="text-xl font-black text-white">{totalCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#031510] border border-sky-500/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-300/80 uppercase tracking-wider">
                Telegram
              </span>
              <Send className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span className="text-xl font-black text-sky-300">{telegramCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#031510] border border-blue-500/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-300/80 uppercase tracking-wider">
                Google Вход
              </span>
              <Globe className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-xl font-black text-blue-300">{googleCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#031510] border border-amber-500/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
                6-значный код
              </span>
              <Mail className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xl font-black text-amber-300">{emailCodeCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#031510] border border-emerald-400/50 bg-gradient-to-br from-[#031510] to-emerald-950/40">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Синхрон (G+Код)
              </span>
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xl font-black text-emerald-300">{syncCount}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#031510] border border-amber-500/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
                Премиум (VIP)
              </span>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xl font-black text-amber-400">{premiumCount}</span>
          </div>
        </div>

        {toastMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени, email, Telegram (@...), телефону..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#06261d] border border-emerald-800/60 rounded-2xl text-xs sm:text-sm font-medium text-white placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Plan Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setPlanFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                planFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-[#06261d] text-emerald-200/80 hover:text-white border border-emerald-800/60'
              }`}
            >
              Все тарифы ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setPlanFilter('premium')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                planFilter === 'premium'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-[#06261d] text-amber-300/80 hover:text-amber-200 border border-emerald-800/60'
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>Премиум ({premiumCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setPlanFilter('standard')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                planFilter === 'standard'
                  ? 'bg-teal-400 text-slate-950 font-black'
                  : 'bg-[#06261d] text-teal-300/80 hover:text-teal-200 border border-emerald-800/60'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Доступный ({standardCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setPlanFilter('free')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                planFilter === 'free'
                  ? 'bg-slate-300 text-slate-950 font-black'
                  : 'bg-[#06261d] text-slate-300/80 hover:text-white border border-emerald-800/60'
              }`}
            >
              Бесплатный ({freeCount})
            </button>
          </div>
        </div>

        {/* Secondary Filter: Auth Provider Pills (Telegram, Google, 6-digit code, Sync) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-black uppercase text-emerald-400/90 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-400" />
            <span>Способ входа:</span>
          </span>

          <button
            type="button"
            onClick={() => setAuthFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              authFilter === 'all'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-[#031510] text-emerald-200/80 hover:text-white border border-emerald-800/70'
            }`}
          >
            Все ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setAuthFilter('google')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              authFilter === 'google'
                ? 'bg-blue-500 text-white font-black'
                : 'bg-[#031510] text-blue-300 border border-blue-600/40 hover:bg-blue-900/30'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>Google ({googleCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthFilter('telegram')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              authFilter === 'telegram'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-[#031510] text-sky-300 border border-sky-600/40 hover:bg-sky-900/30'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>Telegram ({telegramCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthFilter('email_code')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              authFilter === 'email_code'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-[#031510] text-amber-300 border border-amber-600/40 hover:bg-amber-900/30'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>6-значный код почты ({emailCodeCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthFilter('sync')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
              authFilter === 'sync'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black'
                : 'bg-[#031510] text-emerald-300 border border-emerald-500/60 hover:bg-emerald-900/40'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Синхронизированные (Google + Код) ({syncCount})</span>
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="p-10 rounded-3xl bg-[#06261d] border border-emerald-800/60 text-center space-y-2">
            <Users className="w-10 h-10 mx-auto text-emerald-600 opacity-60" />
            <h4 className="text-base font-bold text-white">Пользователи не найдены</h4>
            <p className="text-xs text-emerald-200/60">
              По запросу «{searchQuery}» ничего не найдено. Попробуйте изменить параметры поиска.
            </p>
          </div>
        ) : (
          filteredUsers.map((u, idx) => {
            const isAdminAccount = u.identifier.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            const isPaidPrem = (u.subscriptionPlan === 'premium' && u.isPaid) || isAdminAccount;
            const isPaidStan = u.subscriptionPlan === 'standard' && u.isPaid;
            const testCount = u.testHistory?.length || 0;
            const regDate = u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('ru-RU') : '—';

            // Calculate trial status
            const regTimestamp = u.registeredAt ? new Date(u.registeredAt).getTime() : Date.now();
            const msPassed = Math.max(0, Date.now() - regTimestamp);
            const totalHoursElapsed = msPassed / (1000 * 60 * 60);
            const isTrialPrem = !u.isPaid && !isAdminAccount && totalHoursElapsed < 24;
            const trialHoursLeft = isTrialPrem ? Math.max(0, Math.floor(24 - totalHoursElapsed)) : 0;

            const isSync = isUserSynchronized(u);
            const hasGoogle = isUserGoogle(u);
            const hasTg = isUserTelegram(u);
            const hasEmailCode = isUserEmailCode(u);
            const isPhoneCode = u.authProvider === 'phone_code' || u.identifier.startsWith('+');

            return (
              <div
                key={`user_card_${u.id}_${idx}`}
                className="rounded-3xl bg-[#06261d] border border-emerald-800/60 hover:border-emerald-700 p-4 sm:p-5 shadow-lg transition-all space-y-3"
              >
                {/* Top Row: Avatar, User Details, Subscription Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <img
                      src={u.avatar || '/avatars/snow_leopard.svg'}
                      alt={u.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-emerald-400/50 shrink-0 mt-0.5 sm:mt-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-black text-sm sm:text-base truncate ${
                            isPaidPrem || isTrialPrem
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                              : 'text-white'
                          }`}
                        >
                          {u.name}
                        </h4>
                        {isAdminAccount && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                            <Shield className="w-3 h-3 text-amber-400" />
                            <span>ГЛАВНЫЙ АДМИНИСТРАТОР</span>
                          </span>
                        )}
                      </div>

                      {/* User Login Identifier & Auth Badges */}
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <p className="text-xs text-emerald-200/80 font-mono font-medium truncate">
                          {u.identifier}
                        </p>
                      </div>

                      {/* Detailed Auth Provider Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {isSync && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500/25 via-blue-500/20 to-amber-500/20 text-emerald-200 border border-emerald-400/60 flex items-center gap-1 shadow-sm">
                            <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin-slow" />
                            <span>Синхронизирован: Google + 6-значный код</span>
                          </span>
                        )}
                        {hasGoogle && !isSync && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-blue-400" />
                            <span>Google вход</span>
                          </span>
                        )}
                        {hasTg && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                            <Send className="w-3 h-3 text-sky-400" />
                            <span>Telegram {u.telegramUsername ? `@${u.telegramUsername.replace('@', '')}` : (u.telegramId ? `ID:${u.telegramId}` : '')}</span>
                          </span>
                        )}
                        {hasEmailCode && !isSync && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-amber-400" />
                            <span>6-значный код почты</span>
                          </span>
                        )}
                        {isPhoneCode && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-purple-400" />
                            <span>SMS / Телефон</span>
                          </span>
                        )}
                        {!hasGoogle && !hasTg && !hasEmailCode && !isPhoneCode && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-300 border border-slate-500/40 flex items-center gap-1">
                            <Key className="w-3 h-3 text-slate-400" />
                            <span>Пароль</span>
                          </span>
                        )}
                      </div>

                      {/* Synchronized Unified Account Banner */}
                      {isSync && (
                        <div className="mt-1.5 text-[11px] text-emerald-200/90 bg-emerald-950/60 border border-emerald-500/40 rounded-xl px-2.5 py-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                          <span>Единый профиль: вход разрешен как через Google аккаунт, так и через 6-значный код ({u.email || u.identifier})</span>
                        </div>
                      )}

                      {u.targetUniversity && (
                        <span className="text-[11px] text-emerald-300/80 flex items-center gap-1 mt-1 truncate">
                          <School className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{u.targetUniversity}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Plan Badge and Registration Date */}
                  <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] uppercase font-bold text-emerald-300/60 block">
                        Регистрация
                      </span>
                      <span className="text-xs font-bold text-slate-200">{regDate}</span>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] uppercase font-bold text-emerald-300/60 block">
                        Пройдено тестов
                      </span>
                      <span className="text-xs font-black text-emerald-300">{testCount}</span>
                    </div>

                    {isPaidPrem ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/20 to-emerald-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1.5 shadow-sm">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>👑 Премиум (до 2027)</span>
                      </span>
                    ) : isPaidStan ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-500/20 text-teal-300 border border-teal-500/50 flex items-center gap-1.5 shadow-sm">
                        <Zap className="w-3.5 h-3.5 text-teal-400" />
                        <span>⚡ Доступный (до 2027)</span>
                      </span>
                    ) : isTrialPrem ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-400/60 flex items-center gap-1.5 shadow-sm">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>⏳ Пробный VIP ({trialHoursLeft}ч)</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-emerald-700/60 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Бесплатный тариф</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Quick Action Buttons to Grant Plans */}
                <div className="pt-3 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-300/70 mr-1">
                      Выдать тариф:
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuickSetPlan(u, 'premium', true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                        isPaidPrem
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300'
                      }`}
                    >
                      <Crown className="w-3 h-3" />
                      <span>{isPaidPrem ? 'Активен Премиум' : '👑 Выдать Премиум'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSetPlan(u, 'standard', true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                        isPaidStan
                          ? 'bg-teal-400 text-slate-950'
                          : 'bg-teal-400/15 hover:bg-teal-400/25 border border-teal-400/40 text-teal-300'
                      }`}
                    >
                      <Zap className="w-3 h-3" />
                      <span>{isPaidStan ? 'Активна Доступная' : '⚡ Выдать Доступную'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSetPlan(u, 'free', false)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-emerald-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
                      title="Снять платную подписку и перевести на бесплатный тариф"
                    >
                      Сделать бесплатным
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResetTrial(u)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition-all flex items-center gap-1 cursor-pointer"
                      title="Сбросить 24-часовой пробный период"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Сбросить 24ч</span>
                    </button>
                  </div>

                  {/* Secondary buttons: Edit & Delete */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...u })}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                      title="Редактировать пользователя"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {!isAdminAccount && (
                      <button
                        type="button"
                        onClick={() => handleDelete(u)}
                        className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white transition-all cursor-pointer border border-rose-500/40 hover:border-rose-500 active:scale-95 shadow-sm"
                        title="Удалить пользователя"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New User */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#07241c] border border-emerald-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-black text-white">Добавить ученика / почту</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">ФИО / Имя</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Айбек Исмаилов"
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Email или номер телефона (Логин)
                </label>
                <input
                  type="text"
                  required
                  value={newIdentifier}
                  onChange={(e) => setNewIdentifier(e.target.value)}
                  placeholder="aibek@gmail.com или +996700000000"
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Пароль</label>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Способ авторизации пользователя
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAuthProvider('email_code')}
                    className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newAuthProvider === 'email_code'
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                        : 'bg-[#031510] text-slate-300 border-emerald-800/60 hover:border-emerald-700'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>6-значный код почты</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAuthProvider('google')}
                    className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newAuthProvider === 'google'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400'
                        : 'bg-[#031510] text-slate-300 border-emerald-800/60 hover:border-emerald-700'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Google вход</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAuthProvider('telegram')}
                    className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newAuthProvider === 'telegram'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                        : 'bg-[#031510] text-slate-300 border-emerald-800/60 hover:border-emerald-700'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Telegram вход</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewAuthProvider('password')}
                    className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      newAuthProvider === 'password'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                        : 'bg-[#031510] text-slate-300 border-emerald-800/60 hover:border-emerald-700'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Пароль / Телефон</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Тарифный план</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewPlan('premium');
                      setNewIsPaid(true);
                    }}
                    className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      newPlan === 'premium'
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-[#031510] text-amber-300 border-emerald-800'
                    }`}
                  >
                    👑 Премиум
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPlan('standard');
                      setNewIsPaid(true);
                    }}
                    className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      newPlan === 'standard'
                        ? 'bg-teal-400 text-slate-950 border-teal-400'
                        : 'bg-[#031510] text-teal-300 border-emerald-800'
                    }`}
                  >
                    ⚡ Доступный
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewPlan('free');
                      setNewIsPaid(false);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      newPlan === 'free'
                        ? 'bg-slate-300 text-slate-950 border-slate-300'
                        : 'bg-[#031510] text-slate-300 border-emerald-800'
                    }`}
                  >
                    Бесплатный
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Целевой университет
                </label>
                <select
                  value={newUniversity}
                  onChange={(e) => setNewUniversity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-emerald-400 cursor-pointer truncate"
                >
                  {KYRGYZ_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni} className="bg-[#031510] text-white">
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 font-black text-xs text-slate-950 shadow-lg cursor-pointer"
                >
                  Создать и выдать тариф
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#07241c] border border-emerald-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-white">Редактирование пользователя</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">ФИО / Имя</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Email или телефон (Логин)
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.identifier}
                  onChange={(e) => setEditingUser({ ...editingUser, identifier: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Пароль</label>
                <input
                  type="text"
                  required
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">Тарифный план</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingUser({
                        ...editingUser,
                        subscriptionPlan: 'premium',
                        isPaid: true,
                        subscriptionExpiry: '2027-06-01',
                      })
                    }
                    className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      editingUser.subscriptionPlan === 'premium'
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-[#031510] text-amber-300 border-emerald-800'
                    }`}
                  >
                    👑 Премиум
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingUser({
                        ...editingUser,
                        subscriptionPlan: 'standard',
                        isPaid: true,
                        subscriptionExpiry: '2027-06-01',
                      })
                    }
                    className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      editingUser.subscriptionPlan === 'standard'
                        ? 'bg-teal-400 text-slate-950 border-teal-400'
                        : 'bg-[#031510] text-teal-300 border-emerald-800'
                    }`}
                  >
                    ⚡ Доступный
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingUser({
                        ...editingUser,
                        subscriptionPlan: 'free',
                        isPaid: false,
                      })
                    }
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      editingUser.subscriptionPlan === 'free' || !editingUser.subscriptionPlan
                        ? 'bg-slate-300 text-slate-950 border-slate-300'
                        : 'bg-[#031510] text-slate-300 border-emerald-800'
                    }`}
                  >
                    Бесплатный
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Целевой балл ОРТ
                </label>
                <input
                  type="number"
                  min="110"
                  max="245"
                  value={editingUser.targetScore || 215}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, targetScore: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-[#031510] border border-emerald-800/60 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 font-black text-xs text-slate-950 shadow-lg cursor-pointer"
                >
                  Сохранить изменения
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete User Confirmation */}
      {userToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#07241c] border border-rose-600/70 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Удалить пользователя?</h3>
                <p className="text-xs text-rose-200/80">Это действие невозможно отменить</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#041a14] border border-emerald-900/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Имя ученика:</span>
                <span className="font-bold text-white">{userToDelete.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Логин / Почта / Номер:</span>
                <span className="font-bold text-emerald-300">{userToDelete.identifier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Текущий тариф:</span>
                <span className="font-bold text-amber-300 capitalize">
                  {userToDelete.subscriptionPlan === 'premium'
                    ? 'VIP Премиум'
                    : userToDelete.subscriptionPlan === 'standard'
                    ? 'Доступная'
                    : 'Бесплатный'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Вы действительно хотите безвозвратно удалить аккаунт пользователя <strong className="text-white">{userToDelete.name}</strong>? Все сохраненные результаты тестов, баллы и статистика будут удалены.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  adminDeleteUser(userToDelete.id);
                  refreshList();
                  showToast(`Пользователь ${userToDelete.name} (${userToDelete.identifier}) успешно удален`);
                  setUserToDelete(null);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-xs font-black text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Да, удалить</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
