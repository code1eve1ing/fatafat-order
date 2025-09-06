import { Info } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

// TODO: use shadcn 
const ToolTip = ({ type, text }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowTooltip(false);
            }
        };

        if (showTooltip) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        let timer = null
        if (showTooltip) {
            timer = setTimeout(() => {
                setShowTooltip(false);
            }, 10000);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [showTooltip]);

    if (type === 'Info') {
        return (
            <div ref={tooltipRef}>
                <span className="cursor-pointer relative">
                    <Info
                        className="ml-2 text-blue-500 mt-[3px]"
                        size={15}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip(!showTooltip);
                        }}
                    />
                    {
                        showTooltip && (
                            <div
                                className="absolute z-10 w-56 bg-white rounded-lg shadow-lg p-1 top-5 -right-7"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <p className="text-sm text-blue-700 text-center">{text}</p>
                            </div>
                        )
                    }
                </span>
            </div>
        )
    }
    return (
        null
    )
}

export default ToolTip