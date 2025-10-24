import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const level = formData.get('level') as string;
    const classe = formData.get('classe') as string;
    const contentId = formData.get('contentId') as string;

    if (!file) {
      return NextResponse.json(
        { message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;

    // Créer le chemin de stockage
    // Ex: public/pdfs/college/cours/6eme/
    const classeFolder = classe.replace(/[^a-zA-Z0-9]/g, ''); // Supprimer les accents
    const relativePath = path.join('pdfs', level, type, classeFolder);
    const fullPath = path.join(process.cwd(), 'public', relativePath);

    // Créer les dossiers si ils n'existent pas
    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
    }

    // Chemin complet du fichier
    const filePath = path.join(fullPath, fileName);

    // Écrire le fichier
    await writeFile(filePath, buffer);

    // Chemin public (pour accéder au fichier)
    const publicPath = `/${relativePath}/${fileName}`.replace(/\\/g, '/');

    console.log('[API Upload] File saved:', publicPath);

    return NextResponse.json({
      message: 'Fichier uploadé avec succès',
      publicPath,
    });
  } catch (error: any) {
    console.error('[API Upload] Error:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}
