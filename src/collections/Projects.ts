import { CollectionConfig } from 'payload';

const Projects: CollectionConfig = {
  slug: 'projects',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'category', type: 'relationship', relationTo: 'project-categories' },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    {
      name: 'beforeAfterImages',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'details', type: 'richText' },
    {
      name: 'gallery',
      type: 'group',
      fields: [
        { name: 'photos', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
        { name: 'videos', type: 'array', fields: [{ name: 'videoUrl', type: 'text' }] },
        { name: 'plans', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
      ],
    },
  ],
};

export default Projects;
