# Supabase Setup Guide for CGPA Calculator

## Prerequisites
- Supabase Account
- Project Created in Supabase

## Steps to Set Up

1. **Create Supabase Project**
   - Go to [Supabase](https://supabase.com/)
   - Create a new project
   - Note down Project URL and Anon Key

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Replace placeholders with your actual Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_actual_project_url
     VITE_SUPABASE_ANON_KEY=your_actual_anon_key
     ```

3. **Database Setup**
   - Run the SQL migration script in `supabase/migrations/initial_schema.sql`
   - This will create:
     * `profiles` table
     * `cgpa_records` table
     * `courses` table
     * Row Level Security policies
     * Trigger for automatic profile creation

4. **Authentication**
   - In Supabase Dashboard, go to Authentication
   - Enable Email/Password provider
   - Configure any additional settings

## Database Schema

### Profiles Table
- `id`: User ID (from auth.users)
- `email`: User email
- `role`: 'user' or 'admin'

### CGPA Records Table
- `id`: Record ID
- `user_id`: User who owns the record
- `semester`: Semester number
- `gpa`: Semester GPA
- `total_credits`: Total credits for the semester
- `created_at`: Timestamp of record creation

### Courses Table
- `id`: Course ID
- `code`: Course code
- `name`: Course name
- `credits`: Course credits

## Troubleshooting
- Ensure all environment variables are correctly set
- Check Supabase project status
- Verify database migrations are applied

## Security Notes
- Row Level Security is enabled
- Users can only access their own data
- Admin role provides additional privileges
