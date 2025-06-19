import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Es MUY IMPORTANTE que configures esta variable de entorno en tu hosting.
// Debería ser un string aleatorio y seguro.
const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

export async function POST(request: NextRequest) {
  
  console.log("API REVALIDATEEEE")
  const body = await request.json();
  const secretFromBody = body.secret;
  console.log("REVALIDANDO")
  if (!REVALIDATE_TOKEN) {
    console.error('REVALIDATE_TOKEN no está configurado en las variables de entorno.');
    return NextResponse.json({ message: 'Token de revalidación no configurado en el servidor.' }, { status: 500 });
  }

  if (!secretFromBody) {
    return NextResponse.json({ message: 'Propiedad "secret" faltante en el cuerpo de la solicitud.' }, { status: 400 });
  }

  if (secretFromBody !== REVALIDATE_TOKEN) {
    return NextResponse.json({ message: 'Token de revalidación inválido.' }, { status: 401 });
  }

  console.log("REVALIDANDON")
  const pathsToRevalidate: string[] | undefined = body.paths;
  const tagsToRevalidate: string[] | undefined = body.tags;

  let revalidatedPaths: string[] = [];
  let revalidatedTags: string[] = [];
  let errors: { item: string, type: 'path' | 'tag', error: string }[] = [];

  if (!pathsToRevalidate && !tagsToRevalidate) {
    return NextResponse.json({
      message: 'Se requiere "pathsToRevalidate" (array de strings) o "tagsToRevalidate" (array de strings) en el cuerpo de la solicitud.'
    }, { status: 400 });
  }

  if (pathsToRevalidate && !Array.isArray(pathsToRevalidate)) {
    return NextResponse.json({ message: '"pathsToRevalidate" debe ser un array de strings.' }, { status: 400 });
  }

  if (tagsToRevalidate && !Array.isArray(tagsToRevalidate)) {
    return NextResponse.json({ message: '"tagsToRevalidate" debe ser un array de strings.' }, { status: 400 });
  }

  if (pathsToRevalidate && pathsToRevalidate.length > 0) {
    for (const path of pathsToRevalidate) {
      if (typeof path === 'string') {
        try {
          // Si el path es 'home', revalidamos la ruta raíz '/'.
          const actualPath = path === 'home' ? '/' : path;
          revalidatePath(actualPath);
          revalidatedPaths.push(actualPath);
        } catch (err: any) {
          console.error(`Error revalidating path ${path}:`, err);
          errors.push({ item: path, type: 'path', error: err.message });
        }
      } else {
        errors.push({ item: String(path), type: 'path', error: 'Path inválido, debe ser un string.' });
      }
    }
  }

  if (tagsToRevalidate && tagsToRevalidate.length > 0) {
    for (const tag of tagsToRevalidate) {
      if (typeof tag === 'string') {
        try {
          revalidateTag(tag);
          revalidatedTags.push(tag);
        } catch (err: any) {
          console.error(`Error revalidating tag ${tag}:`, err);
          errors.push({ item: tag, type: 'tag', error: err.message });
        }
      } else {
        errors.push({ item: String(tag), type: 'tag', error: 'Tag inválido, debe ser un string.' });
      }
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({
      message: 'Algunas revalidaciones fallaron.',
      revalidatedPaths,
      revalidatedTags,
      errors,
      now: Date.now()
    }, { status: 207 }); // Multi-Status
  }

  if (revalidatedPaths.length === 0 && revalidatedTags.length === 0) {
    return NextResponse.json({ message: 'No se proporcionaron paths o tags válidos para revalidar.', now: Date.now() }, { status: 400 });
  }

  return NextResponse.json({
    revalidated: true,
    revalidatedPaths,
    revalidatedTags,
    now: Date.now()
  });
} 