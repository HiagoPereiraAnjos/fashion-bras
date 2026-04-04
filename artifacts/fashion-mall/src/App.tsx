import { Switch, Route, Router as WouterRouter } from "wouter";
import { AdminDataProvider } from "@/services/content";
import HomePage from "@/pages/HomePage";
import StoresPage from "@/pages/StoresPage";
import StoreDetailPage from "@/pages/StoreDetailPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import LeasingPage from "@/pages/LeasingPage";
import AboutPage from "@/pages/AboutPage";
import AdminPage from "@/pages/AdminPage";
import NotFound from "@/pages/not-found";

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
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    // Keep provider bootstrap centralized; swap to "supabase" when repository is implemented.
    <AdminDataProvider repositoryKind="local">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </AdminDataProvider>
  );
}

export default App;
