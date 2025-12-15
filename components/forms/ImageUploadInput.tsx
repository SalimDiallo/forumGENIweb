'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import Image from 'next/image';

type InputMode = 'upload' | 'url';

interface ImageUploadInputProps {
    value: string;
    onChange: (url: string) => void;
    onBlur?: () => void;
    uploadEndpoint?: string;
    placeholder?: string;
    error?: boolean;
    errorMessage?: string;
    label?: string;
    required?: boolean;
    accept?: string;
}

/**
 * ImageUploadInput - A dual-mode image input component
 * Allows users to either upload a file or provide a URL
 */
export default function ImageUploadInput({
    value,
    onChange,
    onBlur,
    uploadEndpoint = '/api/admin/upload/blog',
    placeholder = 'https://exemple.com/image.jpg',
    error = false,
    errorMessage,
    label = 'Image',
    required = false,
    accept = 'image/*',
}: ImageUploadInputProps) {
    const [mode, setMode] = useState<InputMode>('upload');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file upload
    const handleFileUpload = useCallback(async (file: File) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Veuillez sélectionner une image');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('L\'image est trop volumineuse (max 5MB)');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

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

            onChange(data.url);
        } catch (err: any) {
            setUploadError(err.message || 'Erreur lors de l\'upload');
        } finally {
            setIsUploading(false);
        }
    }, [uploadEndpoint, onChange]);

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
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

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Clear the current image
    const handleClear = () => {
        onChange('');
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const hasValue = value && value.trim() !== '';

    return (
        <div className="space-y-2">
            {/* Label */}
            {label && (
                <label className="block font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-600 ml-1">*</span>}
                </label>
            )}

            {/* Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'upload'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    Upload
                </button>
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'url'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <LinkIcon className="w-4 h-4" />
                    Lien URL
                </button>
            </div>

            {/* Upload Mode */}
            {mode === 'upload' && (
                <div
                    className={`relative border-2 border-dashed rounded-xl transition-all ${dragActive
                            ? 'border-emerald-500 bg-emerald-50'
                            : hasValue
                                ? 'border-emerald-300 bg-emerald-50/50'
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
                        accept={accept}
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    {/* Upload Area */}
                    {!hasValue ? (
                        <div className="p-6">
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                                    <span className="text-sm text-gray-600">Upload en cours...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                                        >
                                            Cliquez pour uploader
                                        </button>
                                        <span className="text-gray-500"> ou glissez-déposez</span>
                                    </div>
                                    <p className="text-xs text-gray-400">PNG, JPG, GIF, WebP jusqu'à 5MB</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Image Preview */
                        <div className="relative">
                            <div className="relative h-48 rounded-lg overflow-hidden m-2">
                                <Image
                                    src={value}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                {/* Success indicator */}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    <Check className="w-3 h-3" />
                                    Image uploadée
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between p-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Changer l'image
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* URL Mode */}
            {mode === 'url' && (
                <div className="space-y-3">
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <LinkIcon className="w-4 h-4" />
                        </div>
                        <input
                            type="url"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${error ? 'border-red-300' : 'border-gray-300'
                                }`}
                        />
                        {hasValue && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* URL Preview */}
                    {hasValue && (
                        <div className="relative h-40 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                                src={value}
                                alt="Preview"
                                fill
                                className="object-cover"
                                unoptimized
                                onError={() => setUploadError('Impossible de charger l\'image')}
                            />
                        </div>
                    )}
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
