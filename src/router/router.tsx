import Layout from "@/components/Layout/Layout";
import ChefService from "@/pages/ChefService";
import CouponManagement from "@/pages/CouponManagement";
import Dashboard from "@/pages/Dashboard";
import ImageGallery from "@/pages/ImagesGallery";
import Login from "@/pages/Login";
import NotificationPage from "@/pages/Notification";
import Orders from "@/pages/Orders";
import Plans from "@/pages/Plans";
import Profile from "@/pages/Profile";
import Query from "@/pages/Query";
import UserManagement from "@/pages/UserManagement";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const isAuthenticated = () => {
  // Replace this with your actual authentication check
  return localStorage.getItem("token") !== null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (!isAuthenticated()) {
    console.log("hello");
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usermanagement"
          element={
            <ProtectedRoute>
              <Layout>
                <UserManagement/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Layout>
                <Orders/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chefservice"
          element={
            <ProtectedRoute>
              <Layout>
                <ChefService/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/couponmanagement"
          element={
            <ProtectedRoute>
              <Layout>
                <CouponManagement/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Layout>
                <ImageGallery/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <Layout>
                <Plans />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/query"
          element={
            <ProtectedRoute>
              <Layout>
                <Query />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Redirect to dashboard if the route doesn't match */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
