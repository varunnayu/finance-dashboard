import { useEffect, useState } from "react";
import Preloader from "./components/common/Preloader";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";

import { FinanceProvider } from "./context/FinanceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";

function App() {
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <FinanceProvider>
            <BrowserRouter>
              <Toaster position="top-right" />
              <AnimatePresence mode="wait">
                {loading ? (
                  <Preloader key="preloader" />
                ) : (
                  <AppRoutes key="app" />
                )}
              </AnimatePresence>
            </BrowserRouter>
          </FinanceProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;