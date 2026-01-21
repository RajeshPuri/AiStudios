
import React, { useState } from 'react';
import { Country } from '../types';
import { COUNTRIES } from '../constants';

interface LearnModeProps {
  onShowFlag: (country: Country) => void;
}

export const LearnMode: React.FC<LearnModeProps> = ({ onShowFlag }) => {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');

  const regions = ['All', ...Array.from(new Set(COUNTRIES.map(c => c.region)))];

  const filteredCountries = COUNTRIES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.capital.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'All' || c.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-2xl mx-auto pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 bg-white sticky top-0 z-10 border-b border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-4">Explore</h1>

        <div className="relative mb-4">
          <svg className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search country or capital..."
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => setRegionFilter(region)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                regionFilter === region 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCountries.map((country) => (
          <div 
            key={country.code}
            className="bg-slate-50 rounded-2xl p-4 flex gap-4 items-center hover:bg-slate-100 transition-colors group"
          >
            <div 
              className="w-20 h-14 bg-slate-200 rounded-lg overflow-hidden shadow-sm flex-shrink-0 cursor-pointer"
              onClick={() => onShowFlag(country)}
            >
              <img 
                src={`https://flagcdn.com/w160/${country.code}.png`}
                alt={country.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 truncate">{country.name}</h4>
              <div className="grid grid-cols-2 gap-x-2 mt-1">
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Capital</p>
                  <p className="text-xs font-medium text-slate-600 truncate">{country.capital}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Currency</p>
                  <p className="text-xs font-medium text-slate-600 truncate">{country.currency}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCountries.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">No matches found.</p>
        </div>
      )}
    </div>
  );
};
