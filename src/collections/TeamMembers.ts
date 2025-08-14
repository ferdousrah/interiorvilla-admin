// src/collections/TeamMembers.ts
import type { CollectionConfig, PayloadRequest } from 'payload'

function absoluteFromReq(req: PayloadRequest, relPath: string): string {
  // Prefer serverURL if set (recommended)
  const serverURL = req?.payload?.config?.serverURL?.replace(/\/$/, '')
  if (serverURL) return `${serverURL}${relPath}`

  // Fall back to headers
  const host = req?.headers?.get('host') || ''
  const proto = (req?.headers?.get('x-forwarded-proto') || '').split(',')[0]?.trim() || 'https'
  return host ? `${proto}://${host}${relPath}` : relPath
}

const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: { read: () => true },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'designation', type: 'text' },
    { name: 'licenseNumber', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'photoUrl', type: 'text', admin: { readOnly: true } },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // depth>=1 case: photo is an object
        if (doc?.photo && typeof doc.photo === 'object' && (doc.photo as any).url) {
          doc.photoUrl = absoluteFromReq(req, (doc.photo as any).url)
          return doc
        }
        // depth=0 case: photo is an ID → look up media
        if (doc?.photo && (typeof doc.photo === 'string' || typeof doc.photo === 'number')) {
          try {
            const media = await req.payload.findByID({
              collection: 'media',
              id: doc.photo,
              depth: 0,
            })
            if (media?.url) doc.photoUrl = absoluteFromReq(req, media.url as string)
            // If your adapter doesn’t set .url, you can fallback to filename:
            // else if (media?.filename) doc.photoUrl = absoluteFromReq(req, `/media/${media.filename}`)
          } catch {
            /* ignore */
          }
        }
        return doc
      },
    ],
  },
}

export default TeamMembers
