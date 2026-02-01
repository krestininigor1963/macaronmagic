import React from 'react'
import Link from 'next/link'
import { urlFor } from '../lib/client'

const Product = ({ product: { image, name, slug, price } }) => {
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className='product-card'>
          <figure className='fliptile'>
            <img
              src={urlFor(image && image[0])}
              height={250}
              width={250}
              className='product-image'
              alt={name}
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
  )
}

export default Product
