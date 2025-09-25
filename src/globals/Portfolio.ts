import { GlobalConfig } from 'payload'

const Portfolio: GlobalConfig = {
  slug: 'portfolio',
  access: { read: () => true },
  fields: [
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
      name: 'introText',
      type: 'textarea',
    },
    {
      name: 'seoDetails',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'metaKey', type: 'text' },
        {
          name: 'seoStructuredData',
          label: 'Custom JSON-LD',
          type: 'textarea',
          admin: {
            description: 'Paste valid JSON for structured data',
          },
        },
      ],
    },
  ],
}

export default Portfolio
