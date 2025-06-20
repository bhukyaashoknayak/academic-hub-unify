
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Phone, GraduationCap, Calendar, Award, Edit3, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface StudentProfile {
  id: string;
  name: string;
  roll_number: string;
  email: string;
  phone: string;
  branch: string;
  section: string;
  year: number;
  semester: string;
  cgpa: number;
  created_at: string;
}

export default function ProfileModule() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (!error && data) {
      setProfile(data);
      setEditForm({
        name: data.name,
        phone: data.phone || '',
        email: data.email
      });
    } else {
      // Mock profile data for demonstration
      const mockProfile = {
        id: '1',
        name: 'John Doe',
        roll_number: '21CSE001',
        email: user?.email || 'john.doe@student.college.edu',
        phone: '+91 9876543210',
        branch: 'CSE',
        section: 'A',
        year: 3,
        semester: '5',
        cgpa: 8.5,
        created_at: '2021-08-15T10:00:00Z'
      };
      setProfile(mockProfile);
      setEditForm({
        name: mockProfile.name,
        phone: mockProfile.phone,
        email: mockProfile.email
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('student_profiles')
        .update({
          name: editForm.name,
          phone: editForm.phone,
          email: editForm.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({
        ...profile,
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email
      });

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        phone: profile.phone || '',
        email: profile.email
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAcademicYear = (year: number) => {
    const years = ['First', 'Second', 'Third', 'Fourth'];
    return years[year - 1] || 'Unknown';
  };

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription className="text-base">
                  Roll No: {profile.roll_number} • {profile.branch} - {profile.section}
                </CardDescription>
              </div>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{profile.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Joined</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Roll Number</p>
                <p className="text-sm font-semibold">{profile.roll_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Branch</p>
                <Badge variant="secondary" className="mt-1">{profile.branch}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Section</p>
                <Badge variant="outline" className="mt-1">{profile.section}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Academic Year</p>
                <p className="text-sm">{getAcademicYear(profile.year)} Year</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Semester</p>
                <p className="text-sm">{profile.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">CGPA</p>
                <div className="flex items-center gap-2 mt-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span className="text-lg font-bold text-green-600">{profile.cgpa}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Performance Overview</CardTitle>
          <CardDescription>Summary of your academic journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8.5</div>
              <p className="text-sm text-green-700">Current CGPA</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">84%</div>
              <p className="text-sm text-blue-700">Overall Attendance</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <p className="text-sm text-purple-700">Current Semester</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
