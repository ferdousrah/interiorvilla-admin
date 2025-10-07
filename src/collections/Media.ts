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
      {
        name: 'thumbnail',
        width: 300,
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'small',
        width: 600,
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'medium',
        width: 900,
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'large',
        width: 1400,
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'xlarge',
        width: 1920,
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'blur',
        width: 20,
        height: 20,
        position: 'centre',
        // ✅ This is the correct way now
        formatOptions: {
          format: 'webp',
        }, // ensures webp output
        withoutEnlargement: true,
      },
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
    afterRead: [
      ({ doc }) => {
        try {
          const base = process.env.PAYLOAD_PUBLIC_SERVER_URL || ''
          if ((doc as any)?.url && (doc as any)?.updatedAt) {
            const u = new URL((doc as any).url as string, base)
            u.searchParams.set('v', String(new Date((doc as any).updatedAt as string).getTime()))
            ;(doc as any).url = u.pathname + u.search
          }
        } catch {
          /* ignore */
        }
        return doc
      },
    ],
  },
}
