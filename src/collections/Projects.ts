import { CollectionConfig } from 'payload'
import slugify from 'slugify'

const Projects: CollectionConfig = {
  slug: 'projects',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title', // 👈 this tells Payload to show the title in dropdowns
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: false,
      unique: false,
      admin: {
        readOnly: false, // prevents manual editing in admin panel
      },
    },
    { name: 'category', type: 'relationship', relationTo: 'project-categories' },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'year', type: 'text' },
    { name: 'size', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'client', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'metaKey', type: 'text' },
    {
      name: 'metaStructuredData',
      label: 'Custom JSON-LD',
      type: 'textarea',
      admin: {
        description: 'Paste valid JSON for structured data',
      },
    },
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
      name: 'isResidential',
      label: 'Is Residential?',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar', // optional: keeps it visible in the sidebar
        description: 'Check if this project parent is a residential project',
      },
    },
    {
      name: 'isCommercial',
      label: 'Is Commercial?',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar', // optional: keeps it visible in the sidebar
        description: 'Check if this project parent is a commercial project',
      },
    },
    {
      name: 'isArchitectural',
      label: 'Is Architectural?',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar', // optional: keeps it visible in the sidebar
        description: 'Check if this project parent is a architectural project',
      },
    },
    {
      name: 'position',
      type: 'text',
      admin: {
        description: 'Use for ordering projects on the homepage. Lower numbers appear first.',
        position: 'sidebar',
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title) {
          data.slug = slugify(data.title, { lower: true, strict: true })
        }
        return data
      },
    ],
  },
}

export default Projects
