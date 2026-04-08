import React from 'react'

const Loader = ({ title = "Transaction in progress" }) => {
  return (
    <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
      <div className="w-[100px] h-[100px] border-4 border-[#4acd8d] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">{title} <br /> Please wait...</p>
    </div>
  )
}

export default Loader
