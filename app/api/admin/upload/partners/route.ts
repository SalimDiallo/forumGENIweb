import { NextRequest, NextResponse } from 'next/server';
import { requireWritePermission } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

// Valid image extensions
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for logos
const MAX_WIDTH = 400;
const MAX_HEIGHT = 400;
const QUALITY = 85;

export async function POST(req: NextRequest) {
    try {
        // Check authentication and permissions
        await requireWritePermission();

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'Aucun fichier fourni' },
                { status: 400 }
            );
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'Le fichier est trop volumineux (max 5MB)' },
                { status: 400 }
            );
        }

        // Check file extension
        const originalName = file.name;
        const ext = path.extname(originalName).toLowerCase();

        if (!VALID_EXTENSIONS.includes(ext)) {
            return NextResponse.json(
                { error: `Extension non valide. Extensions acceptées: ${VALID_EXTENSIONS.join(', ')}` },
                { status: 400 }
            );
        }

        // Generate unique filename - keep PNG for logos to preserve transparency
        const uniqueId = crypto.randomUUID();
        const outputExt = ext === '.svg' || ext === '.gif' || ext === '.png' ? ext : '.webp';
        const filename = `${uniqueId}${outputExt}`;

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'partners');
        await mkdir(uploadDir, { recursive: true });

        // Process and compress image
        const filePath = path.join(uploadDir, filename);
        const bytes = await file.arrayBuffer();
        const inputBuffer = Buffer.from(bytes);

        // Skip compression for SVG and GIF
        if (ext === '.svg' || ext === '.gif') {
            await writeFile(filePath, inputBuffer);
        } else if (ext === '.png') {
            // Compress PNG while preserving transparency
            await sharp(inputBuffer)
                .resize(MAX_WIDTH, MAX_HEIGHT, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .png({ quality: QUALITY, compressionLevel: 9 })
                .toFile(filePath);
        } else {
            // Compress and resize with sharp
            await sharp(inputBuffer)
                .resize(MAX_WIDTH, MAX_HEIGHT, {
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .webp({ quality: QUALITY })
                .toFile(filePath);
        }

        // Return the public URL
        const url = `/uploads/partners/${filename}`;

        return NextResponse.json({
            success: true,
            url,
            filename,
        });
    } catch (error: any) {
        console.error('Upload error:', error);

        if (error?.name === 'AuthError') {
            return NextResponse.json(
                { error: error.message || 'Non autorisé' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Erreur lors de l\'upload du fichier' },
            { status: 500 }
        );
    }
}
