import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const baseStyle = "w-3/4 mx-auto py-3 rounded-full font-semibold shadow-md transition-all duration-200 active:scale-95";
    const variants = {
        primary: "bg-slate-800 text-white hover:bg-slate-700",
        secondary: "bg-slate-600 text-white hover:bg-slate-500",
        spotify: "bg-green-500 text-white hover:bg-green-600",
        outline: "border-2 border-[#F59E0B] text-slate-800 hover:bg-orange-50"
    };
    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

export default Button;
