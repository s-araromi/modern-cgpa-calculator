-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cgpa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Profiles
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create RLS Policies for CGPA Records
CREATE POLICY "Users can view own CGPA records" 
ON cgpa_records FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own CGPA records" 
ON cgpa_records FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own CGPA records" 
ON cgpa_records FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS Policies for Courses
CREATE POLICY "Users can view courses" 
ON courses FOR SELECT 
USING (true);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
