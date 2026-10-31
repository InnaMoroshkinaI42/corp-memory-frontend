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
import { CompanyWaitingPage } from '@/pages/companies/CompanyWaitingPage'
import { DocumentsPage } from '@/pages/documents/DocumentsPage'
import { UploadDocumentPage } from '@/pages/documents/UploadDocumentPage'
import { ChatsPage } from '@/pages/chats/ChatsPage'
import { DecisionsPage } from '@/pages/decisions/DecisionsPage'
import { DocumentDetailPage } from '@/pages/documents/DocumentDetailPage'
import { SupportPage } from '@/pages/support/SupportPage'

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
      { path: '/companies/waiting', element: <CompanyWaitingPage /> },
      { path: '/support', element: <SupportPage /> },
    ],
  },
  {
    path: "/app",
    element: <CompanyLayout />,
    children: [
      { path: "overview/:id", element: <OverviewPage /> },
      { path: "members/:id", element: <MembersPage /> },
      { path: "settings/:id", element: <SettingsPage /> },
      { path: 'documents/upload/:id', element: <UploadDocumentPage /> },
      { path: 'documents/:id', element: <DocumentsPage /> },
      { path: 'chats/:id', element: <ChatsPage /> },
      { path: 'chats/:id/:chatId', element: <ChatsPage /> },
      { path: 'decisions/:id', element: <DecisionsPage /> },
      { path: 'documents/:id/:docId', element: <DocumentDetailPage /> },
    ],
  },
];
