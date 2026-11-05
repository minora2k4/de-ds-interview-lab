import { lazy, type ComponentType } from 'react'
import { createHashRouter } from 'react-router'
import { RouteError } from './route-error'
import { AppLayout } from './layout/app-layout'

const named = <T extends Record<string, unknown>, K extends keyof T>(
  load: () => Promise<T>,
  name: K,
) => lazy(async () => ({ default: (await load())[name] as ComponentType }))

const DashboardPage = named(() => import('@/features/dashboard/dashboard-page'), 'DashboardPage')
const DomainPage = named(() => import('@/features/knowledge/domain-page'), 'DomainPage')
const TopicPage = named(() => import('@/features/knowledge/topic-page'), 'TopicPage')
const ConceptPage = named(() => import('@/features/knowledge/concept-page'), 'ConceptPage')
const QuizCenterPage = named(() => import('@/features/quiz/quiz-center-page'), 'QuizCenterPage')
const QuizSessionPage = named(() => import('@/features/quiz/quiz-session-page'), 'QuizSessionPage')
const QuizResultPage = named(() => import('@/features/quiz/quiz-result-page'), 'QuizResultPage')
const InterviewSetupPage = named(
  () => import('@/features/interview/interview-setup-page'),
  'InterviewSetupPage',
)
const InterviewSessionPage = named(
  () => import('@/features/interview/interview-session-page'),
  'InterviewSessionPage',
)
const InterviewResultPage = named(
  () => import('@/features/interview/interview-result-page'),
  'InterviewResultPage',
)
const SavedPage = named(() => import('@/features/saved/saved-page'), 'SavedPage')
const ReviewPage = named(() => import('@/features/review/review-page'), 'ReviewPage')
const ProgressPage = named(() => import('@/features/progress/progress-page'), 'ProgressPage')
const SettingsPage = named(() => import('@/features/settings/settings-page'), 'SettingsPage')

function knowledgeRoutes(domain: 'de' | 'ds') {
  return [
    { path: domain, element: <DomainPage /> },
    { path: `${domain}/:topicId`, element: <TopicPage /> },
    { path: `${domain}/:topicId/:conceptId`, element: <ConceptPage /> },
  ]
}

/** Dùng hash để tải lại trang không bị 404 trên GitHub Pages. */
export const router = createHashRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardPage /> },
      ...knowledgeRoutes('de'),
      ...knowledgeRoutes('ds'),
      { path: 'quiz', element: <QuizCenterPage /> },
      { path: 'quiz/session', element: <QuizSessionPage /> },
      { path: 'quiz/result/:attemptId', element: <QuizResultPage /> },
      { path: 'interview', element: <InterviewSetupPage /> },
      { path: 'interview/session', element: <InterviewSessionPage /> },
      { path: 'interview/result/:sessionId', element: <InterviewResultPage /> },
      { path: 'saved', element: <SavedPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <RouteError /> },
    ],
  },
])
