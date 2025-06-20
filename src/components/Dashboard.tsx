
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, Calendar, TrendingUp, Award, Clock } from 'lucide-react';

// Mock data for charts
const attendanceData = [
  { name: 'Present', value: 85, color: '#10B981' },
  { name: 'Absent', value: 15, color: '#EF4444' }
];

const marksData = [
  { semester: 'Sem 1', cgpa: 8.2 },
  { semester: 'Sem 2', cgpa: 8.5 },
  { semester: 'Sem 3', cgpa: 8.7 },
  { semester: 'Sem 4', cgpa: 8.9 },
  { semester: 'Sem 5', cgpa: 9.1 }
];

const subjectAttendance = [
  { subject: 'Mathematics', attendance: 92 },
  { subject: 'Physics', attendance: 88 },
  { subject: 'Chemistry', attendance: 85 },
  { subject: 'Computer Science', attendance: 95 },
  { subject: 'English', attendance: 78 }
];

export default function Dashboard() {
  // Mock student data
  const studentData = {
    name: 'John Doe',
    rollNumber: '21CSE001',
    semester: '5' as const,
    branch: 'CSE' as const,
    section: 'A' as const,
    cgpa: 8.9,
    currentAttendance: 85
  };

  const upcomingClasses = [
    { subject: 'Data Structures', time: '09:00 AM', room: 'CS-101' },
    { subject: 'Computer Networks', time: '11:00 AM', room: 'CS-201' },
    { subject: 'Database Systems', time: '02:00 PM', room: 'CS-301' }
  ];

  const recentMarks = [
    { subject: 'Machine Learning', exam: 'Mid Term', marks: '45/50', grade: 'A+' },
    { subject: 'Software Engineering', exam: 'Assignment', marks: '18/20', grade: 'A' },
    { subject: 'Computer Graphics', exam: 'Quiz', marks: '9/10', grade: 'A+' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {studentData.name}!</h1>
        <p className="opacity-90">
          {studentData.rollNumber} • {studentData.branch} - {studentData.section} • Semester {studentData.semester}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.currentAttendance}%</div>
            <Progress value={studentData.currentAttendance} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {studentData.currentAttendance >= 75 ? '✅ Good standing' : '⚠️ Below required'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.cgpa}</div>
            <p className="text-xs text-muted-foreground">
              {studentData.cgpa >= 8.5 ? 'First Class with Distinction' : 
               studentData.cgpa >= 7.5 ? 'First Class' : 'Second Class'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Next: {upcomingClasses[0]?.time || 'No classes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 assignments, 1 project</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Overall attendance distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CGPA Trend</CardTitle>
            <CardDescription>Academic performance over semesters</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={marksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis domain={[6, 10]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cgpa" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{cls.subject}</p>
                    <p className="text-sm text-gray-600">{cls.room}</p>
                  </div>
                  <Badge variant="outline">{cls.time}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Marks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMarks.map((mark, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{mark.subject}</p>
                    <p className="text-sm text-gray-600">{mark.exam}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{mark.marks}</p>
                    <Badge variant={mark.grade.startsWith('A') ? 'default' : 'secondary'}>
                      {mark.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject-wise Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Attendance</CardTitle>
          <CardDescription>Attendance percentage for each subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subjectAttendance.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{subject.subject}</span>
                  <span className="text-sm text-gray-600">{subject.attendance}%</span>
                </div>
                <Progress value={subject.attendance} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
