import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../components/Dashboard/Dashboard";
import Analytics from "../pages/Analytics/Analytics";
import Transactions from "../pages/Transactions/Transactions";
import Insights from "../pages/Insights/Insights";
import Goals from "../pages/Goals/Goals";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";

import Layout from "../components/layout/Layout";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes Wrapper */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/transactions" element={<Transactions />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/insights" element={<Insights />} />
                                <Route path="/goals" element={<Goals />} />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;