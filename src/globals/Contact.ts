import { GlobalConfig } from 'payload'

const Contact: GlobalConfig = {
  slug: 'contact',
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
      name: 'offices',
      type: 'relationship',
      relationTo: 'offices',
      hasMany: true,
    },
  ],
}

export default Contact
