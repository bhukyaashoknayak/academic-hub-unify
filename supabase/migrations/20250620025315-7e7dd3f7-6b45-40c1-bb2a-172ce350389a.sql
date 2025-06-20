
-- Create enum types for the system
CREATE TYPE branch_type AS ENUM ('CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'CHEM');
CREATE TYPE section_type AS ENUM ('A', 'B', 'C', 'D');
CREATE TYPE semester_type AS ENUM ('1', '2', '3', '4', '5', '6', '7', '8');
CREATE TYPE day_type AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
CREATE TYPE notification_type AS ENUM ('exam', 'assignment', 'attendance', 'event', 'general');
CREATE TYPE grievance_type AS ENUM ('academic', 'non_academic', 'app_feedback');
CREATE TYPE grievance_status AS ENUM ('pending', 'in_review', 'resolved');
CREATE TYPE exam_type AS ENUM ('mid1', 'mid2', 'assignment', 'end_exam');

-- Student profiles table
CREATE TABLE public.student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    branch branch_type NOT NULL,
    section section_type NOT NULL,
    year INTEGER CHECK (year BETWEEN 1 AND 4) NOT NULL,
    semester semester_type NOT NULL,
    cgpa DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subjects table
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    branch branch_type NOT NULL,
    semester semester_type NOT NULL,
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faculty table
CREATE TABLE public.faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timetable table
CREATE TABLE public.timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER CHECK (year BETWEEN 1 AND 4) NOT NULL,
    semester semester_type NOT NULL,
    branch branch_type NOT NULL,
    section section_type NOT NULL,
    day day_type NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- e.g., "09:00-10:00"
    subject_id UUID REFERENCES public.subjects(id),
    faculty_id UUID REFERENCES public.faculty(id),
    room_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id),
    date DATE NOT NULL,
    is_present BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, date)
);

-- Marks table
CREATE TABLE public.marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id),
    exam_type exam_type NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    semester semester_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, subject_id, exam_type, semester)
);

-- Previous papers table
CREATE TABLE public.previous_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id),
    year INTEGER NOT NULL,
    semester semester_type NOT NULL,
    paper_title VARCHAR(200) NOT NULL,
    file_url TEXT NOT NULL,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    target_year INTEGER,
    target_branch branch_type,
    target_section section_type,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Student notifications (for tracking read status per student)
CREATE TABLE public.student_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(student_id, notification_id)
);

-- Grievances table
CREATE TABLE public.grievances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type grievance_type NOT NULL,
    status grievance_status DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Working days table (for attendance calculation)
CREATE TABLE public.working_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id),
    date DATE NOT NULL,
    is_working_day BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subject_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_profiles
CREATE POLICY "Students can view their own profile" ON public.student_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" ON public.student_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for attendance
CREATE POLICY "Students can view their own attendance" ON public.attendance
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.student_profiles WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for marks
CREATE POLICY "Students can view their own marks" ON public.marks
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.student_profiles WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for student_notifications
CREATE POLICY "Students can view their own notifications" ON public.student_notifications
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.student_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Students can update their own notifications" ON public.student_notifications
    FOR UPDATE USING (
        student_id IN (
            SELECT id FROM public.student_profiles WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for grievances
CREATE POLICY "Students can view their own grievances" ON public.grievances
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.student_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Students can create grievances" ON public.grievances
    FOR INSERT WITH CHECK (
        student_id IN (
            SELECT id FROM public.student_profiles WHERE user_id = auth.uid()
        )
    );

-- Public read access for reference tables
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can view faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Anyone can view timetable" ON public.timetable FOR SELECT USING (true);
CREATE POLICY "Anyone can view previous papers" ON public.previous_papers FOR SELECT USING (true);
CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Anyone can view working days" ON public.working_days FOR SELECT USING (true);

-- Insert sample data
INSERT INTO public.subjects (subject_code, subject_name, branch, semester, credits) VALUES
    ('CS101', 'Programming Fundamentals', 'CSE', '1', 4),
    ('CS201', 'Data Structures', 'CSE', '2', 4),
    ('CS301', 'Database Management Systems', 'CSE', '3', 3),
    ('CS401', 'Software Engineering', 'CSE', '4', 3),
    ('MA101', 'Engineering Mathematics I', 'CSE', '1', 4),
    ('MA201', 'Engineering Mathematics II', 'CSE', '2', 4);

INSERT INTO public.faculty (name, email, department) VALUES
    ('Dr. John Smith', 'john.smith@college.edu', 'Computer Science'),
    ('Dr. Sarah Johnson', 'sarah.johnson@college.edu', 'Computer Science'),
    ('Dr. Michael Brown', 'michael.brown@college.edu', 'Mathematics'),
    ('Dr. Emily Davis', 'emily.davis@college.edu', 'Computer Science');
