import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function saveFile(file: File, subdir: string = ''): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', subdir);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filepath = join(uploadDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return public URL path
    return `/uploads/${subdir ? subdir + '/' : ''}${filename}`;
}
