
import React from 'react';
import { Country } from '../types';

interface FlagModalProps {
  country: Country | null;
  onClose: () => void;
}

export const FlagModal: React.FC<FlagModalProps> = ({ country, onClose }) => {
  if (!country) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full">
        <button 
          className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          src={`https://flagcdn.com/w1280/${country.code}.png`} 
          alt={`Flag of ${country.name}`}
          className="w-full h-auto shadow-2xl rounded-lg select-none"
        />
        <div className="mt-4 text-center text-white">
          <h2 className="text-2xl font-bold">{country.name}</h2>
          <p className="text-gray-400">{country.region}</p>
        </div>
      </div>
    </div>
  );
};
