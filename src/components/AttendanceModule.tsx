
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';
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
  hoursNeeded: number;
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
      },
      {
        id: '4',
        date: '2024-06-12',
        is_present: true,
        subjects: { subject_name: 'Operating Systems', subject_code: 'CS303' }
      },
      {
        id: '5',
        date: '2024-06-11',
        is_present: false,
        subjects: { subject_name: 'Database Management Systems', subject_code: 'CS301' }
      }
    ];
    setAttendanceRecords(mockRecords);
  };

  const calculateDeficit = (attended: number, total: number) => {
    // To reach 75%, we need: attended_classes / total_classes >= 0.75
    // So: attended_classes >= 0.75 * total_classes
    // If we attend next 'x' classes: (attended + x) / (total + x) >= 0.75
    // Solving: (attended + x) >= 0.75 * (total + x)
    // attended + x >= 0.75 * total + 0.75 * x
    // x - 0.75 * x >= 0.75 * total - attended
    // 0.25 * x >= 0.75 * total - attended
    // x >= (0.75 * total - attended) / 0.25
    const requiredAttended = 0.75 * total;
    if (attended >= requiredAttended) return 0;
    
    const deficit = (0.75 * total - attended) / 0.25;
    return Math.ceil(deficit);
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
        canMarkToday: true,
        hoursNeeded: 0
      },
      {
        subject_id: '2',
        subject_name: 'Software Engineering',
        subject_code: 'CS401',
        totalClasses: 28,
        attendedClasses: 18,
        percentage: 64.3,
        classesNeededFor75: 7, // Needs 7 more classes to reach 75%
        canMarkToday: true,
        hoursNeeded: 7
      },
      {
        subject_id: '3',
        subject_name: 'Computer Networks',
        subject_code: 'CS302',
        totalClasses: 32,
        attendedClasses: 24,
        percentage: 75.0,
        classesNeededFor75: 0, // Exactly at 75%
        canMarkToday: false, // Already marked today
        hoursNeeded: 0
      },
      {
        subject_id: '4',
        subject_name: 'Operating Systems',
        subject_code: 'CS303',
        totalClasses: 26,
        attendedClasses: 16,
        percentage: 61.5,
        classesNeededFor75: 6, // Needs 6 more classes
        canMarkToday: true,
        hoursNeeded: 6
      },
      {
        subject_id: '5',
        subject_name: 'Compiler Design',
        subject_code: 'CS501',
        totalClasses: 24,
        attendedClasses: 12,
        percentage: 50.0,
        classesNeededFor75: 12, // Critical shortage
        canMarkToday: true,
        hoursNeeded: 12
      }
    ];

    // Calculate deficit for each subject
    const updatedAttendance = mockSubjectAttendance.map(subject => ({
      ...subject,
      classesNeededFor75: calculateDeficit(subject.attendedClasses, subject.totalClasses),
      hoursNeeded: calculateDeficit(subject.attendedClasses, subject.totalClasses)
    }));

    setSubjectWiseAttendance(updatedAttendance);
  };

  const fetchTodayAttendance = async () => {
    // Mock today's schedule
    const mockTodayClasses = [
      { 
        subject_id: '1', 
        subject_name: 'Database Management Systems', 
        subject_code: 'CS301',
        time: '09:00-10:00', 
        marked: false,
        room: 'CS101'
      },
      { 
        subject_id: '2', 
        subject_name: 'Software Engineering', 
        subject_code: 'CS401',
        time: '10:00-11:00', 
        marked: false,
        room: 'CS102'
      },
      { 
        subject_id: '4', 
        subject_name: 'Operating Systems', 
        subject_code: 'CS303',
        time: '14:00-15:00', 
        marked: false,
        room: 'CS103'
      },
      { 
        subject_id: '5', 
        subject_name: 'Compiler Design', 
        subject_code: 'CS501',
        time: '15:00-16:00', 
        marked: false,
        room: 'CS104'
      }
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
                classesNeededFor75: calculateDeficit(subject.attendedClasses + 1, subject.totalClasses + 1),
                hoursNeeded: calculateDeficit(subject.attendedClasses + 1, subject.totalClasses + 1),
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
    if (percentage >= 85) return { color: 'default', text: 'Excellent', bgColor: 'bg-green-100' };
    if (percentage >= 75) return { color: 'secondary', text: 'Good', bgColor: 'bg-blue-100' };
    if (percentage >= 65) return { color: 'secondary', text: 'Warning', bgColor: 'bg-yellow-100' };
    return { color: 'destructive', text: 'Critical', bgColor: 'bg-red-100' };
  };

  const getTotalDeficit = () => {
    return subjectWiseAttendance.reduce((sum, subject) => sum + subject.classesNeededFor75, 0);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Needed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{getTotalDeficit()}</div>
            <p className="text-xs text-muted-foreground">For 75% attendance</p>
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
              <div key={classItem.subject_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div className="flex-1">
                  <p className="text-sm font-medium">{classItem.subject_name}</p>
                  <p className="text-xs text-muted-foreground">{classItem.subject_code}</p>
                  <p className="text-xs text-muted-foreground">Time: {classItem.time} • Room: {classItem.room}</p>
                </div>
                <div className="flex items-center gap-2">
                  {classItem.marked ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Present</span>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => markAttendance(classItem.subject_id, classItem.subject_name)}
                      className="bg-blue-600 hover:bg-blue-700"
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
          <CardTitle>Subject-wise Attendance Analysis</CardTitle>
          <CardDescription>Detailed attendance breakdown with deficit calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectWiseAttendance.map((subject) => {
              const status = getAttendanceStatus(subject.percentage);
              return (
                <div key={subject.subject_code} className={`p-4 rounded-lg border ${status.bgColor}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{subject.subject_name}</h4>
                      <p className="text-xs text-muted-foreground">{subject.subject_code}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={status.color as any} className="mb-1">
                        {subject.percentage.toFixed(1)}% - {status.text}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {subject.attendedClasses}/{subject.totalClasses} classes
                      </p>
                    </div>
                  </div>
                  
                  <Progress value={subject.percentage} className="mb-3" />
                  
                  {subject.classesNeededFor75 > 0 && (
                    <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-orange-800">
                          Need to attend {subject.classesNeededFor75} more consecutive classes to reach 75%
                        </p>
                        <p className="text-xs text-orange-600">
                          Approximately {subject.hoursNeeded} hours of classes required
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {subject.percentage >= 75 && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-xs font-medium text-green-800">
                        ✓ Meeting 75% attendance requirement
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
          <CardTitle>Recent Attendance History</CardTitle>
          <CardDescription>Your recent attendance records across all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {record.is_present ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{record.subjects.subject_name}</p>
                    <p className="text-xs text-muted-foreground">{record.subjects.subject_code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={record.is_present ? "default" : "destructive"} className="mb-1">
                    {record.is_present ? "Present" : "Absent"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
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
