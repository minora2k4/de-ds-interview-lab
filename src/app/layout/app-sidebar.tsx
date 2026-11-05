import {
  BookOpenCheck,
  Bookmark,
  Database,
  FlaskConical,
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  Settings,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { to: '/de', label: 'Data Engineering', icon: Database },
  { to: '/ds', label: 'Data Science', icon: FlaskConical },
  { to: '/quiz', label: 'Trung tâm Quiz', icon: ListChecks },
  { to: '/interview', label: 'Luyện phỏng vấn', icon: MessagesSquare },
  { to: '/saved', label: 'Câu hỏi đã lưu', icon: Bookmark },
  { to: '/review', label: 'Ôn tập kiến thức', icon: BookOpenCheck },
  { to: '/progress', label: 'Tiến độ học tập', icon: TrendingUp },
  { to: '/settings', label: 'Cài đặt', icon: Settings },
]

function isActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function AppSidebar() {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavLink
          to="/"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-2 rounded-md p-1.5"
          aria-label="DE/DS Interview Lab, về trang Tổng quan"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-[0.6875rem] font-bold text-primary-foreground">
            D
          </span>
          <span className="truncate text-sm font-semibold group-data-[collapsible=icon]:hidden">
            DE/DS Interview Lab
          </span>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={isActive(pathname, to)} tooltip={label}>
                    <NavLink to={to} end={to === '/'} onClick={() => setOpenMobile(false)}>
                      <Icon aria-hidden />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
