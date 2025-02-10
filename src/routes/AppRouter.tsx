import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "./routeConfig.ts";

const LoginPage = lazy(() => import("@/pages/Login/LoginPage.tsx") )

export const AppRoute = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}