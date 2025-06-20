
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Edit, Trash2, UserCog, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  roll_number: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  section: string;
  year: number;
  semester: string;
  cgpa: number;
}

export default function AdminModule() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    roll_number: '',
    name: '',
    email: '',
    phone: '',
    branch: '',
    section: '',
    year: '',
    semester: '',
    cgpa: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    // Mock data for demonstration
    const mockStudents = [
      {
        id: '1',
        roll_number: '21CSE001',
        name: 'John Doe',
        email: 'john.doe@student.college.edu',
        phone: '+91 9876543210',
        branch: 'CSE',
        section: 'A',
        year: 3,
        semester: '5',
        cgpa: 8.5
      },
      {
        id: '2',
        roll_number: '21CSE002',
        name: 'Jane Smith',
        email: 'jane.smith@student.college.edu',
        phone: '+91 9876543211',
        branch: 'CSE',
        section: 'A',
        year: 3,
        semester: '5',
        cgpa: 9.2
      },
      {
        id: '3',
        roll_number: '21ECE001',
        name: 'Mike Johnson',
        email: 'mike.johnson@student.college.edu',
        phone: '+91 9876543212',
        branch: 'ECE',
        section: 'B',
        year: 2,
        semester: '3',
        cgpa: 7.8
      },
      {
        id: '4',
        roll_number: '21CSE003',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@student.college.edu',
        phone: '+91 9876543213',
        branch: 'CSE',
        section: 'B',
        year: 3,
        semester: '5',
        cgpa: 8.9
      }
    ];
    setStudents(mockStudents);
  };

  const handleAddStudent = async () => {
    try {
      const newStudent = {
        id: Date.now().toString(),
        ...formData,
        year: parseInt(formData.year),
        cgpa: parseFloat(formData.cgpa)
      };

      setStudents(prev => [...prev, newStudent]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Student added successfully');
    } catch (error) {
      toast.error('Failed to add student');
    }
  };

  const handleEditStudent = async () => {
    if (!editingStudent) return;

    try {
      const updatedStudent = {
        ...editingStudent,
        ...formData,
        year: parseInt(formData.year),
        cgpa: parseFloat(formData.cgpa)
      };

      setStudents(prev => 
        prev.map(student => 
          student.id === editingStudent.id ? updatedStudent : student
        )
      );
      setEditingStudent(null);
      resetForm();
      toast.success('Student updated successfully');
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      setStudents(prev => prev.filter(student => student.id !== studentId));
      toast.success('Student deleted successfully');
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const resetForm = () => {
    setFormData({
      roll_number: '',
      name: '',
      email: '',
      phone: '',
      branch: '',
      section: '',
      year: '',
      semester: '',
      cgpa: ''
    });
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      roll_number: student.roll_number,
      name: student.name,
      email: student.email,
      phone: student.phone,
      branch: student.branch,
      section: student.section,
      year: student.year.toString(),
      semester: student.semester,
      cgpa: student.cgpa.toString()
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'all' || student.branch === selectedBranch;
    const matchesYear = selectedYear === 'all' || student.year.toString() === selectedYear;
    
    return matchesSearch && matchesBranch && matchesYear;
  });

  const getStats = () => {
    return {
      totalStudents: students.length,
      avgCGPA: students.reduce((sum, student) => sum + student.cgpa, 0) / students.length,
      branchDistribution: students.reduce((acc, student) => {
        acc[student.branch] = (acc[student.branch] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Branches</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.branchDistribution).length}</div>
            <p className="text-xs text-muted-foreground">Active branches</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>Add, edit, and manage student information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, roll number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="EEE">EEE</SelectItem>
                <SelectItem value="MECH">MECH</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter student details to add them to the system</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="roll_number">Roll Number</Label>
                      <Input
                        id="roll_number"
                        value={formData.roll_number}
                        onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select value={formData.branch} onValueChange={(value) => setFormData({...formData, branch: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CSE">CSE</SelectItem>
                          <SelectItem value="ECE">ECE</SelectItem>
                          <SelectItem value="EEE">EEE</SelectItem>
                          <SelectItem value="MECH">MECH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="section">Section</Label>
                      <Select value={formData.section} onValueChange={(value) => setFormData({...formData, section: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="year">Year</Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Select value={formData.semester} onValueChange={(value) => setFormData({...formData, semester: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => {setIsAddDialogOpen(false); resetForm();}}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Students Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.roll_number}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.branch} - {student.section}</Badge>
                    </TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>
                      <Badge variant={student.cgpa >= 8 ? "default" : student.cgpa >= 6 ? "secondary" : "destructive"}>
                        {student.cgpa}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={editingStudent?.id === student.id} onOpenChange={(open) => !open && setEditingStudent(null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(student)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit Student</DialogTitle>
                              <DialogDescription>Update student information</DialogDescription>
                            </DialogHeader>
                            {/* Same form fields as Add dialog */}
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit_roll_number">Roll Number</Label>
                                  <Input
                                    id="edit_roll_number"
                                    value={formData.roll_number}
                                    onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_name">Full Name</Label>
                                  <Input
                                    id="edit_name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="edit_email">Email</Label>
                                <Input
                                  id="edit_email"
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit_phone">Phone</Label>
                                <Input
                                  id="edit_phone"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit_cgpa">CGPA</Label>
                                  <Input
                                    id="edit_cgpa"
                                    type="number"
                                    step="0.01"
                                    value={formData.cgpa}
                                    onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit_semester">Semester</Label>
                                  <Select value={formData.semester} onValueChange={(value) => setFormData({...formData, semester: value})}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="2">2</SelectItem>
                                      <SelectItem value="3">3</SelectItem>
                                      <SelectItem value="4">4</SelectItem>
                                      <SelectItem value="5">5</SelectItem>
                                      <SelectItem value="6">6</SelectItem>
                                      <SelectItem value="7">7</SelectItem>
                                      <SelectItem value="8">8</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => {setEditingStudent(null); resetForm();}}>
                                Cancel
                              </Button>
                              <Button onClick={handleEditStudent}>Update Student</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
