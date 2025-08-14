import { CollectionConfig } from 'payload'

const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: { read: () => true },
  admin: {
    useAsTitle: 'name',
  },
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
        if (doc.photo?.url) {
          // Absolute URL
          doc.photoUrl = `${req.protocol}://${req.get('host')}${doc.photo.url}`
        }
        return doc
      },
    ],
  },
}

export default TeamMembers
