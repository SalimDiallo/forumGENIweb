import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Route API pour revalider le cache de la galerie
 *
 * Utilisation:
 * POST /api/revalidate/gallery
 * Headers: { "x-revalidate-token": "votre_token_secret" }
 * Body (optionnel): { "tag": "gallery-structure" | "gallery-media" }
 *
 * Si aucun tag n'est spécifié, tous les tags de la galerie seront revalidés
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier le token de sécurité
    const token = request.headers.get('x-revalidate-token');
    const validToken = process.env.REVALIDATE_TOKEN;

    if (!validToken) {
      return NextResponse.json(
        { error: 'REVALIDATE_TOKEN not configured' },
        { status: 500 }
      );
    }

    if (token !== validToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Récupérer le tag à revalider depuis le body (optionnel)
    let tag: string | null = null;
    try {
      const body = await request.json();
      tag = body.tag || null;
    } catch {
      // Body vide ou invalide, on revalide tout
    }

    // Revalider les tags appropriés
    if (tag) {
      revalidateTag(tag);
      console.log(`[Revalidate] Tag revalidé: ${tag}`);

      return NextResponse.json({
        success: true,
        message: `Tag '${tag}' revalidated successfully`,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Revalider tous les tags de la galerie
      revalidateTag('gallery');
      revalidateTag('gallery-structure');
      revalidateTag('gallery-media');
      console.log('[Revalidate] Tous les tags de la galerie revalidés');

      return NextResponse.json({
        success: true,
        message: 'All gallery tags revalidated successfully',
        tags: ['gallery', 'gallery-structure', 'gallery-media'],
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error revalidating gallery cache:', error);

    return NextResponse.json(
      {
        error: 'Failed to revalidate cache',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler pour vérifier l'état de l'API
 */
export async function GET() {
  return NextResponse.json({
    message: 'Gallery revalidation API',
    usage: 'POST /api/revalidate/gallery with x-revalidate-token header',
    configuredToken: !!process.env.REVALIDATE_TOKEN,
  });
}
