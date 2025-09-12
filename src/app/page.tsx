'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import EditingInterface from '@/components/EditingInterface';
import EditHistory from '@/components/EditHistory';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/lib/auth-context';
import { Loader2, LogOut } from 'lucide-react';

interface EditHistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  isOriginal?: boolean;
  beforeImageUrl?: string;
}

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [editHistory, setEditHistory] = useState<EditHistoryItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleImageUpload = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    const originalImageEntry: EditHistoryItem = {
      id: Date.now().toString(),
      prompt: '',
      imageUrl: imageUrl,
      timestamp: new Date(),
      isOriginal: true,
    };
    setEditHistory([originalImageEntry]);
  };

  const handleImageEdit = (prompt: string, newImageUrl: string) => {
    const newEdit: EditHistoryItem = {
      id: Date.now().toString(),
      prompt,
      imageUrl: newImageUrl,
      timestamp: new Date(),
      beforeImageUrl: currentImage || undefined,
    };
    
    setEditHistory(prev => [...prev, newEdit]);
    setCurrentImage(newImageUrl);
  };

  const handleSelectFromHistory = (imageUrl: string) => {
    setCurrentImage(imageUrl);
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
            Edit your photos with natural language using Google's Gemini 2.5 Flash
          </p>
          
          {user.email && (
            <p className="text-sm text-gray-500 mt-2">
              Welcome, {user.email}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!currentImage ? (
              <ImageUpload onImageUpload={handleImageUpload} />
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
              editHistory={editHistory}
              currentImage={currentImage}
              onSelectFromHistory={handleSelectFromHistory}
              onReset={() => {
                setCurrentImage(null);
                setEditHistory([]);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
