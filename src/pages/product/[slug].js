import React, { useState } from 'react'
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai'
import { client, urlFor } from '../../lib/client'
import Product from '../../components/Product'
import Info from '../../components/Info'
import { useStateContext } from '../../context/StateContext'
import StarRaiting from '../../components/StarRaiting'

const ProductDetails = ({ product, products }) => {
  const { image, name, details, price, sku, ingredients, weight, delivery } =
    product

  if (!product) {
    return <div className='loading'>Product not found...</div>
  }

  const [index, setIndex] = useState(0)
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext()

  const handleBuyNow = () => {
    onAdd(product, qty)
    setShowCart(true)
  }

  return (
    <div>
      <div className='product-detail-container'>
        <div className='image-container'>
          <img
            src={urlFor(image && image[index])}
            className='product-detail-image'
          />
        </div>
        <div className='small-images-container'>
          {image?.map((item, i) => (
            <img
              key={i}
              src={urlFor(item)}
              className={
                i === index ? 'small-image selected-image' : 'small-image'
              }
              onMouseEnter={() => setIndex(i)}
            />
          ))}
        </div>
        <div className='product-detail-desc'>
          <h1>{name}</h1>
          <div className='reviews'>
            <div>
              <StarRaiting />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className='price'>
            $
            {price.toLocaleString('en-US', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </p>
          per box of 12
          <div className='quantity'>
            <h3>Quantity:</h3>
            <p className='quantity-desc'>
              <span className='minus' onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className='num'>{qty}</span>
              <span className='plus' onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className='sku'>SKU: {sku}</div>
          <div className='buttons'>
            <button
              type='button'
              className='add-to-cart'
              onClick={() => onAdd(product, qty)}
            >
              Add to Cart
            </button>

            <button
              className='button btn-cart'
              type='button'
              onClick={() => onAdd(product, qty)}
            >
              <span>
                <span>Add to My Bag</span>
              </span>
            </button>

            <button type='button' className='buy-now' onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <Info ingredients={ingredients} weight={weight} delivery={delivery} />
      <div className='maylike-products-wrapper'>
        <h2>You may also like</h2>
        <div className='marquee'>
          <div className='maylike-products-container track'>
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// на этот раз используя идентификатор продукта (slug), и получаем статические URL-адреса для каждой страницы продукта:
export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `
  const products = await client.fetch(query)

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

// Эта функция — это "грузчик данных". Она гарантирует, что когда пользователь открывает страницу конкретного товара,
// все данные об этом товаре (и других похожих товарах) уже загружены и готовы к отображению.
export const getStaticProps = async ({ params: { slug } }) => {
  // Use $slug variable instead of string interpolation
  const query = `*[_type == "product" && slug.current == $slug][0]`
  const productsQuery = '*[_type == "product"]'

  const product = await client.fetch(query, { slug }) // Pass slug as parameter
  const products = await client.fetch(productsQuery)

  return {
    props: { products, product },
    revalidate: 10, // Recommended: refresh data every 10 seconds
  }
}

// В вашем запросе используется строковая интерполяция ( '${slug}'), которая небезопасна и может дать сбой при обработке специальных символов. Используйте вместо этого параметры .
// export const getStaticProps = async ({ params: { slug } }) => {
//   const query = `*[_type == "product" && slug.current == '${slug}'][0]`
//   const productsQuery = '*[_type == "product"]'

//   const product = await client.fetch(query)
//   const products = await client.fetch(productsQuery)

//   return {
//     props: { products, product },
//   }
// }

export default ProductDetails
