
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

interface MarksRecord {
  id: string;
  exam_type: string;
  marks_obtained: number;
  total_marks: number;
  semester: string;
  subjects: {
    subject_name: string;
    subject_code: string;
    credits: number;
  };
}

interface SubjectMarks {
  subject_name: string;
  subject_code: string;
  credits: number;
  mid1: number | null;
  mid2: number | null;
  assignment: number | null;
  end_exam: number | null;
  total_obtained: number;
  total_marks: number;
  percentage: number;
}

export default function MarksModule() {
  const { user } = useAuth();
  const [marksRecords, setMarksRecords] = useState<MarksRecord[]>([]);
  const [subjectMarks, setSubjectMarks] = useState<SubjectMarks[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setSelectedSemester(profile.semester);
      fetchMarksRecords(profile.semester);
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

  const fetchMarksRecords = async (semester: string) => {
    const { data, error } = await supabase
      .from('marks')
      .select(`
        *,
        subjects (subject_name, subject_code, credits)
      `)
      .eq('student_id', profile.id)
      .eq('semester', semester)
      .order('subjects(subject_name)');

    if (!error && data) {
      setMarksRecords(data);
      processSubjectMarks(data);
    }
  };

  const processSubjectMarks = (marks: MarksRecord[]) => {
    const subjectMap = new Map<string, SubjectMarks>();

    marks.forEach((mark) => {
      const subjectCode = mark.subjects.subject_code;
      
      if (!subjectMap.has(subjectCode)) {
        subjectMap.set(subjectCode, {
          subject_name: mark.subjects.subject_name,
          subject_code: subjectCode,
          credits: mark.subjects.credits,
          mid1: null,
          mid2: null,
          assignment: null,
          end_exam: null,
          total_obtained: 0,
          total_marks: 0,
          percentage: 0,
        });
      }

      const subject = subjectMap.get(subjectCode)!;
      subject[mark.exam_type as keyof Pick<SubjectMarks, 'mid1' | 'mid2' | 'assignment' | 'end_exam'>] = mark.marks_obtained;
      subject.total_obtained += mark.marks_obtained;
      subject.total_marks += mark.total_marks;
      subject.percentage = subject.total_marks > 0 ? (subject.total_obtained / subject.total_marks) * 100 : 0;
    });

    setSubjectMarks(Array.from(subjectMap.values()));
  };

  const calculateSGPA = () => {
    if (subjectMarks.length === 0) return 0;
    
    let totalCredits = 0;
    let weightedSum = 0;

    subjectMarks.forEach((subject) => {
      const gradePoint = getGradePoint(subject.percentage);
      weightedSum += gradePoint * subject.credits;
      totalCredits += subject.credits;
    });

    return totalCredits > 0 ? weightedSum / totalCredits : 0;
  };

  const getGradePoint = (percentage: number): number => {
    if (percentage >= 90) return 10;
    if (percentage >= 80) return 9;
    if (percentage >= 70) return 8;
    if (percentage >= 60) return 7;
    if (percentage >= 50) return 6;
    if (percentage >= 40) return 5;
    return 0;
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current SGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateSGPA().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Semester {selectedSemester}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.cgpa || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Cumulative</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectMarks.length}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semester-wise Marks</CardTitle>
          <CardDescription>Your marks and performance across different semesters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedSemester} onValueChange={(value) => {
            setSelectedSemester(value);
            fetchMarksRecords(value);
          }}>
            <TabsList>
              {['1', '2', '3', '4', '5', '6', '7', '8'].map((sem) => (
                <TabsTrigger key={sem} value={sem}>Sem {sem}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedSemester} className="mt-6">
              <div className="space-y-4">
                {subjectMarks.map((subject) => (
                  <Card key={subject.subject_code}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{subject.subject_name}</CardTitle>
                          <CardDescription>
                            {subject.subject_code} • {subject.credits} Credits
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant={subject.percentage >= 60 ? "default" : "destructive"}>
                            {getGrade(subject.percentage)}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {subject.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">Mid-1</p>
                          <p className="text-lg">{subject.mid1 || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Mid-2</p>
                          <p className="text-lg">{subject.mid2 || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Assignment</p>
                          <p className="text-lg">{subject.assignment || '-'}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">End Exam</p>
                          <p className="text-lg">{subject.end_exam || '-'}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total: {subject.total_obtained}/{subject.total_marks}</span>
                          <span>{subject.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={subject.percentage} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
