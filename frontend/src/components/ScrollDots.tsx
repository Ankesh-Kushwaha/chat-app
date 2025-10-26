import React from "react";

interface ScrollDotsProps {
  currentIndex: number;
  total: number;
  onDotClick: (index: number) => void;
}

const ScrollDots: React.FC<ScrollDotsProps> = ({ currentIndex, total, onDotClick }) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-50">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`w-3 h-3 rounded-full transition-all ${
            i === currentIndex ? "bg-blue-500" : "bg-gray-500"
          }`}
        />
      ))}
    </div>
  );
};

export default ScrollDots;
