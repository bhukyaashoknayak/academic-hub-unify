
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Calendar, Users, Bell, TrendingUp, Award } from 'lucide-react';

interface StudentProfile {
  id: string;
  name: string;
  roll_number: string;
  branch: string;
  section: string;
  year: number;
  semester: string;
  cgpa: number;
}

interface AttendanceStats {
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    totalClasses: 0,
    attendedClasses: 0,
    percentage: 0
  });
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchStudentProfile();
      fetchAttendanceStats();
      fetchRecentNotifications();
      fetchUpcomingClasses();
    }
  }, [user]);

  const fetchStudentProfile = async () => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  const fetchAttendanceStats = async () => {
    if (!profile) return;

    const { data: attendanceData, error } = await supabase
      .from('attendance')
      .select('is_present')
      .eq('student_id', profile.id);

    if (!error && attendanceData) {
      const totalClasses = attendanceData.length;
      const attendedClasses = attendanceData.filter(record => record.is_present).length;
      const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

      setAttendanceStats({ totalClasses, attendedClasses, percentage });
    }
  };

  const fetchRecentNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error) {
      setRecentNotifications(data || []);
    }
  };

  const fetchUpcomingClasses = async () => {
    if (!profile) return;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const { data, error } = await supabase
      .from('timetable')
      .select(`
        *,
        subjects (subject_name, subject_code),
        faculty (name)
      `)
      .eq('year', profile.year)
      .eq('semester', profile.semester)
      .eq('branch', profile.branch)
      .eq('section', profile.section)
      .eq('day', today)
      .order('time_slot');

    if (!error) {
      setUpcomingClasses(data || []);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.percentage.toFixed(1)}%</div>
            <Progress value={attendanceStats.percentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {attendanceStats.attendedClasses}/{attendanceStats.totalClasses} classes attended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.cgpa}</div>
            <p className="text-xs text-muted-foreground">
              Current semester performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentNotifications.length}</div>
            <p className="text-xs text-muted-foreground">
              Unread notifications
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Roll Number</p>
                <p className="text-sm">{profile.roll_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Branch</p>
                <Badge variant="secondary">{profile.branch}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Section</p>
                <Badge variant="outline">{profile.section}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year</p>
                <p className="text-sm">{profile.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Semester</p>
                <p className="text-sm">{profile.semester}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {upcomingClasses.map((classItem, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{classItem.subjects?.subject_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {classItem.faculty?.name} • Room {classItem.room_number}
                      </p>
                    </div>
                    <Badge variant="outline">{classItem.time_slot}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent notifications</p>
          ) : (
            <div className="space-y-3">
              {recentNotifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Bell className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">{notification.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
