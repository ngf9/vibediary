'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Link, Image as ImageIcon, Loader2 } from 'lucide-react';
import { db } from '@/lib/instant';

/** Returns true if a string is an InstantDB storage path (not a URL or local path). */
function isStoragePath(value: string): boolean {
  if (!value) return false;
  return !value.startsWith('http') && !value.startsWith('/');
}

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | 'free';
  maxSizeMB?: number;
  storagePath?: string;
}

export default function ImageUploader({
  value = '',
  onChange,
  placeholder = 'Enter image URL or upload file',
  aspectRatio = 'free',
  maxSizeMB = 5,
  storagePath = 'uploads',
}: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');
  const [tempUrl, setTempUrl] = useState(value || '');
  const [previewError, setPreviewError] = useState(false);
  const [resolvedPreviewUrl, setResolvedPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolve storage paths to fresh URLs for preview
  useEffect(() => {
    if (value && isStoragePath(value)) {
      setResolvedPreviewUrl(null);
      db.queryOnce({
        $files: { $: { where: { path: value } } }
      }).then(result => {
        const url = result.data.$files?.[0]?.url;
        if (url) {
          setResolvedPreviewUrl(url);
          setPreviewError(false);
        } else {
          setPreviewError(true);
        }
      }).catch(() => {
        setPreviewError(true);
      });
    } else {
      setResolvedPreviewUrl(null);
    }
  }, [value]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setIsLoading(true);

    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const path = `${storagePath}/${timestamp}-${sanitizedName}`;

      // Upload to InstantDB Storage
      await db.storage.uploadFile(path, file);

      // Store the stable path instead of the ephemeral URL
      onChange(path);
      setTempUrl(path);
      setPreviewError(false);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setTempUrl(url);
    onChange(url);
    setPreviewError(false);
  };

  const handleClear = async () => {
    if (value) {
      try {
        if (isStoragePath(value)) {
          // Value is a storage path - delete directly
          await db.storage.delete(value);
        } else if (value.includes('instant-storage')) {
          // Legacy: value is an S3 URL - try to look up file by URL
          const result = await db.queryOnce({
            $files: { $: { where: { url: value } } }
          });
          const filePath = result.data.$files?.[0]?.path;
          if (filePath) {
            await db.storage.delete(filePath);
          }
        }
      } catch (error) {
        console.error('Failed to delete file from storage:', error);
      }
    }

    onChange('');
    setTempUrl('');
    setPreviewError(false);
    setResolvedPreviewUrl(null);
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

  // Determine which URL to use for the preview image
  const previewUrl = value
    ? (isStoragePath(value) ? resolvedPreviewUrl : value)
    : null;

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
            value={tempUrl || ''}
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
            disabled={isLoading}
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
      {value && previewUrl && !previewError && (
        <div className="relative">
          <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${aspectRatioClasses[aspectRatio]}`}>
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              style={{ objectFit: 'contain' }}
              onError={() => setPreviewError(true)}
              unoptimized
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

      {/* Loading state for storage path resolution */}
      {value && isStoragePath(value) && !resolvedPreviewUrl && !previewError && (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-purple-600 mr-2" />
          <span className="text-sm text-gray-600">Loading preview...</span>
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
