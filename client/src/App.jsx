import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import StartupDetail from './pages/StartupDetail.jsx';
import AdminLogin from './pages/admin/Login.jsx';
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminStartupForm from './pages/admin/StartupForm.jsx';
import { ProtectedRoute } from './context/AuthContext.jsx';

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <Navbar variant={isAdmin ? 'admin' : 'public'} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/startups/:id" element={<StartupDetail />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/startups/new"
            element={
              <ProtectedRoute>
                <AdminStartupForm mode="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/startups/:id/edit"
            element={
              <ProtectedRoute>
                <AdminStartupForm mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ia-brand">
        404
      </p>
      <h1 className="mt-3 text-5xl font-extrabold tracking-tighter-2">
        Page not found
      </h1>
      <p className="mt-4 text-ia-muted">
        The link you followed may be broken or the page may have been moved.
      </p>
    </div>
  );
}
