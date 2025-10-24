import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function DELETE(request: NextRequest) {
  try {
    const { publicPath } = await request.json();

    if (!publicPath) {
      return NextResponse.json(
        { message: 'Chemin du fichier manquant' },
        { status: 400 }
      );
    }

    // Construire le chemin complet
    // publicPath est comme: /pdfs/college/cours/6eme/123_file.pdf
    const fullPath = path.join(process.cwd(), 'public', publicPath);

    // Vérifier si le fichier existe
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { message: 'Fichier introuvable' },
        { status: 404 }
      );
    }

    // Supprimer le fichier
    await unlink(fullPath);

    console.log('[API Delete] File deleted:', publicPath);

    return NextResponse.json({
      message: 'Fichier supprimé avec succès',
    });
  } catch (error: any) {
    console.error('[API Delete] Error:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
