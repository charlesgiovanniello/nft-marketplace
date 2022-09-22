// EXPLORE NFT's (Home Page)
import Image from 'next/image';
import { useState, useEffect, useRef, useContext } from 'react';
import { useTheme } from 'next-themes';
import { Banner, CreatorCard, NFTCard, SearchBar, Loader } from '../components';

import { NFTContext } from '../context/NFTContext';
import images from '../assets';
import { makeId } from '../utils/makeId';
import { getCreators } from '../utils/getTopCreators';
import { shortenAddress } from '../utils/shortenAddress';

const Home = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [activeSelect, setActiveSelect] = useState('Recently Listed');
  const { fetchNFTs } = useContext(NFTContext);
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items);
      setNftsCopy(items);
      setisLoading(false);
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

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === 'left') {
      current.scrollLeft -= scrollAmount;
    }
    if (direction === 'right') {
      current.scrollLeft += scrollAmount;
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    // console.log(`LEARNING CURRENT ?,${current},${current.scrollWidth}`);
    if (current && current.scrollWidth >= parent.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  const topCreators = getCreators(nftsCopy);
  console.log(topCreators);

  return (
    /* BANNER */
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          parentStyles="justify-center mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          childStyles="md:text-4xl sm:text-2xl xs-xl text-center"
          name="Scour  OpenSea  for  the  rarest  nft's"
        />
        {!isLoading && !nfts.length ? (
          <h1 className=" font-cinzelDecorative dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">No treasures be found!</h1>
        ) : isLoading ? <Loader />
          : (
            <>
              {/* TOP PIRATES */}
              <div>
                <h1 className="font-cinzelDecorative dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-bold ml-4 xs::ml-0">Top Pirates</h1>
                <div
                  className="relateive flex-1 max-w-full flex mt-3"
                  ref={parentRef}
                >
                  <div
                    className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                    ref={scrollRef}
                  >
                    {topCreators.map((creator, i) => (
                      <CreatorCard
                        key={creator.seller}
                        rank={i + 1}
                        creatorImage={images[`creator${i + 1}`]}
                        creatorName={shortenAddress(creator.seller)}
                        creatorEths={creator.sum}
                      />
                    ))}
                    {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}`}
                  creatorEths={10 - i}
                />
              ))} */}
                    {!hideButtons ? (
                      <>
                        <div onClick={() => { handleScroll('left'); }} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-[565px] xs:top-[460px] cursor-pointer left-5">
                          <Image
                            src={images.left}
                            layout="fill"
                            objectFit="contain"
                            alt="left_arrow"
                            className={theme === 'light' ? 'filter invert' : undefined}
                          />
                        </div>
                        <div onClick={() => { handleScroll('right'); }} className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-[565px] xs:top-[460px] cursor-pointer right-5">
                          <Image
                            src={images.right}
                            layout="fill"
                            objectFit="contain"
                            alt="right_arrow"
                            className={theme === 'light' ? 'filter invert' : undefined}
                          />
                        </div>
                      </>
                    )
                      : undefined}
                  </div>
                </div>
              </div>
              {/* Created NFT's */}
              <div className="mt-10">
                <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                  <h1 className="font-cinzelDecorative dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-bold sm:mb-4 flex-1">Recently Found Treasures</h1>
                  <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                    <SearchBar
                      activeSelect={activeSelect}
                      setActiveSelect={setActiveSelect}
                      handleSearch={onHandleSearch}
                      clearSearch={onClearSearch}
                    />
                  </div>
                </div>
                <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                  {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
                  {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <NFTCard
                key={`nft-${i}`}
                nft={{
                  i,
                  name: `Nifty NFT ${i}`,
                  price: (10 - i * 0.534).toFixed(2),
                  seller: `0x${makeId(3)}...${makeId(4)}`,
                  owner: `0x${makeId(3)}...${makeId(4)}`,
                  description: 'AutoGeneratred NFT',
                }}
              />
            ))} */}
                </div>
              </div>
            </>
          )}

      </div>
    </div>
  );
};

export default Home;

