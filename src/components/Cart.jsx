import React, { useRef } from 'react'
import Link from 'next/link'
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from 'react-icons/ai'
import { TiDeleteOutline } from 'react-icons/ti'
import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
import toast from 'react-hot-toast'
import EmptyCart from './Cart/EmptyCart'
import { eUSLocale } from '../lib/utils'
import getStripe from '../lib/getStripe'

const Cart = () => {
  const cartRef = useRef()
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext()

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
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
          type='button'
          className='cart-heading'
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className='heading'>Your Cart</span>
          <span className='cart-num-items'>({totalQuantities} items)</span>
        </button>
        {/* Следующий блок отвечает за отображение соответствующего уведомления, если корзина пуста: */}
        {cartItems.length < 1 && (
          <EmptyCart>
            <Link href='/'>
              <button
                type='button'
                onClick={() => setShowCart(false)}
                className='btn'
              >
                Continue Shopping
              </button>
            </Link>
          </EmptyCart>
        )}
        {/* Первая половина следующего, довольно длинного блока посвящена отображению выбранных товаров в корзине вместе с миниатюрой: */}
        <div className='product-container'>
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className='product' key={item._id}>
                <button
                  type='button'
                  className='remove-item'
                  onClick={() => onRemove(item)}
                >
                  <TiDeleteOutline />
                </button>
                <img
                  src={urlFor(item?.image[0])}
                  className='cart-product-image'
                />
                <div className='item-desc'>
                  <div>
                    <span>{item.name}</span>
                    <span>
                      {item.quantity} @ ${eUSLocale(item.price)}
                    </span>
                  </div>
                  <p className='quantity-desc'>
                    <span
                      className='minus'
                      onClick={() => toggleCartItemQuantity(item._id, 'dec')}
                    >
                      <AiOutlineMinus />
                    </span>
                    <span
                      className='plus'
                      onClick={() => toggleCartItemQuantity(item._id, 'inc')}
                    >
                      <AiOutlinePlus />
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
        {/* отображать общую стоимость при условии, что в корзине есть один или несколько товаров. */}
        {cartItems.length >= 1 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <span>${eUSLocale(totalPrice)}</span>
            </div>
            <div className='btn-container'>
              <button type='button' className='btn' onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
