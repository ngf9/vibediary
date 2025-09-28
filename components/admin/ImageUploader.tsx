'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Link, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | 'free';
  maxSizeMB?: number;
}

export default function ImageUploader({
  value = '',
  onChange,
  placeholder = 'Enter image URL or upload file',
  aspectRatio = 'free',
  maxSizeMB = 5
}: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const [tempUrl, setTempUrl] = useState(value);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // For now, we'll use a data URL for preview
      // In production, you'd upload to a server or cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        onChange(dataUrl);
        setTempUrl(dataUrl);
        setPreviewError(false);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);

      // TODO: Implement actual file upload to server
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // onChange(data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
      setIsLoading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setTempUrl(url);
    onChange(url);
    setPreviewError(false);
  };

  const handleClear = () => {
    onChange('');
    setTempUrl('');
    setPreviewError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-4/3',
    free: 'aspect-auto'
  };

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setInputMode('url')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            inputMode === 'url'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Link className="w-4 h-4 inline mr-1" />
          URL
        </button>
        <button
          type="button"
          onClick={() => setInputMode('upload')}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            inputMode === 'upload'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-1" />
          Upload
        </button>
      </div>

      {/* Input Area */}
      {inputMode === 'url' ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {tempUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            {isLoading ? (
              <Loader2 className="w-10 h-10 mx-auto mb-3 text-purple-600 animate-spin" />
            ) : (
              <ImageIcon className="w-10 h-10 mx-auto mb-3 text-gray-400" />
            )}

            <p className="text-sm text-gray-600">
              {isLoading
                ? 'Uploading...'
                : dragActive
                ? 'Drop image here'
                : 'Drag and drop an image, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Max file size: {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {/* Preview */}
      {value && !previewError && (
        <div className="relative">
          <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${aspectRatioClasses[aspectRatio]}`}>
            <Image
              src={value}
              alt="Preview"
              fill
              style={{ objectFit: 'contain' }}
              onError={() => setPreviewError(true)}
              unoptimized={value.startsWith('data:')}
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error State */}
      {previewError && value && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">Failed to load image</p>
          <p className="text-xs text-red-500 mt-1">{value}</p>
        </div>
      )}
    </div>
  );
}