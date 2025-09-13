'use client';

import { useState } from 'react';
import EditingInterface from '@/components/EditingInterface';
import EditHistory from '@/components/EditHistory';
import AuthForm from '@/components/AuthForm';
import ProjectSelector from '@/components/ProjectSelector';
import NewProjectDialog from '@/components/NewProjectDialog';
import { useAuth } from '@/lib/auth-context';
import { ProjectService } from '@/lib/projects';
import { Loader2, LogOut } from 'lucide-react';
import type { Project } from '@/types/database';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshHistoryTrigger, setRefreshHistoryTrigger] = useState(0);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleProjectSelect = (project: Project | null) => {
    setSelectedProject(project);
    if (project) {
      setCurrentImage(project.original_image_url);
    } else {
      setCurrentImage(null);
    }
  };

  const handleCreateNewProject = () => {
    setShowNewProjectDialog(true);
  };

  const handleProjectCreated = (project: Project) => {
    setSelectedProject(project);
    setCurrentImage(project.original_image_url);
  };

  const handleImageEdit = async (prompt: string, newImageUrl: string) => {
    if (!selectedProject || !user) return;

    try {
      const editNumber = await ProjectService.getNextEditNumber(selectedProject.id);
      
      await ProjectService.createEdit({
        project_id: selectedProject.id,
        edit_number: editNumber,
        prompt,
        input_image_url: currentImage || selectedProject.original_image_url,
        output_image_url: newImageUrl,
        generation_metadata: {
          timestamp: new Date().toISOString(),
          user_id: user.id
        }
      });

      // Update project's updated_at timestamp
      await ProjectService.updateProject(selectedProject.id, {
        thumbnail_url: newImageUrl // Update thumbnail to latest edit
      });

      setCurrentImage(newImageUrl);
      
      // Trigger history refresh
      setRefreshHistoryTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save edit:', error);
      // Still update the UI even if saving fails
      setCurrentImage(newImageUrl);
    }
  };

  const handleSelectFromHistory = (imageUrl: string) => {
    setCurrentImage(imageUrl);
  };

  const handleReset = () => {
    if (selectedProject) {
      setCurrentImage(selectedProject.original_image_url);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Thumbnail Editor
          </h1>
          <p className="text-lg text-gray-600">
            Edit your photos with natural language using Google&apos;s Gemini 2.5 Flash
          </p>
          
          {user.email && (
            <p className="text-sm text-gray-500 mt-2">
              Welcome, {user.email}
            </p>
          )}
        </header>

        {/* Project Selector */}
        <div className="mb-6">
          <ProjectSelector
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
            onCreateNewProject={handleCreateNewProject}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!selectedProject ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Get Started with Your First Project
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create a project to start editing images with AI. Each project keeps track of your original image and all the edits you make.
                  </p>
                  <button
                    onClick={handleCreateNewProject}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Project
                  </button>
                </div>
              </div>
            ) : !currentImage ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Project: {selectedProject.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Something went wrong loading the project image. Please try selecting the original image from the edit history.
                  </p>
                </div>
              </div>
            ) : (
              <EditingInterface
                currentImage={currentImage}
                onImageEdit={handleImageEdit}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <EditHistory
              project={selectedProject}
              currentImage={currentImage}
              onSelectFromHistory={handleSelectFromHistory}
              onReset={handleReset}
              key={refreshHistoryTrigger}
            />
          </div>
        </div>

        {/* New Project Dialog */}
        <NewProjectDialog
          isOpen={showNewProjectDialog}
          onClose={() => setShowNewProjectDialog(false)}
          onProjectCreated={handleProjectCreated}
        />
      </div>
    </main>
  );
}
