export default {
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Slide Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls sequence position (e.g. 1, 2, 3...)',
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'altText',
      title: 'Alt Text / Caption',
      type: 'string',
      description: 'Short caption or descriptive alt text for accessibility',
    },
  ],
  orderings: [
    {
      title: 'Order, Asc',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'altText',
      subtitle: 'order',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Hero Slide',
        subtitle: `Order: ${subtitle ?? 'N/A'}`,
        media,
      }
    },
  },
}
