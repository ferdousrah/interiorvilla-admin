// src/collections/TeamMembers.ts
import type { CollectionConfig, PayloadRequest } from 'payload'

function baseUrlFromReq(req: PayloadRequest): string {
  // 1) Prefer serverURL from payload config if set
  const cfg = req?.payload?.config
  if (cfg?.serverURL) return cfg.serverURL.replace(/\/$/, '')

  // 2) Fall back to headers (works behind proxies)
  const host = (req?.headers?.host as string) || ''
  const proto =
    ((req?.headers?.['x-forwarded-proto'] as string) || '').split(',')[0].trim() ||
    (req as any).protocol ||
    'https'
  return host ? `${proto}://${host}` : ''
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
    {
      name: 'photoUrl',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        if (doc?.photo?.url) {
          const base = baseUrlFromReq(req)
          doc.photoUrl = `${base}${doc.photo.url}`
        }
        return doc
      },
    ],
  },
}

export default TeamMembers
