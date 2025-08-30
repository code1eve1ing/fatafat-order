import React from 'react'

const Logo = ({ className }) => {
    return (
        <div className={`w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold ${className}`}>
            FO
        </div>
    )
}

export default Logo