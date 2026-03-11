import React from 'react'

const Loader = ({ size = "sm" }) => {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-7 h-7 border-[3px]",
    lg: "w-9 h-9 border-4"
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizes[size]}
          border-purple-500/20
          border-t-purple-500
          border-r-purple-500/10
          border-b-purple-500/10
          border-l-purple-500/10
          rounded-full
          animate-spin
          transition-all
          duration-700
          ease-in-out
        `}
      />
    </div>
  )
}

export default Loader