export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          created_at: string
        }
        Insert: {
          email: string
          full_name: string
          password?: string
        }
        Update: {
          email?: string
          full_name?: string
        }
      }
      courses: {
        Row: {
          id: string
          user_id: string
          code: string
          name: string
          grade: string
          units: number
          semester: string
          created_at: string
        }
        Insert: {
          user_id: string
          code: string
          name: string
          grade: string
          units: number
          semester: string
        }
        Update: {
          code?: string
          name?: string
          grade?: string
          units?: number
          semester?: string
        }
      }
      cgpa_records: {
        Row: {
          id: string
          user_id: string
          semester_gpa: number
          cumulative_gpa: number
          total_credits: number
          calculated_at: string
        }
        Insert: {
          user_id: string
          semester_gpa: number
          cumulative_gpa: number
          total_credits: number
        }
        Update: {
          semester_gpa?: number
          cumulative_gpa?: number
          total_credits?: number
        }
      }
    }
    Functions: {
      calculate_cgpa: {
        Args: { user_id: string }
        Returns: number
      }
    }
  }
}
