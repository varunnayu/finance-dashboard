import { useEffect, useState } from "react";
import Preloader from "./components/common/Preloader";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";

import { FinanceProvider } from "./context/FinanceContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <FinanceProvider>
            <BrowserRouter>
              <Toaster position="top-right" />
              <AppRoutes />
            </BrowserRouter>
          </FinanceProvider>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;