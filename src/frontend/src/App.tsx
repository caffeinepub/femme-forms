import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import AdminRouteGuard from "./components/auth/AdminRouteGuard";
import ProfileSetupModal from "./components/auth/ProfileSetupModal";
import SiteLayout from "./components/layout/SiteLayout";
import AboutPage from "./pages/AboutPage";
import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import HomePage from "./pages/HomePage";
import JewelryDetailPage from "./pages/JewelryDetailPage";
import JewelryPage from "./pages/JewelryPage";
import AdminArtworkEditorPage from "./pages/admin/AdminArtworkEditorPage";
import AdminArtworksPage from "./pages/admin/AdminArtworksPage";
import AdminContactMessagesPage from "./pages/admin/AdminContactMessagesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminJewelryEditorPage from "./pages/admin/AdminJewelryEditorPage";
import AdminJewelryPage from "./pages/admin/AdminJewelryPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminSetupPage from "./pages/admin/AdminSetupPage";

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
      <ProfileSetupModal />
      <Toaster />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const artworkDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/artwork/$artworkId",
  component: ArtworkDetailPage,
});

const jewelryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jewelry",
  component: JewelryPage,
});

const jewelryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/jewelry/$jewelryId",
  component: JewelryDetailPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const adminSetupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/setup",
  component: AdminSetupPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminRouteGuard>
      <Outlet />
    </AdminRouteGuard>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: AdminDashboardPage,
});

const adminArtworksRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/artworks",
  component: AdminArtworksPage,
});

const adminArtworkNewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/artworks/new",
  component: AdminArtworkEditorPage,
});

const adminArtworkEditRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/artworks/$artworkId/edit",
  component: AdminArtworkEditorPage,
});

const adminJewelryRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/jewelry",
  component: AdminJewelryPage,
});

const adminJewelryNewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/jewelry/new",
  component: AdminJewelryEditorPage,
});

const adminJewelryEditRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/jewelry/$jewelryId/edit",
  component: AdminJewelryEditorPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/orders",
  component: AdminOrdersPage,
});

const adminContactMessagesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/messages",
  component: AdminContactMessagesPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  galleryRoute,
  artworkDetailRoute,
  jewelryRoute,
  jewelryDetailRoute,
  aboutRoute,
  contactRoute,
  adminSetupRoute,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminArtworksRoute,
    adminArtworkNewRoute,
    adminArtworkEditRoute,
    adminJewelryRoute,
    adminJewelryNewRoute,
    adminJewelryEditRoute,
    adminOrdersRoute,
    adminContactMessagesRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
