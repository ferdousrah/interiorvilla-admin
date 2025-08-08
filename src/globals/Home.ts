import { GlobalConfig } from 'payload'

const Home: GlobalConfig = {
  slug: 'home',
  fields: [
    {
      name: 'featuredWorks',
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
        { name: 'backgroundColor', type: 'text' },
      ],
    },
    {
      name: 'aboutSection',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text' },
        { name: 'shortDescription', type: 'textarea' },
        {
          name: 'beforeAfterImages',
          type: 'array',
          fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],
        },
        {
          name: 'highlights',
          type: 'array',
          fields: [{ name: 'text', type: 'text' }],
        },
        { name: 'backgroundColor', type: 'text' },
      ],
    },
    {
      name: 'servicesSection',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text' },
        { name: 'shortDescription', type: 'textarea' },
        {
          name: 'services',
          type: 'relationship',
          relationTo: 'services',
          hasMany: true,
        },
        { name: 'backgroundColor', type: 'text' },
      ],
    },
    {
      name: 'ourProcess',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text' },
        { name: 'shortDescription', type: 'textarea' },
        {
          name: 'steps',
          type: 'array',
          fields: [
            { name: 'icon', type: 'upload', relationTo: 'media' },
            { name: 'title', type: 'text' },
          ],
        },
        { name: 'backgroundColor', type: 'text' },
      ],
    },
    {
      name: 'clientStories',
      type: 'group',
      fields: [
        { name: 'sectionTitle', type: 'text' },
        { name: 'shortDescription', type: 'textarea' },
        {
          name: 'testimonials',
          type: 'relationship',
          relationTo: 'testimonials',
          hasMany: true,
        },
        { name: 'backgroundColor', type: 'text' },
      ],
    },
  ],
}

export default Home
