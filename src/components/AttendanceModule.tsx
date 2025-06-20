
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AttendanceRecord {
  id: string;
  date: string;
  is_present: boolean;
  subjects: {
    subject_name: string;
    subject_code: string;
  };
}

interface SubjectAttendance {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  classesNeededFor75: number;
  canMarkToday: boolean;
}

export default function AttendanceModule() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [subjectWiseAttendance, setSubjectWiseAttendance] = useState<SubjectAttendance[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      fetchAttendanceRecords();
      fetchSubjectWiseAttendance();
      fetchTodayAttendance();
    }
  }, [profile]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (!error) {
      setProfile(data);
    } else {
      // Mock profile for demonstration
      setProfile({
        id: '1',
        name: 'John Doe',
        roll_number: '21CSE001',
        branch: 'CSE',
        section: 'A',
        year: 3,
        semester: '5'
      });
    }
  };

  const fetchAttendanceRecords = async () => {
    // Mock data for demonstration
    const mockRecords = [
      {
        id: '1',
        date: '2024-06-15',
        is_present: true,
        subjects: { subject_name: 'Database Management Systems', subject_code: 'CS301' }
      },
      {
        id: '2',
        date: '2024-06-14',
        is_present: false,
        subjects: { subject_name: 'Software Engineering', subject_code: 'CS401' }
      },
      {
        id: '3',
        date: '2024-06-13',
        is_present: true,
        subjects: { subject_name: 'Computer Networks', subject_code: 'CS302' }
      }
    ];
    setAttendanceRecords(mockRecords);
  };

  const fetchSubjectWiseAttendance = async () => {
    // Mock data with realistic attendance scenarios
    const mockSubjectAttendance = [
      {
        subject_id: '1',
        subject_name: 'Database Management Systems',
        subject_code: 'CS301',
        totalClasses: 30,
        attendedClasses: 25,
        percentage: 83.3,
        classesNeededFor75: 0, // Already above 75%
        canMarkToday: true
      },
      {
        subject_id: '2',
        subject_name: 'Software Engineering',
        subject_code: 'CS401',
        totalClasses: 28,
        attendedClasses: 18,
        percentage: 64.3,
        classesNeededFor75: 7, // Needs 7 more classes to reach 75%
        canMarkToday: true
      },
      {
        subject_id: '3',
        subject_name: 'Computer Networks',
        subject_code: 'CS302',
        totalClasses: 32,
        attendedClasses: 24,
        percentage: 75.0,
        classesNeededFor75: 0, // Exactly at 75%
        canMarkToday: false // Already marked today
      },
      {
        subject_id: '4',
        subject_name: 'Operating Systems',
        subject_code: 'CS303',
        totalClasses: 26,
        attendedClasses: 16,
        percentage: 61.5,
        classesNeededFor75: 6, // Needs 6 more classes
        canMarkToday: true
      }
    ];

    setSubjectWiseAttendance(mockSubjectAttendance);
  };

  const fetchTodayAttendance = async () => {
    // Mock today's schedule
    const mockTodayClasses = [
      { subject_id: '1', subject_name: 'Database Management Systems', time: '09:00-10:00', marked: false },
      { subject_id: '2', subject_name: 'Software Engineering', time: '10:00-11:00', marked: false },
      { subject_id: '4', subject_name: 'Operating Systems', time: '14:00-15:00', marked: false }
    ];
    setTodayAttendance(mockTodayClasses);
  };

  const markAttendance = async (subjectId: string, subjectName: string) => {
    try {
      // In a real app, this would make an API call to mark attendance
      console.log(`Marking attendance for ${subjectName}`);
      
      // Update local state
      setTodayAttendance(prev => 
        prev.map(item => 
          item.subject_id === subjectId 
            ? { ...item, marked: true }
            : item
        )
      );

      // Update subject attendance stats
      setSubjectWiseAttendance(prev =>
        prev.map(subject =>
          subject.subject_id === subjectId
            ? {
                ...subject,
                attendedClasses: subject.attendedClasses + 1,
                totalClasses: subject.totalClasses + 1,
                percentage: ((subject.attendedClasses + 1) / (subject.totalClasses + 1)) * 100,
                canMarkToday: false
              }
            : subject
        )
      );

      toast.success(`Attendance marked for ${subjectName}`);
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const getOverallAttendance = () => {
    if (subjectWiseAttendance.length === 0) return 0;
    const totalClasses = subjectWiseAttendance.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const totalAttended = subjectWiseAttendance.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    return totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 75) return { color: 'default', text: 'Good' };
    if (percentage >= 65) return { color: 'secondary', text: 'Warning' };
    return { color: 'destructive', text: 'Critical' };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOverallAttendance().toFixed(1)}%</div>
            <Progress value={getOverallAttendance()} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjectWiseAttendance.reduce((sum, subject) => sum + subject.totalClasses, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjectWiseAttendance.reduce((sum, subject) => sum + subject.attendedClasses, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Classes - Self Mark Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Classes - Mark Your Attendance</CardTitle>
          <CardDescription>Mark yourself present for classes you attend today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAttendance.map((classItem) => (
              <div key={classItem.subject_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{classItem.subject_name}</p>
                  <p className="text-xs text-muted-foreground">Time: {classItem.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  {classItem.marked ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Marked Present</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => markAttendance(classItem.subject_id, classItem.subject_name)}
                    >
                      Mark Present
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Your attendance percentage for each subject with deficit analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectWiseAttendance.map((subject) => {
              const status = getAttendanceStatus(subject.percentage);
              return (
                <div key={subject.subject_code} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">{subject.subject_name}</h4>
                      <p className="text-xs text-muted-foreground">{subject.subject_code}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={status.color as any}>
                        {subject.percentage.toFixed(1)}% - {status.text}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {subject.attendedClasses}/{subject.totalClasses}
                      </p>
                    </div>
                  </div>
                  <Progress value={subject.percentage} />
                  {subject.classesNeededFor75 > 0 && (
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-xs">
                        Need to attend {subject.classesNeededFor75} more consecutive classes to reach 75%
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Your recent attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{record.subjects.subject_name}</p>
                  <p className="text-xs text-muted-foreground">{record.subjects.subject_code}</p>
                </div>
                <div className="text-right">
                  <Badge variant={record.is_present ? "default" : "destructive"}>
                    {record.is_present ? "Present" : "Absent"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
