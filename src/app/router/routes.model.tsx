import { LoginPage, RegisterPage } from "@/pages/auth";
import { LandingPage } from "@/pages/landing";
import { ProfilePage } from "@/pages/profile";
import { CompaniesPage } from "@/pages/companies";
import { OverviewPage } from "@/pages/overview";
import { CompanyLayout, MainLayout } from "@/app/layouts"; // <-- добавили MainLayout
import type { IRoute } from "./types";
import { CreateCompanyPage } from "@/pages/companies/CreateCompanyPage";
import { JoinCompanyPage } from "@/pages/companies/JoinCompanyPage";
import { MembersPage } from "@/pages/company-members/MembersPage";
import { SettingsPage } from "@/pages/company-settings/SettingsPage";

export const publicRoutes: IRoute[] = [
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
];

export const protectedRoutes: IRoute[] = [
  {
    // MainLayout без path — просто обертка
    element: <MainLayout />,
    children: [
      { path: "/profile", element: <ProfilePage /> },
      { path: "/companies", element: <CompaniesPage /> },
      { path: "/companies/create", element: <CreateCompanyPage /> },
      { path: "/companies/join", element: <JoinCompanyPage /> },
    ],
  },
  {
    path: "/app",
    element: <CompanyLayout />,
    children: [
      { path: "overview/:id", element: <OverviewPage /> },
      { path: "members/:id", element: <MembersPage /> },
      { path: "settings/:id", element: <SettingsPage /> },
    ],
  },
];
