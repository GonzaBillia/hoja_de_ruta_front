import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig.ts";
import { RedirectIfAuthenticated } from "@/components/modules/login/wrapper/authenticated.tsx";
import DashboardLayout from "@/layouts/Dashboard.tsx";

const LoginPage = lazy(() => import("@/pages/Login/LoginPage.tsx") )

export const AppRoute = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={
                        <RedirectIfAuthenticated>
                            <LoginPage />
                        </RedirectIfAuthenticated>
                    } />
                    <Route path={ROUTES.MAIN} element={<DashboardLayout />}>
                        <Route />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}