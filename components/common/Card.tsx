
import React, { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6 transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};

export default Card;