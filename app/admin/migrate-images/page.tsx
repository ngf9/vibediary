'use client';

import { useState } from 'react';
import { db } from '@/lib/instant';

interface Change {
  entity: string;
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export default function MigrateImagesPage() {
  const [changes, setChanges] = useState<Change[]>([]);
  const [scanning, setScanning] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scan = async () => {
    setScanning(true);
    setError(null);
    setChanges([]);

    try {
      // 1. Build URL-to-path lookup from $files
      const filesResult = await db.queryOnce({ $files: {} });
      const files = filesResult.data.$files || [];

      const urlToPath: Record<string, string> = {};
      for (const file of files) {
        if (file.url && file.path) {
          urlToPath[file.url] = file.path;
        }
      }

      const pending: Change[] = [];

      // Helper: check if a value is an InstantDB storage URL
      const isStorageUrl = (val: string) =>
        typeof val === 'string' && val.includes('instant-storage');

      // Helper: find path for a storage URL
      const findPath = (url: string): string | null => {
        if (urlToPath[url]) return urlToPath[url];
        // URLs may differ in query params; try matching by pathname
        for (const [fileUrl, filePath] of Object.entries(urlToPath)) {
          try {
            const a = new URL(fileUrl);
            const b = new URL(url);
            if (a.pathname === b.pathname) return filePath;
          } catch {
            continue;
          }
        }
        return null;
      };

      // 2. Scan essays
      const essaysResult = await db.queryOnce({ essays: {} });
      for (const essay of essaysResult.data.essays || []) {
        for (const field of ['thumbnail', 'heroImage', 'coverImage']) {
          const val = (essay as any)[field];
          if (isStorageUrl(val)) {
            const path = findPath(val);
            if (path) {
              pending.push({
                entity: 'essays',
                id: essay.id,
                field,
                oldValue: val,
                newValue: path,
              });
            }
          }
        }

        // Scan markdown content for storage URLs
        if (essay.content && typeof essay.content === 'string') {
          const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
          let match;
          let newContent = essay.content;
          let contentChanged = false;

          while ((match = regex.exec(essay.content)) !== null) {
            const imgUrl = match[2];
            if (isStorageUrl(imgUrl)) {
              const path = findPath(imgUrl);
              if (path) {
                newContent = newContent.replace(imgUrl, path);
                contentChanged = true;
              }
            }
          }

          if (contentChanged) {
            pending.push({
              entity: 'essays',
              id: essay.id,
              field: 'content',
              oldValue: `(markdown with ${(essay.content.match(/instant-storage/g) || []).length} storage URLs)`,
              newValue: `(markdown with storage paths)`,
            });
            // Store the actual new content in a hidden way
            (pending[pending.length - 1] as any)._newContent = newContent;
          }
        }
      }

      // 3. Scan projects
      const projectsResult = await db.queryOnce({ projects: {} });
      for (const project of projectsResult.data.projects || []) {
        for (const field of ['thumbnail', 'coverImage']) {
          const val = (project as any)[field];
          if (isStorageUrl(val)) {
            const path = findPath(val);
            if (path) {
              pending.push({
                entity: 'projects',
                id: project.id,
                field,
                oldValue: val,
                newValue: path,
              });
            }
          }
        }
      }

      // 4. Scan projectContent
      const pcResult = await db.queryOnce({ projectContent: {} });
      for (const pc of pcResult.data.projectContent || []) {
        if (Array.isArray(pc.gallery)) {
          const newGallery = pc.gallery.map((url: string) => {
            if (isStorageUrl(url)) {
              const path = findPath(url);
              return path || url;
            }
            return url;
          });
          const hasChanges = newGallery.some((v: string, i: number) => v !== pc.gallery[i]);
          if (hasChanges) {
            pending.push({
              entity: 'projectContent',
              id: pc.id,
              field: 'gallery',
              oldValue: `[${pc.gallery.length} URLs]`,
              newValue: `[${newGallery.length} paths]`,
            });
            (pending[pending.length - 1] as any)._newGallery = newGallery;
          }
        }
      }

      // 5. Scan aboutContent
      const aboutResult = await db.queryOnce({ aboutContent: {} });
      for (const about of aboutResult.data.aboutContent || []) {
        for (const field of ['profileImage', 'timelineImage']) {
          const val = (about as any)[field];
          if (isStorageUrl(val)) {
            const path = findPath(val);
            if (path) {
              pending.push({
                entity: 'aboutContent',
                id: about.id,
                field,
                oldValue: val,
                newValue: path,
              });
            }
          }
        }
      }

      setChanges(pending);
    } catch (err: any) {
      setError(err.message || 'Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const migrate = async () => {
    setMigrating(true);
    setError(null);

    try {
      const txs: any[] = [];

      for (const change of changes) {
        const entityTx = (db.tx as any)[change.entity];
        if (!entityTx) continue;

        if (change.field === 'content' && (change as any)._newContent) {
          txs.push(entityTx[change.id].update({ content: (change as any)._newContent }));
        } else if (change.field === 'gallery' && (change as any)._newGallery) {
          txs.push(entityTx[change.id].update({ gallery: (change as any)._newGallery }));
        } else {
          txs.push(entityTx[change.id].update({ [change.field]: change.newValue }));
        }
      }

      if (txs.length > 0) {
        await db.transact(txs);
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">Migrate Image URLs to Paths</h1>
      <p className="text-gray-600 mb-6">
        This tool scans all entities for InstantDB Storage URLs (which expire) and replaces them
        with stable file paths. Images are resolved to fresh URLs at query time on the server.
      </p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Safe operation:</strong> No images are deleted. No $files records are modified.
          Only entity fields (thumbnail, coverImage, content, etc.) are updated from URLs to paths.
        </p>
      </div>

      {!done && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={scan}
            disabled={scanning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Scan for Expiring URLs'}
          </button>

          {changes.length > 0 && (
            <button
              onClick={migrate}
              disabled={migrating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {migrating ? 'Migrating...' : `Apply ${changes.length} Changes`}
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {done && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700">
            Migration complete! {changes.length} field(s) updated from URLs to stable paths.
          </p>
        </div>
      )}

      {changes.length > 0 && !done && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Pending Changes ({changes.length})</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Entity</th>
                  <th className="text-left p-3 font-medium">Field</th>
                  <th className="text-left p-3 font-medium">Old (URL)</th>
                  <th className="text-left p-3 font-medium">New (Path)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {changes.map((change, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-xs">{change.entity}</td>
                    <td className="p-3 font-mono text-xs">{change.field}</td>
                    <td className="p-3 text-xs text-red-600 max-w-xs truncate" title={change.oldValue}>
                      {change.oldValue.length > 60
                        ? change.oldValue.slice(0, 60) + '...'
                        : change.oldValue}
                    </td>
                    <td className="p-3 text-xs text-green-600 max-w-xs truncate" title={change.newValue}>
                      {change.newValue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {changes.length === 0 && !scanning && !done && (
        <p className="text-gray-500 text-sm">
          Click &ldquo;Scan&rdquo; to check for expiring storage URLs in your data.
        </p>
      )}
    </div>
  );
}
