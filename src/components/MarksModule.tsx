
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, TrendingUp, Award, Target } from 'lucide-react';

interface Mark {
  id: string;
  exam_type: string;
  marks_obtained: number;
  total_marks: number;
  subjects: {
    subject_name: string;
    subject_code: string;
  };
}

interface SubjectMarks {
  subject_id: string;
  subject_name: string;
  subject_code: string;
  mid1: number;
  mid2: number;
  assignment: number;
  end_exam: number;
  total: number;
  percentage: number;
  grade: string;
}

export default function MarksModule() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [marksRecords, setMarksRecords] = useState<Mark[]>([]);
  const [subjectMarks, setSubjectMarks] = useState<SubjectMarks[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('5');
  const [sgpa, setSgpa] = useState<number>(0);
  const [cgpa, setCgpa] = useState<number>(8.5);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      fetchMarksRecords();
      fetchSubjectMarks();
    }
  }, [profile, selectedSemester]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (!error && data) {
      setProfile(data);
      setSelectedSemester(data.semester);
    } else {
      // Mock profile for demonstration
      setProfile({
        id: '1',
        name: 'John Doe',
        roll_number: '21CSE001',
        semester: '5'
      });
    }
  };

  const fetchMarksRecords = async () => {
    // Mock data for demonstration
    const mockMarks = [
      {
        id: '1',
        exam_type: 'mid1',
        marks_obtained: 42,
        total_marks: 50,
        subjects: { subject_name: 'Database Management Systems', subject_code: 'CS301' }
      },
      {
        id: '2',
        exam_type: 'mid2',
        marks_obtained: 45,
        total_marks: 50,
        subjects: { subject_name: 'Database Management Systems', subject_code: 'CS301' }
      },
      {
        id: '3',
        exam_type: 'assignment',
        marks_obtained: 18,
        total_marks: 20,
        subjects: { subject_name: 'Software Engineering', subject_code: 'CS401' }
      }
    ];
    setMarksRecords(mockMarks);
  };

  const fetchSubjectMarks = async () => {
    // Mock comprehensive subject marks data
    const mockSubjectMarks = [
      {
        subject_id: '1',
        subject_name: 'Database Management Systems',
        subject_code: 'CS301',
        mid1: 42,
        mid2: 45,
        assignment: 18,
        end_exam: 85,
        total: 190,
        percentage: 84.4,
        grade: 'A'
      },
      {
        subject_id: '2',
        subject_name: 'Software Engineering',
        subject_code: 'CS401',
        mid1: 38,
        mid2: 41,
        assignment: 19,
        end_exam: 78,
        total: 176,
        percentage: 78.2,
        grade: 'B+'
      },
      {
        subject_id: '3',
        subject_name: 'Computer Networks',
        subject_code: 'CS302',
        mid1: 45,
        mid2: 47,
        assignment: 20,
        end_exam: 88,
        total: 200,
        percentage: 88.9,
        grade: 'A+'
      },
      {
        subject_id: '4',
        subject_name: 'Operating Systems',
        subject_code: 'CS303',
        mid1: 40,
        mid2: 43,
        assignment: 17,
        end_exam: 82,
        total: 182,
        percentage: 80.9,
        grade: 'A-'
      }
    ];
    
    setSubjectMarks(mockSubjectMarks);
    
    // Calculate SGPA based on grades
    const totalCredits = mockSubjectMarks.length * 3; // Assuming 3 credits per subject
    const gradePoints = mockSubjectMarks.reduce((sum, subject) => {
      const gradePoint = getGradePoint(subject.grade);
      return sum + (gradePoint * 3);
    }, 0);
    
    setSgpa(gradePoints / totalCredits);
  };

  const getGradePoint = (grade: string): number => {
    const gradeMap: { [key: string]: number } = {
      'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5,
      'C+': 6, 'C': 5.5, 'C-': 5, 'D': 4, 'F': 0
    };
    return gradeMap[grade] || 0;
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A'].includes(grade)) return 'default';
    if (['A-', 'B+'].includes(grade)) return 'secondary';
    if (['B', 'B-'].includes(grade)) return 'outline';
    return 'destructive';
  };

  const getPerformanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'Excellent', color: 'text-green-600' };
    if (percentage >= 80) return { status: 'Very Good', color: 'text-blue-600' };
    if (percentage >= 70) return { status: 'Good', color: 'text-yellow-600' };
    if (percentage >= 60) return { status: 'Average', color: 'text-orange-600' };
    return { status: 'Needs Improvement', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current SGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sgpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Semester {selectedSemester}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall CGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{cgpa}</div>
            <p className="text-xs text-muted-foreground">Cumulative GPA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectMarks.length}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjectMarks.length > 0 
                ? (subjectMarks.reduce((sum, s) => sum + s.percentage, 0) / subjectMarks.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedSemester} onValueChange={setSelectedSemester} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="3">Semester 3</TabsTrigger>
          <TabsTrigger value="4">Semester 4</TabsTrigger>
          <TabsTrigger value="5">Semester 5</TabsTrigger>
          <TabsTrigger value="6">Semester 6</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedSemester} className="space-y-6">
          {/* Subject-wise Detailed Marks */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Detailed marks breakdown for Semester {selectedSemester}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subjectMarks.map((subject) => {
                  const performance = getPerformanceStatus(subject.percentage);
                  return (
                    <div key={subject.subject_id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{subject.subject_name}</h4>
                          <p className="text-sm text-muted-foreground">{subject.subject_code}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getGradeColor(subject.grade) as any}>
                            Grade: {subject.grade}
                          </Badge>
                          <p className="text-sm mt-1">
                            <span className="font-semibold">{subject.total}/225</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Mid-1</p>
                          <p className="font-semibold">{subject.mid1}/50</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Mid-2</p>
                          <p className="font-semibold">{subject.mid2}/50</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Assignment</p>
                          <p className="font-semibold">{subject.assignment}/25</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">End Exam</p>
                          <p className="font-semibold">{subject.end_exam}/100</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <Progress value={subject.percentage} className="w-32" />
                          <p className="text-xs mt-1">{subject.percentage.toFixed(1)}%</p>
                        </div>
                        <p className={`text-sm font-medium ${performance.color}`}>
                          {performance.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Exam Results */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exam Results</CardTitle>
              <CardDescription>Latest examination scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marksRecords.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{record.subjects.subject_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.subjects.subject_code} • {record.exam_type.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {record.marks_obtained}/{record.total_marks}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {((record.marks_obtained / record.total_marks) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
