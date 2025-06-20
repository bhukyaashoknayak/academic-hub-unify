
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, GraduationCap, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  branch: string;
  section: string;
  year: number;
  semester: string;
  cgpa: number;
  address: string;
  dateOfBirth: string;
  fatherName: string;
  motherName: string;
  emergencyContact: string;
}

export default function ProfileModule() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@student.college.edu',
    phone: '+91 9876543210',
    rollNumber: '21CSE001',
    branch: 'Computer Science Engineering',
    section: 'A',
    year: 3,
    semester: '5',
    cgpa: 8.9,
    address: '123 Main Street, City, State - 123456',
    dateOfBirth: '2002-05-15',
    fatherName: 'Robert Doe',
    motherName: 'Jane Doe',
    emergencyContact: '+91 9876543211'
  });

  const [editData, setEditData] = useState<ProfileData>(profileData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const academicInfo = [
    { label: 'Roll Number', value: profileData.rollNumber, icon: GraduationCap },
    { label: 'Branch', value: profileData.branch, icon: GraduationCap },
    { label: 'Section', value: profileData.section, icon: GraduationCap },
    { label: 'Year', value: `${profileData.year}${profileData.year === 1 ? 'st' : profileData.year === 2 ? 'nd' : profileData.year === 3 ? 'rd' : 'th'} Year`, icon: Calendar },
    { label: 'Semester', value: `Semester ${profileData.semester}`, icon: Calendar },
    { label: 'CGPA', value: profileData.cgpa.toString(), icon: GraduationCap }
  ];

  const personalInfo = [
    { label: 'Email', value: profileData.email, icon: Mail, editable: true },
    { label: 'Phone', value: profileData.phone, icon: Phone, editable: true },
    { label: 'Date of Birth', value: new Date(profileData.dateOfBirth).toLocaleDateString(), icon: Calendar, editable: true },
    { label: 'Address', value: profileData.address, icon: MapPin, editable: true }
  ];

  const familyInfo = [
    { label: 'Father\'s Name', value: profileData.fatherName, editable: true },
    { label: 'Mother\'s Name', value: profileData.motherName, editable: true },
    { label: 'Emergency Contact', value: profileData.emergencyContact, editable: true }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-lg">
                {getInitials(profileData.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  <p className="text-gray-600">{profileData.rollNumber}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    <Badge variant="secondary">{profileData.branch}</Badge>
                    <Badge variant="outline">Section {profileData.section}</Badge>
                    <Badge variant="outline">Semester {profileData.semester}</Badge>
                  </div>
                </div>
                
                <div className="md:ml-auto">
                  {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </CardTitle>
            <CardDescription>Your academic details and performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {academicInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{info.label}</p>
                    <p className="font-medium">{info.value}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your contact and personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <Label className="text-sm text-gray-600">{info.label}</Label>
                    {isEditing && info.editable ? (
                      <Input
                        value={editData[info.label.toLowerCase().replace(/[^a-z]/g, '') as keyof ProfileData] as string}
                        onChange={(e) => setEditData({
                          ...editData,
                          [info.label.toLowerCase().replace(/[^a-z]/g, '')]: e.target.value
                        })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Family Information */}
      <Card>
        <CardHeader>
          <CardTitle>Family Information</CardTitle>
          <CardDescription>Family and emergency contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {familyInfo.map((info, index) => (
              <div key={index}>
                <Label className="text-sm text-gray-600">{info.label}</Label>
                {isEditing && info.editable ? (
                  <Input
                    value={editData[info.label.toLowerCase().replace(/[^a-z]/g, '') as keyof ProfileData] as string}
                    onChange={(e) => setEditData({
                      ...editData,
                      [info.label.toLowerCase().replace(/[^a-z]/g, '')]: e.target.value
                    })}
                    className="mt-1"
                  />
                ) : (
                  <p className="font-medium mt-1">{info.value}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
          <CardDescription>Your academic achievements and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{profileData.cgpa}</div>
              <div className="text-sm text-blue-600">Current CGPA</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-green-600">Overall Attendance</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-purple-600">Subjects Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
