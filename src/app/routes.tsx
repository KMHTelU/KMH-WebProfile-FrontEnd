import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Divisions } from "./pages/Divisions";
import { DivisionDetail } from "./pages/DivisionDetail";
import { Events } from "./pages/Events";
import { EventDetail } from "./pages/EventDetail";
import { Gallery } from "./pages/Gallery";
import { Blog } from "./pages/Blog";
import { BlogDetail } from "./pages/BlogDetail";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { RequireAuth } from "./admin/RequireAuth";
import { AdminLayout } from "./admin/AdminLayout";
import { Dashboard } from "./admin/pages/Dashboard";
import { AdminBanners } from "./admin/pages/Banners";
import { AdminDivisions } from "./admin/pages/Divisions";
import { AdminMembers } from "./admin/pages/Members";
import { AdminEvents } from "./admin/pages/Events";
import { AdminBlogPosts } from "./admin/pages/BlogPosts";
import { AdminBlogPostEditor } from "./admin/pages/BlogPostEditor";
import { AdminBlogTaxonomy } from "./admin/pages/BlogTaxonomy";
import { AdminGalleries } from "./admin/pages/Galleries";
import { AdminOrgProfile } from "./admin/pages/OrgProfile";
import { AdminContactMessages } from "./admin/pages/ContactMessages";
import { AdminUsers } from "./admin/pages/Users";
import { AdminRoles } from "./admin/pages/Roles";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "divisions", Component: Divisions },
      { path: "divisions/:id", Component: DivisionDetail },
      { path: "events", Component: Events },
      { path: "events/:id", Component: EventDetail },
      { path: "gallery", Component: Gallery },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogDetail },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password", Component: ResetPassword },
  {
    path: "/admin",
    Component: RequireAuth,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: Dashboard },
          { path: "banners", Component: AdminBanners },
          { path: "divisions", Component: AdminDivisions },
          { path: "members", Component: AdminMembers },
          { path: "events", Component: AdminEvents },
          { path: "blog", Component: AdminBlogPosts },
          { path: "blog/new", Component: AdminBlogPostEditor },
          { path: "blog/:id", Component: AdminBlogPostEditor },
          { path: "blog-taxonomy", Component: AdminBlogTaxonomy },
          { path: "galleries", Component: AdminGalleries },
          { path: "organization", Component: AdminOrgProfile },
          { path: "contact-messages", Component: AdminContactMessages },
          { path: "users", Component: AdminUsers },
          { path: "roles", Component: AdminRoles },
        ],
      },
    ],
  },
]);
