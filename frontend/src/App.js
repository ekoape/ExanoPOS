import "@/App.css";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { PosProvider, usePos } from "@/context/PosContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Kasir from "@/pages/Kasir";
import Setting from "@/pages/Setting";

const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

const Protected = ({ children, roles }) => {
  const { currentUser } = usePos();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/kasir" replace />;
  return children;
};

function App() {
  return (
    <PosProvider>
      <Router>        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >
            <Route
              index
              element={
                <Protected roles={["Admin", "Manager"]}>
                  <Dashboard />
                </Protected>
              }
            />
            <Route path="kasir" element={<Kasir />} />
            <Route
              path="setting"
              element={
                <Protected roles={["Admin", "Manager"]}>
                  <Setting />
                </Protected>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </PosProvider>
  );
}

export default App;
