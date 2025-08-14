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
  ],
}

export default TeamMembers
