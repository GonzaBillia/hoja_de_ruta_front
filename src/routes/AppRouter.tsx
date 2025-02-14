import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig.ts";
import { RedirectIfAuthenticated } from "@/components/modules/login/wrapper/authenticated.tsx";
import FullScreenLoader from "@/components/common/loader/FSLoader.tsx";

const LoginPage = lazy(() => import("@/pages/Login/LoginPage.tsx") )
const DashboardLayout = lazy(() => import ("@/layouts/Dashboard.tsx"))
const HojasRuta = lazy(() => import ("@/pages/HojasRuta/HojasRuta.tsx"))
const NuevaRuta = lazy(() => import ("@/pages/NuevaRuta/NuevaRuta.tsx"))
const DetalleHojaRuta = lazy (() => import ("@/pages/DetallehojasRuta/detalleHojasRuta.tsx"))

export const AppRoute = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<FullScreenLoader />}>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={
                        <RedirectIfAuthenticated>
                            <LoginPage />
                        </RedirectIfAuthenticated>
                    } />
                    <Route path={ROUTES.MAIN} element={<DashboardLayout />}>
                        <Route path={ROUTES.MAIN} element={<HojasRuta />} />
                        <Route path={ROUTES.NUEVA} element={<NuevaRuta />} />
                        <Route path={ROUTES.HOJA} element={<DetalleHojaRuta />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}