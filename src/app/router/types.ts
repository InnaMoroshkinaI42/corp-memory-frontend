import { type JSX } from "react";

export interface IRoute {
  path?: string;
  element: JSX.Element;
  children?: IRoute[];
  index?: true;
}

export interface NavigationItem {
  key: "companies" | "chats" | "documents" | "profile" | "settings";
  label: string;
  path?: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
}