export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_present: boolean | null
          student_id: string | null
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_present?: boolean | null
          student_id?: string | null
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_present?: boolean | null
          student_id?: string | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      grievances: {
        Row: {
          admin_response: string | null
          created_at: string | null
          description: string
          id: string
          status: Database["public"]["Enums"]["grievance_status"] | null
          student_id: string | null
          title: string
          type: Database["public"]["Enums"]["grievance_type"]
          updated_at: string | null
        }
        Insert: {
          admin_response?: string | null
          created_at?: string | null
          description: string
          id?: string
          status?: Database["public"]["Enums"]["grievance_status"] | null
          student_id?: string | null
          title: string
          type: Database["public"]["Enums"]["grievance_type"]
          updated_at?: string | null
        }
        Update: {
          admin_response?: string | null
          created_at?: string | null
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["grievance_status"] | null
          student_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["grievance_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grievances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          created_at: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          id: string
          marks_obtained: number
          semester: Database["public"]["Enums"]["semester_type"]
          student_id: string | null
          subject_id: string | null
          total_marks: number
        }
        Insert: {
          created_at?: string | null
          exam_type: Database["public"]["Enums"]["exam_type"]
          id?: string
          marks_obtained: number
          semester: Database["public"]["Enums"]["semester_type"]
          student_id?: string | null
          subject_id?: string | null
          total_marks: number
        }
        Update: {
          created_at?: string | null
          exam_type?: Database["public"]["Enums"]["exam_type"]
          id?: string
          marks_obtained?: number
          semester?: Database["public"]["Enums"]["semester_type"]
          student_id?: string | null
          subject_id?: string | null
          total_marks?: number
        }
        Relationships: [
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          target_branch: Database["public"]["Enums"]["branch_type"] | null
          target_section: Database["public"]["Enums"]["section_type"] | null
          target_year: number | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          target_branch?: Database["public"]["Enums"]["branch_type"] | null
          target_section?: Database["public"]["Enums"]["section_type"] | null
          target_year?: number | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          target_branch?: Database["public"]["Enums"]["branch_type"] | null
          target_section?: Database["public"]["Enums"]["section_type"] | null
          target_year?: number | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: []
      }
      previous_papers: {
        Row: {
          file_url: string
          id: string
          paper_title: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject_id: string | null
          upload_date: string | null
          year: number
        }
        Insert: {
          file_url: string
          id?: string
          paper_title: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject_id?: string | null
          upload_date?: string | null
          year: number
        }
        Update: {
          file_url?: string
          id?: string
          paper_title?: string
          semester?: Database["public"]["Enums"]["semester_type"]
          subject_id?: string | null
          upload_date?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "previous_papers_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_notifications: {
        Row: {
          id: string
          is_read: boolean | null
          notification_id: string | null
          read_at: string | null
          student_id: string | null
        }
        Insert: {
          id?: string
          is_read?: boolean | null
          notification_id?: string | null
          read_at?: string | null
          student_id?: string | null
        }
        Update: {
          id?: string
          is_read?: boolean | null
          notification_id?: string | null
          read_at?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_notifications_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_notifications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          branch: Database["public"]["Enums"]["branch_type"]
          cgpa: number | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          roll_number: string
          section: Database["public"]["Enums"]["section_type"]
          semester: Database["public"]["Enums"]["semester_type"]
          updated_at: string | null
          user_id: string | null
          year: number
        }
        Insert: {
          branch: Database["public"]["Enums"]["branch_type"]
          cgpa?: number | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          roll_number: string
          section: Database["public"]["Enums"]["section_type"]
          semester: Database["public"]["Enums"]["semester_type"]
          updated_at?: string | null
          user_id?: string | null
          year: number
        }
        Update: {
          branch?: Database["public"]["Enums"]["branch_type"]
          cgpa?: number | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          roll_number?: string
          section?: Database["public"]["Enums"]["section_type"]
          semester?: Database["public"]["Enums"]["semester_type"]
          updated_at?: string | null
          user_id?: string | null
          year?: number
        }
        Relationships: []
      }
      subjects: {
        Row: {
          branch: Database["public"]["Enums"]["branch_type"]
          created_at: string | null
          credits: number | null
          id: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject_code: string
          subject_name: string
        }
        Insert: {
          branch: Database["public"]["Enums"]["branch_type"]
          created_at?: string | null
          credits?: number | null
          id?: string
          semester: Database["public"]["Enums"]["semester_type"]
          subject_code: string
          subject_name: string
        }
        Update: {
          branch?: Database["public"]["Enums"]["branch_type"]
          created_at?: string | null
          credits?: number | null
          id?: string
          semester?: Database["public"]["Enums"]["semester_type"]
          subject_code?: string
          subject_name?: string
        }
        Relationships: []
      }
      timetable: {
        Row: {
          branch: Database["public"]["Enums"]["branch_type"]
          created_at: string | null
          day: Database["public"]["Enums"]["day_type"]
          faculty_id: string | null
          id: string
          room_number: string | null
          section: Database["public"]["Enums"]["section_type"]
          semester: Database["public"]["Enums"]["semester_type"]
          subject_id: string | null
          time_slot: string
          year: number
        }
        Insert: {
          branch: Database["public"]["Enums"]["branch_type"]
          created_at?: string | null
          day: Database["public"]["Enums"]["day_type"]
          faculty_id?: string | null
          id?: string
          room_number?: string | null
          section: Database["public"]["Enums"]["section_type"]
          semester: Database["public"]["Enums"]["semester_type"]
          subject_id?: string | null
          time_slot: string
          year: number
        }
        Update: {
          branch?: Database["public"]["Enums"]["branch_type"]
          created_at?: string | null
          day?: Database["public"]["Enums"]["day_type"]
          faculty_id?: string | null
          id?: string
          room_number?: string | null
          section?: Database["public"]["Enums"]["section_type"]
          semester?: Database["public"]["Enums"]["semester_type"]
          subject_id?: string | null
          time_slot?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "timetable_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculty"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      working_days: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_working_day: boolean | null
          subject_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_working_day?: boolean | null
          subject_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_working_day?: boolean | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "working_days_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      branch_type: "CSE" | "ECE" | "EEE" | "MECH" | "CIVIL" | "IT" | "CHEM"
      day_type:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
      exam_type: "mid1" | "mid2" | "assignment" | "end_exam"
      grievance_status: "pending" | "in_review" | "resolved"
      grievance_type: "academic" | "non_academic" | "app_feedback"
      notification_type:
        | "exam"
        | "assignment"
        | "attendance"
        | "event"
        | "general"
      section_type: "A" | "B" | "C" | "D"
      semester_type: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      branch_type: ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT", "CHEM"],
      day_type: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      exam_type: ["mid1", "mid2", "assignment", "end_exam"],
      grievance_status: ["pending", "in_review", "resolved"],
      grievance_type: ["academic", "non_academic", "app_feedback"],
      notification_type: [
        "exam",
        "assignment",
        "attendance",
        "event",
        "general",
      ],
      section_type: ["A", "B", "C", "D"],
      semester_type: ["1", "2", "3", "4", "5", "6", "7", "8"],
    },
  },
} as const
