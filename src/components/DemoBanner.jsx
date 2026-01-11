import React from 'react'

const DemoBanner = () => {
  return (
    // <div className='background-color-black color-white textcenter pt-10'>
    <div className='bg-stone-700 text-stone-50 text-center hover:text-gray-200 pt-10 pb-10 rounded-sm 0.25rem'>
      <span className='text-xl font first-letter:text-9xl, first-letter:font-bold, first-line:text-2xl'>
        This is a demo store - no orders will be accepted or delivered
      </span>
    </div>
  )
}

export default DemoBanner
