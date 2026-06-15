import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../components/Dashboard/Dashboard";
import Analytics from "../pages/Analytics/Analytics";
import Transactions from "../pages/Transactions/Transactions";
import Insights from "../pages/Insights/Insights";
import Goals from "../pages/Goals/Goals";
import Budgets from "../pages/Budgets/Budgets";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import OCR from "../pages/OCR/OCR";
import { ENABLE_BUDGETS } from "../context/FinanceContext";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
                path="/*"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Dashboard />}
                                />

                                <Route
                                    path="/transactions"
                                    element={<Transactions />}
                                />

                                <Route
                                    path="/analytics"
                                    element={<Analytics />}
                                />

                                <Route
                                    path="/insights"
                                    element={<Insights />}
                                />
                                <Route
                                    path="/ocr"
                                    element={<OCR />}
                                />
                                <Route
                                    path="/goals"
                                    element={<Goals />}
                                />

                                {/* NEW BUDGET PAGE */}
                                {ENABLE_BUDGETS && (
                                    <Route
                                        path="/budgets"
                                        element={<Budgets />}
                                    />
                                )}
                                <Route
                                    path="*"
                                    element={
                                        <Navigate
                                            to="/"
                                            replace
                                        />
                                    }
                                />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;