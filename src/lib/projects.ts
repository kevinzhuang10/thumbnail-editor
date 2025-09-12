import { supabase } from './supabase';
import type { Project, ProjectInsert, ProjectUpdate, Edit, EditInsert } from '../types/database';

export class ProjectService {
  // Projects
  static async createProject(projectData: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getProject(projectId: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }

  static async updateProject(projectId: string, updates: ProjectUpdate): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }

  static async archiveProject(projectId: string): Promise<Project> {
    return this.updateProject(projectId, { is_archived: true });
  }

  // Edits
  static async createEdit(editData: EditInsert): Promise<Edit> {
    const { data, error } = await supabase
      .from('edits')
      .insert(editData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProjectEdits(projectId: string): Promise<Edit[]> {
    const { data, error } = await supabase
      .from('edits')
      .select('*')
      .eq('project_id', projectId)
      .order('edit_number', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async getNextEditNumber(projectId: string): Promise<number> {
    const { data, error } = await supabase
      .from('edits')
      .select('edit_number')
      .eq('project_id', projectId)
      .order('edit_number', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0].edit_number + 1 : 1;
  }

  static async deleteEdit(editId: string): Promise<void> {
    const { error } = await supabase
      .from('edits')
      .delete()
      .eq('id', editId);

    if (error) throw error;
  }

  // Combined operations
  static async getProjectWithEdits(projectId: string): Promise<{
    project: Project;
    edits: Edit[];
  } | null> {
    const [project, edits] = await Promise.all([
      this.getProject(projectId),
      this.getProjectEdits(projectId)
    ]);

    if (!project) return null;

    return { project, edits };
  }

  static async createProjectWithOriginalImage(
    userId: string,
    name: string,
    originalImageUrl: string,
    description?: string,
    originalImageMetadata?: Record<string, any>
  ): Promise<Project> {
    return this.createProject({
      user_id: userId,
      name,
      description,
      original_image_url: originalImageUrl,
      thumbnail_url: originalImageUrl, // Use original as thumbnail initially
      original_image_metadata: originalImageMetadata
    });
  }
}