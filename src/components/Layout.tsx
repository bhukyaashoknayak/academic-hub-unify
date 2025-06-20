
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FileText, 
  Bell, 
  MessageSquare, 
  LogOut, 
  User,
  GraduationCap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: GraduationCap },
  { href: '/attendance', label: 'Attendance', icon: Users },
  { href: '/marks', label: 'Marks', icon: BookOpen },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
  { href: '/papers', label: 'Previous Papers', icon: FileText },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Layout({ children }: LayoutProps) {
  const { signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Student Portal</h1>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <Link key={item.href} to={item.href}>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className="w-full justify-start"
                          size="sm"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
