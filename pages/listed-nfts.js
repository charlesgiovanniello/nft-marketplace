import { useState, useEffect, useContext } from 'react';

import { NFTContext } from '../context/NFTContext';
import { Loader, NFTCard } from '../components';

const ListedNFTs = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchMyNFTsOrListedNFTs } = useContext(NFTContext);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs('fetchItemsListed').then((items) => {
      setNfts(items);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }
  // if (!isLoading && nfts.length === 0) {
  //   return (
  //     <div className="flexCenter sm:p-4 p-16 min-h-screen">
  //       <h1 className=" font-cinzelDecorative dark:text-white text-nft-black text-3xl font-bold">No NFTs Listed for Sale</h1>
  //     </div>
  //   );
  // }

  return (
    <div className="fkex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-cinzelDecorative dark:text-white text-nft-black text-2xl font-bold mt-2 ml-4 sm:ml-2">NFTs Listed for Sale</h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
