// src/collections/TeamMembers.ts
import type { CollectionConfig, PayloadRequest } from 'payload'

function absoluteFromReq(req: PayloadRequest, path: string): string {
  // 1) Prefer serverURL if configured (recommended)
  const serverURL = req?.payload?.config?.serverURL
  if (serverURL) return new URL(path, serverURL.replace(/\/$/, '') + '/').toString()

  // 2) Fall back to headers (proxy-safe)
  const host = req?.headers?.get('host') || ''
  const protoHeader = req?.headers?.get('x-forwarded-proto') || '' // e.g., "https" or "http,https"
  const proto = protoHeader.split(',')[0]?.trim() || 'https'
  return host ? new URL(path, `${proto}://${host}`).toString() : path
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
      ({ doc, req }) => {
        if (doc?.photo?.url) {
          doc.photoUrl = absoluteFromReq(req, doc.photo.url)
        }
        return doc
      },
    ],
  },
}

export default TeamMembers
