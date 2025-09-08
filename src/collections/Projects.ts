import { CollectionConfig } from 'payload'

const Projects: CollectionConfig = {
  slug: 'projects',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title', // 👈 this tells Payload to show the title in dropdowns
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'relationship', relationTo: 'project-categories' },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'year', type: 'text' },
    { name: 'size', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'client', type: 'text' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    // 👇 New field: Featured on Home
    {
      name: 'featuredOnHome',
      label: 'Featured on Home',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar', // optional: keeps it visible in the sidebar
        description: 'Check if this project should appear on the homepage',
      },
    },
    {
      name: 'beforeAfterImages',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
    },
    { name: 'details', type: 'richText' },
    {
      name: 'gallery',
      type: 'group',
      fields: [
        {
          name: 'photos',
          type: 'array',
          fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
        },
        { name: 'videos', type: 'array', fields: [{ name: 'videoUrl', type: 'text' }] },
        {
          name: 'plans',
          type: 'array',
          fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
        },
      ],
    },
  ],
}

export default Projects
