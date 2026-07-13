import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../../layouts/AppLayout'
import { AuthGuard } from '../guards/AuthGuard'
import { AdminGuard } from '../guards/AdminGuard'
import { StateBlock } from '../../components/common/StateBlock'

const HomePage = lazy(() => import('../../pages/home/HomePage'))
const MembersPage = lazy(() => import('../../pages/members/MembersPage'))
const MemberDetailPage = lazy(() => import('../../pages/member-detail/MemberDetailPage'))
const EventsPage = lazy(() => import('../../pages/events/EventsPage'))
const EventDetailPage = lazy(() => import('../../pages/events/EventDetailPage'))
const CheckInPage = lazy(() => import('../../pages/check-in/CheckInPage'))
const CommunityPage = lazy(() => import('../../pages/community/CommunityPage'))
const PostDetailPage = lazy(() => import('../../pages/post-detail/PostDetailPage'))
const OfficialUpdatesPage = lazy(() => import('../../pages/official-updates/OfficialUpdatesPage'))
const OfficialUpdateDetailPage = lazy(() => import('../../pages/official-updates/OfficialUpdateDetailPage'))
const MomentsPage = lazy(() => import('../../pages/moments/MomentsPage'))
const GalleryPage = lazy(() => import('../../pages/gallery/GalleryPage'))
const AgriAidPage = lazy(() => import('../../pages/agri-aid/AgriAidPage'))
const ProfilePage = lazy(() => import('../../pages/profile/ProfilePage'))
const LoginPage = lazy(() => import('../../pages/login/LoginPage'))
const RegisterPage = lazy(() => import('../../pages/register/RegisterPage'))
const AboutPage = lazy(() => import('../../pages/about/AboutPage'))
const RulesPage = lazy(() => import('../../pages/rules/RulesPage'))
const AdminPage = lazy(() => import('../../pages/admin/AdminPage'))
const NotFoundPage = lazy(() => import('../../pages/not-found/NotFoundPage'))

const profileRoutes = [
  '/profile',
  '/profile/posts',
  '/profile/comments',
  '/profile/favorites',
  '/profile/following',
  '/profile/check-ins',
  '/profile/points',
  '/profile/badges',
  '/profile/notifications',
  '/profile/settings',
]

const adminRoutes = [
  '/admin',
  '/admin/members',
  '/admin/events',
  '/admin/updates',
  '/admin/posts',
  '/admin/comments',
  '/admin/reports',
  '/admin/users',
  '/admin/check-ins',
  '/admin/badges',
  '/admin/settings',
]

function RouteFallback() {
  return (
    <section className="field-container py-12">
      <StateBlock type="loading" title="正在翻开手册" description="页面内容正在加载。" />
    </section>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="members/:memberId" element={<MemberDetailPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:eventId" element={<EventDetailPage />} />
            <Route path="check-in" element={<CheckInPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="community/:postId" element={<PostDetailPage />} />
            <Route path="updates" element={<OfficialUpdatesPage />} />
            <Route path="updates/:updateId" element={<OfficialUpdateDetailPage />} />
            <Route path="moments" element={<MomentsPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="agri-aid" element={<AgriAidPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="rules" element={<RulesPage />} />
            {profileRoutes.map((path) => (
              <Route
                key={path}
                path={path.replace(/^\//, '')}
                element={
                  <AuthGuard>
                    <ProfilePage />
                  </AuthGuard>
                }
              />
            ))}
            {adminRoutes.map((path) => (
              <Route
                key={path}
                path={path.replace(/^\//, '')}
                element={
                  <AdminGuard>
                    <AdminPage />
                  </AdminGuard>
                }
              />
            ))}
            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
