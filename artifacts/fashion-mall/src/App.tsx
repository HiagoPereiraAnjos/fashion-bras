import { Suspense, lazy } from 'react';
import { Route, Router as WouterRouter, Switch } from 'wouter';
import { AdminRouteGuard } from '@/components/auth/AdminRouteGuard';
import { runtimeConfig } from '@/config/runtime';
import { AdminAuthProvider } from '@/context/auth/AdminAuthProvider';
import { AdminDataProvider } from '@/services/content';
import AboutPage from '@/pages/AboutPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import HomePage from '@/pages/HomePage';
import LeasingPage from '@/pages/LeasingPage';
import NotFound from '@/pages/not-found';
import StoreDetailPage from '@/pages/StoreDetailPage';
import StoresPage from '@/pages/StoresPage';
import AdminLoginPage from '@/pages/AdminLoginPage';

const AdminPage = lazy(() => import('@/pages/AdminPage'));

function AdminPageRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <AdminRouteGuard>
        <AdminPage />
      </AdminRouteGuard>
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/lojas" component={StoresPage} />
      <Route path="/lojas/:id" component={StoreDetailPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/locacao" component={LeasingPage} />
      <Route path="/sobre" component={AboutPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminPageRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <AdminDataProvider repositoryKind={runtimeConfig.contentBackendMode}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}

export default App;
