import React, { useState, useEffect } from 'react';
import {
  LogIn,
  LogOut,
  Menu,
  PenSquare,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { AuthSession, PageRoute } from '../types';
import { AuthModalMode } from './AuthModal';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onConsultClick: () => void;
  authSession: AuthSession;
  onOpenAuthModal: (mode: AuthModalMode) => void;
  onOpenCreatePost: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onConsultClick,
  authSession,
  onOpenAuthModal,
  onOpenCreatePost,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePage]);

  const isHomeActive = activePage === 'home';
  const isBlogActive = activePage === 'blog' || activePage === 'blog-detail';
  const isContactActive = activePage === 'contact';
  const isAdmin =
    authSession.authenticated && authSession.user?.role === 'admin';

  const handleNav = (page: PageRoute) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  const handleConsult = () => {
    setMobileMenuOpen(false);
    onConsultClick();
  };

  const navLinkClass = (active: boolean) =>
    `relative py-1.5 text-base font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#233B53] ${
      active
        ? 'text-[#233B53] font-semibold'
        : 'text-[#332C28]/75 hover:text-[#233B53]'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#233B53]/10 bg-[#F5F1E8]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-8 lg:px-10 xl:px-12">
        {/* Zone 1: Brand mark & single-line wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          aria-label="PETCARE PLUS — Về trang chủ"
          className="cursor-pointer rounded-lg py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#233B53]"
        >
          <BrandLogo />
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-8 md:flex"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            aria-current={isHomeActive ? 'page' : undefined}
            className={`cursor-pointer ${navLinkClass(isHomeActive)}`}
          >
            Trang chủ
            {isHomeActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-[2px] h-0.5 rounded-full bg-[#E99A78]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('blog')}
            aria-current={isBlogActive ? 'page' : undefined}
            className={`cursor-pointer ${navLinkClass(isBlogActive)}`}
          >
            Blog
            {isBlogActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-[2px] h-0.5 rounded-full bg-[#E99A78]"
              />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav('contact')}
            aria-current={isContactActive ? 'page' : undefined}
            className={`cursor-pointer ${navLinkClass(isContactActive)}`}
          >
            Liên hệ
            {isContactActive && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-[2px] h-0.5 rounded-full bg-[#E99A78]"
              />
            )}
          </button>
        </nav>

        {/* Zone 3: Account Controls + Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-2.5 shrink-0">
          {authSession.authenticated && authSession.user ? (
            <div className="hidden items-center gap-2 md:flex">
              <div
                title={`${authSession.user.fullName} (${authSession.user.email})`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#233B53]/15 bg-white/85 px-3 py-2 text-xs font-semibold text-[#233B53]"
              >
                {isAdmin ? (
                  <ShieldCheck
                    className="h-4 w-4 text-[#E99A78]"
                    aria-hidden="true"
                  />
                ) : (
                  <User
                    className="h-4 w-4 text-[#233B53]/75"
                    aria-hidden="true"
                  />
                )}
                <span className="max-w-[130px] truncate">
                  {isAdmin ? 'Admin' : authSession.user.fullName}
                </span>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={onOpenCreatePost}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#E99A78] px-4 py-2.5 text-sm font-semibold text-[#233B53] whitespace-nowrap transition-colors hover:bg-[#e18862]"
                >
                  <PenSquare className="h-4 w-4" aria-hidden="true" />
                  <span>Đăng bài</span>
                </button>
              )}

              <button
                type="button"
                onClick={onLogout}
                title="Đăng xuất"
                aria-label="Đăng xuất tài khoản"
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#233B53]/15 bg-white text-[#233B53] transition-colors hover:bg-[#F5F1E8]"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#233B53]/15 bg-white/80 px-3.5 py-2.5 text-sm font-semibold text-[#233B53] whitespace-nowrap transition-colors hover:bg-white"
              >
                <LogIn className="h-4 w-4 text-[#233B53]/75" aria-hidden="true" />
                <span>Đăng nhập</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#E99A78]/25 px-3.5 py-2.5 text-sm font-semibold text-[#233B53] whitespace-nowrap transition-colors hover:bg-[#E99A78]/40"
              >
                <UserPlus className="h-4 w-4 text-[#233B53]" aria-hidden="true" />
                <span>Đăng ký</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleConsult}
            className="hidden cursor-pointer items-center justify-center rounded-xl bg-[#233B53] px-5 py-2.5 text-[15px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#1A2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53] lg:inline-flex"
          >
            Tư vấn dịch vụ
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={
              mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'
            }
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#233B53]/15 bg-white text-[#233B53] transition-colors hover:bg-[#F5F1E8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#233B53] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="border-t border-[#233B53]/10 bg-white px-4 pb-5 pt-3 md:hidden"
        >
          <nav aria-label="Điều hướng di động" className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleNav('home')}
              aria-current={isHomeActive ? 'page' : undefined}
              className={`flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-left text-[15px] font-medium transition-colors ${
                isHomeActive
                  ? 'bg-[#F5F1E8] font-semibold text-[#233B53]'
                  : 'text-[#332C28] hover:bg-[#F5F1E8]/60'
              }`}
            >
              <span>Trang chủ</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('blog')}
              aria-current={isBlogActive ? 'page' : undefined}
              className={`flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-left text-[15px] font-medium transition-colors ${
                isBlogActive
                  ? 'bg-[#F5F1E8] font-semibold text-[#233B53]'
                  : 'text-[#332C28] hover:bg-[#F5F1E8]/60'
              }`}
            >
              <span>Blog</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('contact')}
              aria-current={isContactActive ? 'page' : undefined}
              className={`flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl px-4 py-2.5 text-left text-[15px] font-medium transition-colors ${
                isContactActive
                  ? 'bg-[#F5F1E8] font-semibold text-[#233B53]'
                  : 'text-[#332C28] hover:bg-[#F5F1E8]/60'
              }`}
            >
              <span>Liên hệ</span>
            </button>

            <div className="space-y-2 pt-3">
              {authSession.authenticated && authSession.user ? (
                <div className="space-y-2 rounded-xl bg-[#F5F1E8]/70 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#233B53]">
                    {isAdmin ? (
                      <ShieldCheck
                        className="h-4 w-4 text-[#E99A78]"
                        aria-hidden="true"
                      />
                    ) : (
                      <User className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="truncate">
                      {authSession.user.fullName} ({authSession.user.email})
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onOpenCreatePost();
                        }}
                        className="flex min-h-[42px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#E99A78] px-4 py-2 text-sm font-semibold text-[#233B53]"
                      >
                        <PenSquare className="h-4 w-4" aria-hidden="true" />
                        <span>Đăng bài</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="flex min-h-[42px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#233B53]/20 bg-white px-4 py-2 text-sm font-semibold text-[#233B53]"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal('login');
                    }}
                    className="flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[#233B53]/20 bg-[#F5F1E8]/60 px-4 py-2.5 text-sm font-semibold text-[#233B53]"
                  >
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    <span>Đăng nhập</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal('register');
                    }}
                    className="flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#E99A78]/30 px-4 py-2.5 text-sm font-semibold text-[#233B53]"
                  >
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    <span>Đăng ký</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleConsult}
                className="flex min-h-[44px] w-full cursor-pointer items-center justify-center rounded-xl bg-[#233B53] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A2D40]"
              >
                Tư vấn dịch vụ
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
