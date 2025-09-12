'use client';

import { RotateCcw, Clock, ChevronRight, Eye, EyeOff, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ProjectService } from '@/lib/projects';
import type { Project, Edit } from '@/types/database';

interface EditHistoryProps {
  project: Project | null;
  currentImage: string | null;
  onSelectFromHistory: (imageUrl: string) => void;
  onReset: () => void;
}

export default function EditHistory({
  project,
  currentImage,
  onSelectFromHistory,
  onReset
}: EditHistoryProps) {
  const [showBefore, setShowBefore] = useState(false);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      loadEdits();
    } else {
      setEdits([]);
    }
  }, [project]);

  const loadEdits = async () => {
    if (!project) return;
    
    setLoading(true);
    try {
      const editsData = await ProjectService.getProjectEdits(project.id);
      setEdits(editsData);
    } catch (error) {
      console.error('Failed to load edits:', error);
    } finally {
      setLoading(false);
    }
  };


  const formatTimestamp = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Create a combined history with original image + edits
  const historyItems = project ? [
    {
      id: 'original',
      imageUrl: project.original_image_url,
      prompt: '',
      timestamp: project.created_at,
      isOriginal: true,
      edit_number: 0,
      beforeImageUrl: undefined as string | undefined
    },
    ...edits.map(edit => ({
      id: edit.id,
      imageUrl: edit.output_image_url,
      prompt: edit.prompt,
      timestamp: edit.created_at,
      isOriginal: false,
      beforeImageUrl: edit.input_image_url,
      edit_number: edit.edit_number
    }))
  ] : [];

  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Edit History</h3>
        </div>
        <div className="p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-sm">
            Select or create a project to see edit history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit History</h3>
            <p className="text-sm text-gray-500 mt-1">{project.name}</p>
          </div>
          {currentImage && (
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </button>
          )}
        </div>
        
        {historyItems.some(item => !item.isOriginal && item.beforeImageUrl) && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBefore(!showBefore)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showBefore ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showBefore ? 'Hide Before' : 'See Before'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading edit history...</p>
          </div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 text-sm">
              Your edit history will appear here as you make changes
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className={`group cursor-pointer border rounded-lg p-3 transition-all hover:shadow-md ${
                  item.imageUrl === currentImage
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onSelectFromHistory(item.imageUrl)}
              >
                <div className="flex items-start space-x-3">
                  {showBefore && !item.isOriginal && item.beforeImageUrl ? (
                    <div className="flex-shrink-0">
                      <div className="flex space-x-2">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={item.beforeImageUrl}
                            alt="Before"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-center text-gray-400">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt="After"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.isOriginal ? 'Original image' : `Edit ${item.edit_number}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {item.isOriginal ? 'Original' : `Edit #${item.edit_number}`}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-700">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                    </div>
                    
                    {showBefore && !item.isOriginal && item.beforeImageUrl ? (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 font-medium">Before → After</div>
                        <p className="text-xs text-gray-600 line-clamp-3 group-hover:text-gray-900">
                          <span className="font-medium">Prompt:</span> {item.prompt}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-900">
                        {item.isOriginal ? 'Original uploaded image' : item.prompt}
                      </p>
                    )}
                    
                    {item.imageUrl === currentImage && (
                      <div className="flex items-center space-x-1 mt-2 text-xs text-blue-600">
                        <ChevronRight className="w-3 h-3" />
                        <span>Currently selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {historyItems.length > 0 && (
        <div className="p-4 border-t bg-gray-50 text-xs text-gray-600">
          <p>
            Click on any version to restore it. Total items: {historyItems.length} (Original + {edits.length} edits)
          </p>
        </div>
      )}
    </div>
  );
}