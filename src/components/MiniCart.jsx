import React from 'react'
import { AiOutlineShopping } from 'react-icons/ai'
import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
// import getStripe from '../lib/getStripe'
import { eUSLocale } from '../lib/utils'
import EmptyCart from './Cart/EmptyCart'
import Link from 'next/link'
import getStripe from '../lib/getStripe'
import toast from 'react-hot-toast'

const MiniCart = () => {
  const { totalPrice, totalQuantities, cartItems } = useStateContext()

  const handleCheckout = async () => {
    // You no longer need to await getStripe() here.
    // const stripe = await getStripe()

    toast.loading('Preparing checkout session...')

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    })

    if (response.status === 500) {
      toast.error('A server error occurred.')
      return
    }

    const data = await response.json()

    // Provide user feedback that the page is changing
    toast.loading('Redirecting to Stripe...')

    // --- FIX: Use the 'url' property provided by your API ---
    if (data.url) {
      window.location.assign(data.url)
    } else {
      toast.error('Failed to get a valid checkout URL from the server.')
    }
  }

  return (
    <div className='mini-cart-container'>
      {/* отобразить сообщение и изображение по умолчанию, если корзина пуста: */}
      <span className='heading'>
        Your Cart contains {totalQuantities} item
        {totalQuantities > 1 || totalQuantities === 0 ? 's' : ''}
      </span>

      {cartItems.length < 1 && (
        <EmptyCart>
          <Link href='/shop'>
            <button type='button' className='btn'>
              Go to Shop
            </button>
          </Link>
        </EmptyCart>
      )}

      {/* Для каждого добавляемого товара необходимо отображать его подробную информацию */}
      <div className='product-container'>
        {cartItems.length >= 1 &&
          cartItems.map((item) => (
            <div className='product' key={item._id}>
              <span>
                <img src={urlFor(item?.image[0])} className='mini-cart-image' />
              </span>
              <span className='item-desc'>
                <span>{item.name}</span>
                <span className='totals'>
                  <span>{item.quantity}</span>
                  <span className='multiply'>x</span>
                  <span>${eUSLocale(item.price)}</span>
                </span>
              </span>
            </div>
          ))}
      </div>
      {/* отобразить промежуточный итог, округлённый до двух знаков после запятой. */}
      {cartItems.length >= 1 && (
        <div className='mini-cart-bottom'>
          <div className='total'>
            <h3>${eUSLocale(totalPrice)}</h3>
          </div>
          <div>
            <button type='button' className='btn' onClick={handleCheckout}>
              Pay with Stripe
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MiniCart
