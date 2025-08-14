import type { CollectionConfig, PayloadRequest } from 'payload'

interface ProtocolRequest extends PayloadRequest {
  protocol?: string
}

function baseUrlFromReq(req: ProtocolRequest): string {
  // 1) Prefer serverURL from payload config if set
  const cfg = req?.payload?.config
  if (cfg?.serverURL) return cfg.serverURL.replace(/\/$/, '')

  // 2) Fall back to request headers
  const host = req?.headers?.get('host') || ''
  const protoHeader = req?.headers?.get('x-forwarded-proto') || ''
  const proto = protoHeader.split(',')[0]?.trim() || req.protocol || 'https'

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
    { name: 'photoUrl', type: 'text', admin: { readOnly: true } },
  ],
  hooks: {
    afterRead: [
      ({ doc, req }) => {
        if (doc?.photo?.url) {
          const base = baseUrlFromReq(req as ProtocolRequest)
          doc.photoUrl = `${base}${doc.photo.url}`
        }
        return doc
      },
    ],
  },
}

export default TeamMembers
