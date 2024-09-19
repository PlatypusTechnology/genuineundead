import type { Rule, SchemaTypeDefinition } from 'sanity';
const tokenSchema = {
  type: "document",
  name: "token",
  title: "Tokens",
  fields: [
    {
      name: 'name',
      type: 'string',
      title: "Token Title",
      validation: (r : Rule) => r.required()
    },
    {
      name: "tokenId",
      title: "Token ID",
      type: "number",
      validation: (r : Rule) => r.required()
    }, 
    {
      name: "tokenImage",
      title: "Token Image",
      type: "image",
      validation: (r : Rule) => r.required()
    },
    {
      name: 'attributes',
      title: 'Attributes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'trait_type',
              type: 'string',
              title: 'Trait Name',
            },
            {
              name: 'value',
              type: 'string',
              title: 'value',
            },
            {
              name: 'display_type',
              title: "Display",
              type: 'string',
              options: {
                list: [
                  { title: 'Boost Number', value: 'boost_number' },
                  { title: 'Boost Percentage (%)', value: 'boost_percentage' },
                  { title: 'String', value: 'string' },
                  { title: 'Number', value: 'number' },
                  { title: 'Date', value: 'date' },
                  // Add more options as needed
                ]
              }
            }
          ]
        }

      ]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
    }
  ]
}
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Token metadata
    tokenSchema,
    // Comic metadata
    {
      type: 'document',
      name: "comic",
      title: "Comics",
      fields: [
        {
          type: 'string',
          name: 'name',
          title: 'name',
        },
        {
          type: 'slug',
          name: 'slug',
          title: 'Slug',
          options: {
            source: 'name'
          }
        },
        {
          type: 'string',
          name: 'description',
          title: 'Description'
        },
        { type: 'date',
          name: 'releaseDate',
          title: 'Release Date',
      },
        {
          type: 'array',
          name: 'pages',
          title: 'Pages',
          of: [{
            type: 'image',
            fields: [ {
                type: 'boolean',
                name: 'gated',
                initialValue: false,
              }, {
                type: 'array',
                name: 'tokens',
                hidden: (context) => !context.parent.gated,
                of: [{
                  type: 'reference',
                  to: [tokenSchema] // Replace 'tokenDocument' with the actual type of token document
                }]
              }
            ],
            preview: {
              select: {
                imageUrl: 'asset.url',
                title: 'asset.originalFilename',
                gated: 'gated'
  
              },
              prepare({title, imageUrl, gated}) {

                return {
                  title : title.replace('.jpg', '').replace('.jpeg', ''),
                  subtitle:  gated ? 'Gated':'Not Gated',
                   imageUrl,
                };
              },
            },
          }]
        }
      ]
    },
    // User structure
    {
      type: 'document',
      name: "user",
      title: "Users",
      fields: [
        {
          name: 'address',
          title: 'Wallet Address',
          type: 'string',
          readOnly: true
        }, {
          name: 'firstLogin',
          title: 'First Login',
          type: 'date',
          readOnly: true
        }, {
          name: 'lastLogin',
          title: 'Last Login',
          type: 'date',
          readOnly: true
        }, {
          name: 'username',
          title: 'Username',
          type: 'string',
        },
        {
          name: 'discordId',
          title: 'Discord ID',
          type: 'string',
        },
        {
          name: 'twitterId',
          title: 'Twitter Handle',
          type: 'string',
        },
        {
          name: 'email',
          title: 'email',
          type: 'email',
        },
        {
          name: 'metadata',
          title: 'Metadata',
          type: 'object',
          fields: [ // fields must be defined, and it must be an array
            {
              name: 'lockData', // field name is required and must be unique
              type: 'object', // field type is required
              fields: [
                {
                  name: 'lockId',
                  type:"number"
                }
              ]
            }
          ]
        }
      ]
    },
  ],
}
