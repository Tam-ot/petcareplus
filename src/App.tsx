/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { AuthModal, AuthModalMode } from './components/AuthModal';
import { BlogEditorModal } from './components/BlogEditorModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { BLOG_POSTS, SERVICE_OPTIONS } from './data/petcareData';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import {
  deleteBlogPost,
  fetchAuthSession,
  fetchBlogPosts,
  logoutAccount,
  updateBlogPost,
} from './services/blogApi';
import { AuthSession, BlogPostItem, PageRoute } from './types';

function parseHashRoute(): { page: PageRoute; articleSlug: string | null } {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === 'blog') {
    return { page: 'blog', articleSlug: null };
  }
  if (hash.startsWith('blog/')) {
    const slug = hash.slice('blog/'.length);
    if (slug) {
      return { page: 'blog-detail', articleSlug: slug };
    }
    return { page: 'blog', articleSlug: null };
  }
  if (hash === 'lien-he') {
    return { page: 'contact', articleSlug: null };
  }
  return { page: 'home', articleSlug: null };
}

export default function App() {
  const initialRoute = parseHashRoute();
  const [activePage, setActivePage] = useState<PageRoute>(initialRoute.page);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(
    initialRoute.articleSlug
  );
  const [preselectedService, setPreselectedService] = useState<string>(
    SERVICE_OPTIONS[0]
  );

  const [posts, setPosts] = useState<BlogPostItem[]>(BLOG_POSTS);
  const [authSession, setAuthSession] = useState<AuthSession>({
    authenticated: false,
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isAdmin =
    authSession.authenticated && authSession.user?.role === 'admin';

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const refreshPosts = useCallback(async () => {
    try {
      const serverPosts = await fetchBlogPosts();
      setPosts(serverPosts);
    } catch {
      // Keep current posts if server is temporarily unreachable
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const session = await fetchAuthSession();
        setAuthSession(session);
      } catch {
        // Ignore auth check error
      }
      await refreshPosts();
    };
    init();

    // Periodically refresh posts so scheduled posts auto-publish on time
    const intervalId = window.setInterval(refreshPosts, 30000);
    return () => window.clearInterval(intervalId);
  }, [refreshPosts]);

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHashRoute();
      setActivePage(next.page);
      setSelectedArticleSlug(next.articleSlug);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageRoute, scrollTargetId?: string) => {
    setActivePage(page);
    if (page !== 'blog-detail') {
      setSelectedArticleSlug(null);
    }

    const nextHash =
      page === 'home'
        ? '#trang-chu'
        : page === 'blog'
        ? '#blog'
        : page === 'contact'
        ? '#lien-he'
        : window.location.hash;

    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }

    if (scrollTargetId) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.getElementById(scrollTargetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 40);
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setActivePage('blog-detail');
    window.history.pushState(null, '', `#blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForContact = (serviceValue: string) => {
    setPreselectedService(serviceValue);
    navigateTo('contact', 'consultation-form');
  };

  const handleHeaderConsult = () => {
    setPreselectedService('Chưa xác định — cần PETCARE PLUS tư vấn thêm');
    navigateTo('contact', 'consultation-form');
  };

  const handleOpenAuthModal = (mode: AuthModalMode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = async (
    session: AuthSession,
    mode: AuthModalMode
  ) => {
    setAuthSession(session);
    await refreshPosts();
    if (session.user?.role === 'admin') {
      showToast(
        `Đã đăng nhập tài khoản Admin (${session.user.email}) — bạn có quyền đăng bài Blog.`
      );
    } else if (mode === 'register') {
      showToast(
        `Đăng ký thành công! Chào mừng ${session.user?.fullName ?? 'bạn'} đến với PETCARE PLUS.`
      );
    } else {
      showToast(`Chào mừng trở lại, ${session.user?.fullName ?? 'bạn'}!`);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAccount();
    } catch {
      // ignore
    }
    setAuthSession({ authenticated: false });
    await refreshPosts();
    showToast('Đã đăng xuất tài khoản.');
  };

  const handleOpenCreatePost = () => {
    if (!isAdmin) return;
    setEditingPost(null);
    setEditorModalOpen(true);
  };

  const handleEditPost = (post: BlogPostItem) => {
    if (!isAdmin) return;
    setEditingPost(post);
    setEditorModalOpen(true);
  };

  const handlePostSaved = async (savedPost: BlogPostItem) => {
    await refreshPosts();
    if (savedPost.status === 'scheduled') {
      showToast('Đã lên lịch đăng bài viết thành công.');
    } else if (savedPost.status === 'draft') {
      showToast('Đã lưu bản nháp thành công.');
    } else {
      showToast('Đã đăng bài lên Blog thành công.');
    }
    if (activePage !== 'blog' && activePage !== 'blog-detail') {
      navigateTo('blog');
    }
  };

  const handlePublishNow = async (post: BlogPostItem) => {
    if (!isAdmin) return;
    try {
      await updateBlogPost(post.slug, { status: 'published' });
      await refreshPosts();
      showToast(`Đã xuất bản ngay: "${post.title}"`);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Không thể xuất bản bài viết.'
      );
    }
  };

  const handleDeletePost = async (post: BlogPostItem) => {
    if (!isAdmin) return;
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa bài đăng "${post.title}"?`
    );
    if (!confirmed) return;

    try {
      await deleteBlogPost(post.slug);
      await refreshPosts();
      if (selectedArticleSlug === post.slug) {
        navigateTo('blog');
      }
      showToast('Đã xóa bài đăng khỏi Blog.');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Không thể xóa bài viết.'
      );
    }
  };

  const activeArticle =
    posts.find((post) => post.slug === selectedArticleSlug) ?? posts[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1E8] text-[#332C28]">
      <Header
        activePage={activePage}
        onNavigate={(page) => navigateTo(page)}
        onConsultClick={handleHeaderConsult}
        authSession={authSession}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCreatePost={handleOpenCreatePost}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            posts={posts}
            onNavigate={(page) => navigateTo(page)}
            onOpenArticle={handleOpenArticle}
            onSelectServiceForContact={handleSelectServiceForContact}
          />
        )}

        {activePage === 'blog' && (
          <BlogPage
            posts={posts}
            isAuthenticated={authSession.authenticated}
            isAdmin={isAdmin}
            adminName={authSession.user?.fullName}
            onOpenArticle={handleOpenArticle}
            onOpenCreatePost={handleOpenCreatePost}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onPublishNow={handlePublishNow}
            onOpenAdminLogin={() => handleOpenAuthModal('login')}
          />
        )}

        {activePage === 'blog-detail' && activeArticle && (
          <BlogDetailPage
            article={activeArticle}
            allPosts={posts}
            isAdmin={isAdmin}
            onEditArticle={handleEditPost}
            onBackToBlog={() => navigateTo('blog')}
            onOpenArticle={handleOpenArticle}
            onSelectServiceForContact={handleSelectServiceForContact}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage preselectedService={preselectedService} />
        )}
      </main>

      <Footer
        onNavigate={(page) => navigateTo(page)}
        onSelectServiceForContact={handleSelectServiceForContact}
      />

      {/* Unified Login / Email Registration Modal */}
      <AuthModal
        open={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Blog & Video Composer / Scheduler Modal (Admin Only) */}
      <BlogEditorModal
        open={editorModalOpen && isAdmin}
        editingPost={editingPost}
        onClose={() => {
          setEditorModalOpen(false);
          setEditingPost(null);
        }}
        onSaved={handlePostSaved}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-[110] max-w-sm rounded-2xl bg-[#233B53] px-5 py-3.5 text-sm font-medium text-white shadow-xl"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
