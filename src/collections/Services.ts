import { CollectionConfig } from 'payload'

const Services: CollectionConfig = {
  slug: 'services',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL slug (e.g., residential-interior)',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
    },
    {
      name: 'introVideo',
      type: 'text',
      admin: {
        description: 'Optional video link or embed code',
      },
    },
    {
      name: 'ColorCode',
      type: 'text',
      required: true,
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heroImage', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'textarea' },
      ],
    },
    {
      name: 'introSection',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'ourApproach',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'approaches',
          type: 'array',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'recentProjects',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text' },
        { name: 'sectionDescription', type: 'textarea' },
        {
          name: 'projects',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
        },
      ],
    },
  ],
}

export default Services
