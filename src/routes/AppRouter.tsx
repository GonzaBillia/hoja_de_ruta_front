import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig.ts";
import { RedirectIfAuthenticated } from "@/components/modules/login/wrapper/authenticated.tsx";
import FullScreenLoader from "@/components/common/loader/FSLoader.tsx";
import { ProtectedRoute } from "@/components/modules/auth/protectedRouteWrapper.tsx";
import Sucursales from "@/pages/Sucursales/Sucursales.tsx";
import Depositos from "@/pages/Depositos/Depositos.tsx";

const LoginPage = lazy(() => import("@/pages/Login/LoginPage.tsx") )
const DashboardLayout = lazy(() => import ("@/layouts/Dashboard.tsx"))
const HojasRuta = lazy(() => import ("@/pages/HojasRuta/HojasRuta.tsx"))
const NuevaRuta = lazy(() => import ("@/pages/NuevaRuta/NuevaRuta.tsx"))
const DetalleHojaRuta = lazy (() => import ("@/pages/DetallehojasRuta/detalleHojasRuta.tsx"))
const ObservacionesRuta = lazy(() => import ("@/pages/Observaciones/Observaciones.tsx"))

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
                        <Route
                            path={ROUTES.NUEVA}
                            element={
                                <ProtectedRoute requiredRole={["superadmin", "deposito"]}>
                                <NuevaRuta />
                                </ProtectedRoute>
                            }
                        />
                        <Route path={ROUTES.HOJA} element={<DetalleHojaRuta />} />
                        <Route path={ROUTES.OBS} element={
                            <ProtectedRoute requiredRole={["superadmin", "deposito"]}>
                                <ObservacionesRuta />
                            </ProtectedRoute>
                        } />
                        <Route
                            path={ROUTES.SUCUS}
                            element={
                                <ProtectedRoute requiredRole={["superadmin"]}>
                                <Sucursales />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={ROUTES.DEPOS}
                            element={
                                <ProtectedRoute requiredRole={["superadmin"]}>
                                <Depositos />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}