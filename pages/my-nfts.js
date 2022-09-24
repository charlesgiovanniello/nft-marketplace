import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard, Banner, SearchBar } from '../components';
import images from '../assets';
import { shortenAddress } from '../utils/shortenAddress';

const MyNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSelect, setActiveSelect] = useState('Recently Added');
  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTContext);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }
  useEffect(() => {
    fetchMyNFTsOrListedNFTs('fetchMyNFTs').then((items) => {
      setNfts(items);
      setNftsCopy(items);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price (low to high)':
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        break;
      case 'Price (high to low)':
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredNFTs = nfts.filter((nft) => nft.name.toLowerCase().includes(value.toLowerCase()));
    if (filteredNFTs.length) {
      setNfts(filteredNFTs);
    } else {
      setNfts(nftsCopy);
    }
  };
  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };
  // if (!isLoading && nfts.length === 0) {
  //   return (
  //     <div className="flexCenter sm:p-4 p-16 min-h-screen">
  //       <h1 className=" font-cinzelDecorative dark:text-white text-nft-black text-3xl font-bold">No NFTs Listed for Sale</h1>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name="Your NFTs"
          childStyles="text-center mb-4"
          parentStyles="h-80 justify-center"
        />
        <div className="flex-center flex-col items-center -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 smh:h-36 p-1 bg-nft-black-3 rounded-full">
            <Image src={images.creator1} className="rounded-full object-cover" objectFit="cover" />
          </div>
          <p className="flex justify-center font-poppins dark:text-white font-semibold text-2xl mt-6 text-nft-black-1">{shortenAddress(currentAccount)}</p>
        </div>
      </div>
      {!isLoading && !nfts.length
        ? (
          <div className="flexCenter sm:p-4 p-16">
            <h1 className=" font-cinzelDecorative dark:text-white text-nft-black text-3xl font-bold">No NFTs to show!</h1>
          </div>
        )
        : (
          <div className="sm:px-4 px-12 w-full minmd:w-4/5 flexCenter flex-col">
            <div className="flex-1 w-full flex flex-row sm:flex-col px-4 xs:px-0 minlg:px-8">
              <SearchBar
                activeSelect={activeSelect}
                setActiveSelect={setActiveSelect}
                handleSearch={onHandleSearch}
                clearSearch={onClearSearch}
              />
            </div>
            <div className="mt-3 w-full flex flex-wrap">
              {nfts.map((nft) => <NFTCard key={nft.name} nft={nft} onProfilePage />)}
            </div>
          </div>
        )}
    </div>
  );
};

export default MyNFTs;
