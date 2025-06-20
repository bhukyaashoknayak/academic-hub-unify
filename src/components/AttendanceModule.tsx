
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, TrendingUp } from 'lucide-react';

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
  subject_name: string;
  subject_code: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export default function AttendanceModule() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [subjectWiseAttendance, setSubjectWiseAttendance] = useState<SubjectAttendance[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      fetchAttendanceRecords();
      fetchSubjectWiseAttendance();
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
    }
  };

  const fetchAttendanceRecords = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        subjects (subject_name, subject_code)
      `)
      .eq('student_id', profile.id)
      .order('date', { ascending: false })
      .limit(10);

    if (!error) {
      setAttendanceRecords(data || []);
    }
  };

  const fetchSubjectWiseAttendance = async () => {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        is_present,
        subjects (subject_name, subject_code)
      `)
      .eq('student_id', profile.id);

    if (!error && data) {
      const subjectStats = data.reduce((acc: any, record) => {
        const subjectCode = record.subjects.subject_code;
        if (!acc[subjectCode]) {
          acc[subjectCode] = {
            subject_name: record.subjects.subject_name,
            subject_code: subjectCode,
            totalClasses: 0,
            attendedClasses: 0,
          };
        }
        acc[subjectCode].totalClasses++;
        if (record.is_present) {
          acc[subjectCode].attendedClasses++;
        }
        return acc;
      }, {});

      const subjectArray = Object.values(subjectStats).map((subject: any) => ({
        ...subject,
        percentage: subject.totalClasses > 0 ? (subject.attendedClasses / subject.totalClasses) * 100 : 0,
      }));

      setSubjectWiseAttendance(subjectArray);
    }
  };

  const getOverallAttendance = () => {
    if (subjectWiseAttendance.length === 0) return 0;
    const totalClasses = subjectWiseAttendance.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const totalAttended = subjectWiseAttendance.reduce((sum, subject) => sum + subject.attendedClasses, 0);
    return totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
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

      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Your attendance percentage for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectWiseAttendance.map((subject) => (
              <div key={subject.subject_code} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">{subject.subject_name}</h4>
                    <p className="text-xs text-muted-foreground">{subject.subject_code}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={subject.percentage >= 75 ? "default" : subject.percentage >= 60 ? "secondary" : "destructive"}
                    >
                      {subject.percentage.toFixed(1)}%
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.attendedClasses}/{subject.totalClasses}
                    </p>
                  </div>
                </div>
                <Progress value={subject.percentage} />
              </div>
            ))}
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
