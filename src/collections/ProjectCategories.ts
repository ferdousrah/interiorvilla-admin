import { CollectionConfig } from 'payload';

const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  admin: {
    useAsTitle: 'title', // 👈 this tells Payload to show the title in dropdowns
  },
  fields: [
    { name: 'title', type: 'text', required: true },
  ],
};

export default ProjectCategories;
