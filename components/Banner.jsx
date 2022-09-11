import React from 'react';

const Banner = ({ parentStyles, childStyles, name }) => (
  <div className={`relative w-full flex items-center z-0 overflow-auto nft-gradient-2 ${parentStyles}`}>
    <p className={`font-normal text-6xl font-cinzelDecorative text-yellow-300 ${childStyles}`}>{name}</p>
    {/* <p className={`font-bold text-9xl font-Tangerine text-yellow-500 z-10 ${childStyles}`}>{name}</p> */}
    {/* <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-9 -left-16 -z-5" />
    <div className="absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full white-bg -bottom-24 -right-14 -z-5" /> */}
  </div>
);

export default Banner;
