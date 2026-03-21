'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface AIUploadModalProps {
  onClose: () => void;
  onDataParsed: (data: any) => void;
}

export function AIUploadModal({ onClose, onDataParsed }: AIUploadModalProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/ai/parse-document', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        toast.success('✅ Document parsed successfully!');
        onDataParsed(result.data);
        onClose();
      } else {
        toast.error('❌ Failed to parse document');
      }
    } catch (error) {
      toast.error('❌ Upload failed');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🤖 AI Document Parser
        </h2>
        <p className="text-gray-600 mb-6">
          Upload a contract PDF and our AI will automatically extract the key information
        </p>

        {uploading ? (
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Analyzing document... {progress}%
            </p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
            <div className="text-5xl mb-3">📄</div>
            <label className="cursor-pointer">
              <span className="text-blue-600 font-semibold hover:text-blue-700">
                Click to upload
              </span>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOCX, or TXT (max 10MB)
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
          disabled={uploading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
