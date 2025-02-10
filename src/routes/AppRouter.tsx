import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig.ts";
import { RedirectIfAuthenticated } from "@/components/modules/login/wrapper/authenticated.tsx";

const LoginPage = lazy(() => import("@/pages/Login/LoginPage.tsx") )
const DashboardLayout = lazy(() => import ("@/layouts/Dashboard.tsx"))
const HojasRuta = lazy(() => import ("@/pages/HojasRuta/HojasRuta.tsx"))

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
                        <Route path={ROUTES.HOJAS} element={<HojasRuta />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}