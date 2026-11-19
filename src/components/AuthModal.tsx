import React, { useEffect, useState } from 'react';
import { Lock, Mail, ShieldCheck, User, UserPlus, X } from 'lucide-react';
import { loginAccount, registerWithEmail } from '../services/blogApi';
import { AuthSession } from '../types';

export type AuthModalMode = 'login' | 'register';

interface AuthModalProps {
  open: boolean;
  initialMode?: AuthModalMode;
  onClose: () => void;
  onSuccess: (session: AuthSession, mode: AuthModalMode) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<AuthModalMode>(initialMode);
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setError(null);
    setPassword('');
    setConfirmPassword('');
  }, [open, initialMode]);

  if (!open) return null;

  const switchMode = (nextMode: AuthModalMode) => {
    setMode(nextMode);
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!identifier.trim() || !password) {
        setError('Vui lòng nhập đầy đủ email (hoặc tài khoản Admin) và mật khẩu.');
        return;
      }

      setSubmitting(true);
      try {
        const session = await loginAccount(identifier.trim(), password);
        setPassword('');
        onSuccess(session, 'login');
        onClose();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Đăng nhập không thành công.'
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Register mode
    if (fullName.trim().length < 2) {
      setError('Vui lòng nhập họ và tên (tối thiểu 2 ký tự).');
      return;
    }
    if (!identifier.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu cần có tối thiểu 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setSubmitting(true);
    try {
      const session = await registerWithEmail(
        fullName.trim(),
        identifier.trim(),
        password
      );
      setFullName('');
      setPassword('');
      setConfirmPassword('');
      onSuccess(session, 'register');
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Đăng ký tài khoản không thành công.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#233B53]/50 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-[24px] border border-[#233B53]/10 bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cửa sổ tài khoản"
          className="absolute right-4 top-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[#332C28]/70 transition-colors hover:bg-[#F5F1E8] hover:text-[#233B53]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Mode Tabs */}
        <div className="inline-flex rounded-xl bg-[#F5F1E8] p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-[#233B53] text-white shadow-xs'
                : 'text-[#332C28]/75 hover:text-[#233B53]'
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              mode === 'register'
                ? 'bg-[#233B53] text-white shadow-xs'
                : 'text-[#332C28]/75 hover:text-[#233B53]'
            }`}
          >
            Đăng ký bằng Email
          </button>
        </div>

        <h2
          id="auth-modal-title"
          className="mt-5 font-[var(--font-display)] text-2xl font-bold text-[#233B53]"
        >
          {mode === 'login'
            ? 'Đăng nhập PETCARE PLUS'
            : 'Tạo tài khoản bằng Email'}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#332C28]/75">
          {mode === 'login'
            ? 'Đăng nhập bằng email thành viên hoặc tài khoản Admin (chỉ Admin có quyền đăng và lên lịch bài viết Blog).'
            : 'Đăng ký tài khoản miễn phí bằng email của bạn để đồng hành cùng PETCARE PLUS.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-fullname"
                className="block text-sm font-semibold text-[#233B53]"
              >
                Họ và tên
              </label>
              <div className="relative mt-1.5">
                <User
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#233B53]/50"
                  aria-hidden="true"
                />
                <input
                  id="auth-fullname"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  className="w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 py-3 pl-10 pr-4 text-sm text-[#332C28] outline-none transition-colors focus:border-[#233B53] focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-identifier"
              className="block text-sm font-semibold text-[#233B53]"
            >
              {mode === 'login' ? 'Email hoặc tài khoản Admin' : 'Địa chỉ Email'}
            </label>
            <div className="relative mt-1.5">
              <Mail
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#233B53]/50"
                aria-hidden="true"
              />
              <input
                id="auth-identifier"
                type={mode === 'register' ? 'email' : 'text'}
                autoComplete={mode === 'register' ? 'email' : 'username'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  mode === 'login'
                    ? 'ban@email.com hoặc admin'
                    : 'ban@email.com'
                }
                className="w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 py-3 pl-10 pr-4 text-sm text-[#332C28] outline-none transition-colors focus:border-[#233B53] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-sm font-semibold text-[#233B53]"
            >
              Mật khẩu
            </label>
            <div className="relative mt-1.5">
              <Lock
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#233B53]/50"
                aria-hidden="true"
              />
              <input
                id="auth-password"
                type="password"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === 'register'
                    ? 'Tối thiểu 6 ký tự'
                    : 'Nhập mật khẩu của bạn'
                }
                className="w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 py-3 pl-10 pr-4 text-sm text-[#332C28] outline-none transition-colors focus:border-[#233B53] focus:bg-white"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-confirm-password"
                className="block text-sm font-semibold text-[#233B53]"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative mt-1.5">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#233B53]/50"
                  aria-hidden="true"
                />
                <input
                  id="auth-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/40 py-3 pl-10 pr-4 text-sm text-[#332C28] outline-none transition-colors focus:border-[#233B53] focus:bg-white"
                />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="flex items-start gap-2 rounded-xl bg-[#F5F1E8]/70 px-3.5 py-2.5 text-xs text-[#332C28]/80">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-[#E99A78]"
                aria-hidden="true"
              />
              <span>
                Tài khoản thành viên chỉ xem nội dung; chỉ tài khoản{' '}
                <strong className="text-[#233B53]">Admin</strong> mới có quyền đăng bài viết và video trong mục Blog.
              </span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#233B53] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1A2D40] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mode === 'login' ? (
              <Lock className="h-4 w-4" aria-hidden="true" />
            ) : (
              <UserPlus className="h-4 w-4" aria-hidden="true" />
            )}
            <span>
              {submitting
                ? 'Đang xử lý...'
                : mode === 'login'
                ? 'Đăng nhập'
                : 'Đăng ký tài khoản'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

