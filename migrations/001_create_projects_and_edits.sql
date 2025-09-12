-- Migration: Create projects and edits tables
-- Run this in your Supabase SQL Editor

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    original_image_url TEXT NOT NULL,
    original_image_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    project_settings JSONB
);

-- Create edits table
CREATE TABLE edits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    edit_number INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    input_image_url TEXT NOT NULL,
    output_image_url TEXT NOT NULL,
    generation_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_successful BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE(project_id, edit_number)
);

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_edits_project_id ON edits(project_id);
CREATE INDEX idx_edits_project_edit_number ON edits(project_id, edit_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to projects table
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE edits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for edits
CREATE POLICY "Users can view edits from their own projects" ON edits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = edits.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert edits to their own projects" ON edits
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = edits.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update edits from their own projects" ON edits
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = edits.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete edits from their own projects" ON edits
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = edits.project_id 
            AND projects.user_id = auth.uid()
        )
    );