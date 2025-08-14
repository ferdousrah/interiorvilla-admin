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
  ],
}

export default Portfolio
