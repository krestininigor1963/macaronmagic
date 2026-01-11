import React from 'react'
import Link from 'next/link'
import { urlFor } from '../lib/client'
import { useRouter } from 'next/router'
//import { NextSeo } from 'next-seo'
import Head from 'next/head'
import { generateNextSeo } from 'next-seo/pages'

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const Product = ({ product: { image, name, slug, price } }) => {
  const { asPath } = useRouter()
  let seoProductSlug = asPath.split('/')[2]
  let seoProductName = ''
  if (seoProductSlug != null) {
    seoProductName = seoProductSlug.replace('-', ' ')
    if (seoProductSlug === slug.current) {
      seoProductName = toTitleCase(seoProductSlug.replace('-', ' '))
    }
  }
  return (
    <>
      <Head>
        {generateNextSeo({
          title: `${toTitleCase(seoProductName)} - Macaron Magic`,
          description: 'Great tasting home-made macarons',
        })}
      </Head>

      <div>
        <Link href={`/product/${slug.current}`}>
          <div className='product-card'>
            <figure className='fliptile'>
              <img
                src={urlFor(image && image[0])}
                height={250}
                width={250}
                className='product-image'
              />
              <figcaption>
                <p className='product-name'>{name}</p>
              </figcaption>
            </figure>
            <p className='product-name'>{name}</p>
            <p className='product-price'>
              $
              {price.toLocaleString('en-US', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </Link>
      </div>
    </>
  )
}

export default Product
