'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Star, Plus, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';

export interface ImageItem {
    id: string;
    url: string;
    isCover: boolean;
}

interface MultiImageUploadProps {
    value: ImageItem[];
    onChange: (images: ImageItem[]) => void;
    uploadEndpoint?: string;
    maxImages?: number;
    label?: string;
    error?: boolean;
    errorMessage?: string;
}

/**
 * MultiImageUpload - Upload multiple images with cover selection
 */
export default function MultiImageUpload({
    value = [],
    onChange,
    uploadEndpoint = '/api/admin/upload/events',
    maxImages = 10,
    label = 'Images',
    error = false,
    errorMessage,
}: MultiImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Generate unique ID
    const generateId = () => crypto.randomUUID();

    // Handle file upload
    const handleFileUpload = useCallback(async (files: FileList) => {
        if (value.length + files.length > maxImages) {
            setUploadError(`Maximum ${maxImages} images autorisées`);
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        const newImages: ImageItem[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file type
            if (!file.type.startsWith('image/')) {
                continue;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setUploadError('Une ou plusieurs images sont trop volumineuses (max 5MB)');
                continue;
            }

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch(uploadEndpoint, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erreur lors de l\'upload');
                }

                newImages.push({
                    id: generateId(),
                    url: data.url,
                    isCover: value.length === 0 && newImages.length === 0, // First image is cover
                });
            } catch (err: any) {
                setUploadError(err.message || 'Erreur lors de l\'upload');
            }
        }

        if (newImages.length > 0) {
            onChange([...value, ...newImages]);
        }

        setIsUploading(false);
    }, [value, onChange, uploadEndpoint, maxImages]);

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileUpload(files);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle drag and drop
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileUpload(files);
        }
    };

    // Add image from URL
    const handleAddUrl = () => {
        if (!urlInput.trim()) return;

        if (value.length >= maxImages) {
            setUploadError(`Maximum ${maxImages} images autorisées`);
            return;
        }

        const newImage: ImageItem = {
            id: generateId(),
            url: urlInput.trim(),
            isCover: value.length === 0,
        };

        onChange([...value, newImage]);
        setUrlInput('');
        setShowUrlInput(false);
        setUploadError(null);
    };

    // Set image as cover
    const setCover = (id: string) => {
        const updated = value.map(img => ({
            ...img,
            isCover: img.id === id,
        }));
        onChange(updated);
    };

    // Remove image
    const removeImage = (id: string) => {
        const updated = value.filter(img => img.id !== id);
        // If removed image was cover, set first remaining as cover
        if (updated.length > 0 && !updated.some(img => img.isCover)) {
            updated[0].isCover = true;
        }
        onChange(updated);
    };

    const coverImage = value.find(img => img.isCover);

    return (
        <div className="space-y-3">
            {/* Label */}
            {label && (
                <label className="block font-medium text-gray-700">
                    {label}
                    <span className="text-gray-400 font-normal ml-2">({value.length}/{maxImages})</span>
                </label>
            )}

            {/* Cover Preview */}
            {coverImage && (
                <div className="relative rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50">
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3 fill-white" />
                        Couverture
                    </div>
                    <div className="relative h-48">
                        <Image
                            src={coverImage.url}
                            alt="Cover"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                </div>
            )}

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                    {value.map((img) => (
                        <div
                            key={img.id}
                            className={`relative group rounded-lg overflow-hidden border-2 transition-all ${img.isCover ? 'border-emerald-500' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="relative h-20">
                                <Image
                                    src={img.url}
                                    alt="Image"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {!img.isCover && (
                                    <button
                                        type="button"
                                        onClick={() => setCover(img.id)}
                                        className="p-1.5 bg-white rounded-full hover:bg-emerald-100 transition-colors"
                                        title="Définir comme couverture"
                                    >
                                        <Star className="w-3.5 h-3.5 text-emerald-600" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeImage(img.id)}
                                    className="p-1.5 bg-white rounded-full hover:bg-red-100 transition-colors"
                                    title="Supprimer"
                                >
                                    <X className="w-3.5 h-3.5 text-red-600" />
                                </button>
                            </div>

                            {/* Cover indicator */}
                            {img.isCover && (
                                <div className="absolute top-1 right-1">
                                    <Star className="w-4 h-4 text-emerald-500 fill-emerald-500 drop-shadow" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {value.length < maxImages && (
                <div
                    className={`relative border-2 border-dashed rounded-xl transition-all ${dragActive
                            ? 'border-emerald-500 bg-emerald-50'
                            : error
                                ? 'border-red-300 bg-red-50/50'
                                : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    <div className="p-4">
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                                <span className="text-sm text-gray-600">Upload en cours...</span>
                            </div>
                        ) : showUrlInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://exemple.com/image.jpg"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddUrl}
                                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                                >
                                    Ajouter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUrlInput(false);
                                        setUrlInput('');
                                    }}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Annuler
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Uploader
                                    </button>
                                    <span className="text-gray-400">ou</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowUrlInput(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        Ajouter URL
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP jusqu'à 5MB • Glisser-déposer accepté</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error Message */}
            {(uploadError || errorMessage) && (
                <p className="text-red-600 text-xs flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {uploadError || errorMessage}
                </p>
            )}
        </div>
    );
}
