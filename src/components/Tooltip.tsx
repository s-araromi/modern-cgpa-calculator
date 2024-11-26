import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg max-w-[250px] text-center break-words animate-fadeIn z-50">
          {text}
          <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

export default Tooltip;