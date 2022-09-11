import React, { useContext } from 'react';

import { NFTContext } from '../context/NFTContext';

const Input = ({ inputType, title, placeholder, handleClick }) => {
  const { nftCurrency } = useContext(NFTContext);
  return (
    <div className="mt-10 w-full">
      <p className="font-cinzelDecorative dark:text-white text-nft-black-1 font-bold text-xl">{title}</p>

      {inputType === 'number' ? (
        <div
          className="dark:bg-nft-black-1 bg-white border dark:-nft-black-1 border-nft-gray-2 rounded-lg w-full  outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3 flexBetween flex-row"
          placeholder={placeholder}
          onChange={handleClick}
        >
          <input
            type="number"
            className="flex w-full dark:bg-nft-black-1 bg-white outline-none"
            placeholder="Price"
            onChange={handleClick}
          />
          <p className="font-poppins dark:text-white text-nft-black-1 font-bold text-lg">{nftCurrency}</p>
        </div>
      ) : inputType === 'textarea' ? (
        <textarea
          className="dark:bg-nft-black-1 bg-white border dark:-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
          placeholder={placeholder}
          onChange={handleClick}
          rows={5}
        />
      )
        : (
          <input
            className="dark:bg-nft-black-1 bg-white border dark:-nft-black-1 border-nft-gray-2 rounded-lg w-full outline-none font-poppins dark:text-white text-nft-gray-2 text-base mt-4 px-4 py-3"
            placeholder={placeholder}
            onChange={handleClick}
          />
        )}

    </div>
  );
};

export default Input;
