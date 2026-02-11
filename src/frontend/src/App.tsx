import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import JewelryPage from './pages/JewelryPage';
import JewelryDetailPage from './pages/JewelryDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminArtworksPage from './pages/admin/AdminArtworksPage';
import AdminArtworkEditorPage from './pages/admin/AdminArtworkEditorPage';
import AdminJewelryPage from './pages/admin/AdminJewelryPage';
import AdminJewelryEditorPage from './pages/admin/AdminJewelryEditorPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminContactMessagesPage from './pages/admin/AdminContactMessagesPage';
import AdminRouteGuard from './components/auth/AdminRouteGuard';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

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
  path: '/',
  component: HomePage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const artworkDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/artwork/$artworkId',
  component: ArtworkDetailPage,
});

const jewelryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jewelry',
  component: JewelryPage,
});

const jewelryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jewelry/$jewelryId',
  component: JewelryDetailPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <Outlet />
    </AdminRouteGuard>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminDashboardPage,
});

const adminArtworksRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/artworks',
  component: AdminArtworksPage,
});

const adminArtworkNewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/artworks/new',
  component: AdminArtworkEditorPage,
});

const adminArtworkEditRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/artworks/$artworkId/edit',
  component: AdminArtworkEditorPage,
});

const adminJewelryRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/jewelry',
  component: AdminJewelryPage,
});

const adminJewelryNewRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/jewelry/new',
  component: AdminJewelryEditorPage,
});

const adminJewelryEditRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/jewelry/$jewelryId/edit',
  component: AdminJewelryEditorPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/orders',
  component: AdminOrdersPage,
});

const adminContactMessagesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/messages',
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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
