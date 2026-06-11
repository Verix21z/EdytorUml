import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/root-layout';
import { Dashboard } from './pages/dashboard';
import { Templates } from './pages/templates';
import { Shared } from './pages/shared';
import { Settings } from './pages/settings';
import { EditorWorkspace } from './pages/editor';
import { ExportShare } from './pages/export-share';
import { ShapeLibrary } from './pages/shape-library';
import { Accessibility } from './pages/accessibility';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: 'templates',
        Component: Templates,
      },
      {
        path: 'shared',
        Component: Shared,
      },
      {
        path: 'settings',
        Component: Settings,
      },
      {
        path: 'settings/shape-library',
        Component: ShapeLibrary,
      },
      {
        path: 'settings/accessibility',
        Component: Accessibility,
      },
    ],
  },
  {
    path: '/editor',
    Component: EditorWorkspace,
  },
  {
    path: '/export',
    Component: ExportShare,
  },
]);
