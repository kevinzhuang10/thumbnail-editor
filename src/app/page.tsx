'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import EditingInterface from '@/components/EditingInterface';
import EditHistory from '@/components/EditHistory';

interface EditHistoryItem {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
}

export default function Home() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [editHistory, setEditHistory] = useState<EditHistoryItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setEditHistory([]);
  };

  const handleImageEdit = (prompt: string, newImageUrl: string) => {
    const newEdit: EditHistoryItem = {
      id: Date.now().toString(),
      prompt,
      imageUrl: newImageUrl,
      timestamp: new Date(),
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
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Thumbnail Editor
          </h1>
          <p className="text-lg text-gray-600">
            Edit your photos with natural language using Google's Gemini 2.5 Flash
          </p>
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
