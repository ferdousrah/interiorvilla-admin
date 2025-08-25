import type { CollectionConfig } from 'payload'
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import path from 'path'
import fs from 'fs/promises'
import sharp from 'sharp'

// If your uploads live elsewhere, change this:
const UPLOAD_DIR = path.join(process.cwd(), 'media') // ← adjust if needed
const PUBLIC_URL_PREFIX = '/media' // Payload serves uploads here

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 300, withoutEnlargement: true },
      {
        name: 'square',
        width: 500,
        height: 500,
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
      },
      { name: 'small', width: 600, withoutEnlargement: true },
      { name: 'medium', width: 900, withoutEnlargement: true },
      { name: 'large', width: 1400, withoutEnlargement: true },
      { name: 'xlarge', width: 1920, withoutEnlargement: true },
      {
        name: 'og',
        width: 1200,
        height: 630,
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
      },
    ],
  },

  //upload: true, // keep simple, rely on project defaults
  // 👇 Access rules
  access: {
    // Anyone (no login) can read media + hit file endpoints
    read: () => true,

    // Only logged-in users can create/update/delete
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      localized: false,
      admin: { description: 'Short, descriptive alt text for accessibility & SEO' },
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      required: false,
    },
  ],

  hooks: {
    // Generate/refresh WebP whenever the original changes
    afterChange: [
      async ({ req, doc /*, operation*/ }) => {
        try {
          const mime: string = (doc as any)?.mimeType ?? ''
          if (!mime.startsWith('image/')) return doc

          const filename: string | undefined = (doc as any)?.filename
          if (!filename) return doc

          const originalAbs = path.join(UPLOAD_DIR, filename)
          const webpFilename = filename.replace(/\.[^.]+$/, '') + '.webp'
          const webpAbs = path.join(UPLOAD_DIR, webpFilename)

          // Create WebP alongside original
          const img = sharp(originalAbs)
          const meta = await img.metadata()
          await img.toFormat('webp', { quality: 82 }).toFile(webpAbs)
          await fs.access(webpAbs)

          const sizes = (doc as any).sizes || {}
          sizes.webp = {
            filename: webpFilename,
            url: `${PUBLIC_URL_PREFIX}/${webpFilename}`,
            width: meta.width ?? undefined,
            height: meta.height ?? undefined,
            mimeType: 'image/webp',
          }

          const updated = await req.payload.update({
            collection: 'media',
            id: (doc as any).id,
            data: { sizes },
            overrideAccess: true,
            depth: 0,
            draft: false,
            // @ts-expect-error – supported at runtime to avoid loop
            disableHooks: true,
          })

          return updated
        } catch (e) {
          req.payload.logger?.warn?.(`WebP hook skipped: ${(e as Error).message}`)
          return doc
        }
      },
    ],

    // Add ?v=updatedAt and expose webpUrl (relative) for easy use via your Nginx proxy
    afterRead: [
      ({ doc }) => {
        try {
          const base = process.env.PAYLOAD_PUBLIC_SERVER_URL || ''
          if ((doc as any)?.url && (doc as any)?.updatedAt) {
            const u = new URL((doc as any).url as string, base)
            u.searchParams.set('v', String(new Date((doc as any).updatedAt as string).getTime()))
            ;(doc as any).url = u.pathname + u.search // keep relative
          }

          const sizes = (doc as any)?.sizes
          const wurl: string | undefined = sizes?.webp?.url
          if (wurl) {
            const baseUrl = new URL((doc as any).url, base)
            const v = baseUrl.searchParams.get('v') || undefined
            const wu = new URL(wurl, base)
            if (v) wu.searchParams.set('v', v)
            ;(doc as any).webpUrl = wu.pathname + wu.search
          }
        } catch {
          /* ignore */
        }
        return doc
      },
    ],
  },
}
