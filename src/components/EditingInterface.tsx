'use client';

import { useState } from 'react';
import { Wand2, Loader2, Download, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface EditingInterfaceProps {
  currentImage: string;
  onImageEdit: (prompt: string, newImageUrl: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

export default function EditingInterface({
  currentImage,
  onImageEdit,
  isEditing,
  setIsEditing
}: EditingInterfaceProps) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!prompt.trim()) return;

    setIsEditing(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // prompt: `Edit this image: ${prompt}. Make this look like a professional YouTube thumbnail with vibrant colors and clear text elements.`,
          prompt: `${prompt}`,
          imageData: currentImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      onImageEdit(prompt, data.imageUrl);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while editing the image');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `thumbnail-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const youtubeThumbnailSuggestions = [
    "Make the colors more vibrant and add bold text overlay",
    "Add dramatic lighting and shadow effects",
    "Create a split-screen comparison layout",
    "Add glowing neon effects and futuristic elements",
    "Make it look like a movie poster with dramatic composition",
    "Add explosion effects and dynamic action elements",
    "Create a before/after transformation style",
    "Add clickbait-style arrows and highlight elements"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          {currentImage ? (
            <div className="relative w-full h-full">
              <Image
                src={currentImage}
                alt="Current thumbnail"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="text-gray-400">No image selected</div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-800">
              Current thumbnail (16:9 ratio)
            </span>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Edit with Natural Language
        </h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-900 mb-2">
              Describe how you want to edit your thumbnail:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Make the colors more vibrant, add bold text saying 'AMAZING RESULTS', add dramatic lighting..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isEditing}
            />
          </div>

          <button
            onClick={handleEdit}
            disabled={isEditing || !prompt.trim()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isEditing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Editing image...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>Edit Thumbnail</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Quick Suggestions for YouTube Thumbnails:
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {youtubeThumbnailSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setPrompt(suggestion)}
                disabled={isEditing}
                className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}