import { CollectionConfig } from 'payload'

const Slider: CollectionConfig = {
  slug: 'slider',
  access: { read: () => true },
  fields: [
    {
      name: 'slider',
      type: 'group',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'textarea' },
        { name: 'position', type: 'text' },
      ],
    },
  ],
}

export default Slider
