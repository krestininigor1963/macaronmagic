// sanityClient' устарел.ts(6385) , Используйте именованный export createClient вместо стандартного
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  projectId: 'm7qrkmkb',
  dataset: 'production',
  apiVersion: '2022-11-27',
  useCdn: false,
  //token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)
