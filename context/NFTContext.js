import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';
// import { create } from 'ipfs-http-client';

import { Web3Storage } from 'web3.storage';
import { MarketAddress, MarketAddressABI } from './constants';

export const NFTContext = React.createContext();

// Construct with token and endpoint
const client = new Web3Storage({ token: process.env.WEB_3_STORAGE_KEY });

// const auth = `Basic ${Buffer.from(`${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_API_SECRET}`).toString('base64')}`;

// const client = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   path: 'api/v0/add',
//   method: 'POST',
//   headers: {
//     authorization: auth,
//   },
// });

const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const nftCurrency = 'ETH';
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log('No accounts found');
    }

    console.log({ accounts });
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };

  const uploadToIPFS = async (files, setFileURL) => {
    try {
      const cid = await client.put(files);
      const url = `https://${cid}.ipfs.w3s.link/${files[0].name}`;
      console.log('stored files with cid:', cid);
      console.log(url);
      return url;
    } catch (e) {
      alert('Max file size is 5MB!');
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    // https://www.npmjs.com/package/web3modal
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, 'ether');
    console.log('Price as UINT256: ', price);
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();
    const transaction = !isReselling ? await contract.createToken(url, price, { value: listingPrice.toString() })
      : await contract.resellToken(id, price, { value: listingPrice.toString() });
    setIsLoadingNFT(true);
    await transaction.wait();
  };

  const createNFT = async (formInput, fileURL, router, fileID) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileURL) return;

    const data = new Blob([JSON.stringify({ name, description, price, image: fileURL, fileID })], { type: 'application/json' });

    const files = [new File([data], fileID)];
    try {
      const added = await client.put(files);
      console.log('FILE ID: ', fileID);
      const url = `https://${added}.ipfs.w3s.link/${fileID}`;

      await createSale(url, price);
      router.push('/');
      return true;
    } catch (e) {
      console.log('Error uploading file to IPFS', e);
      return false;
    }
  };

  const fetchNFTs = async () => {
    setIsLoadingNFT(false);
    // const provider = new ethers.providers.JsonRpcProvider();
    const provider = ethers.getDefaultProvider('goerli');
    const contract = fetchContract(provider);
    try {
      const data = await contract.fetchMarketItems();

      const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const { data: { image, name, description } } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI,
        };
      }));
      return items;
    } catch (e) {
      console.log('No market items: ', e);
      return [];
    }
  };

  const fetchMyNFTsOrListedNFTs = async (type) => {
    // https://www.npmjs.com/package/web3modal
    setIsLoadingNFT(false);
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    const provider = new ethers.providers.JsonRpcProvider(`https://goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);
    try {
      const data = type === 'fetchItemsListed' ? await contract.fetchItemsListed() : await contract.fetchMyNfts();

      const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
        const tokenURI = await contract.tokenURI(tokenId);
        const { data: { image, name, description } } = await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(unformattedPrice.toString(), 'ether');

        return {
          price,
          tokenId: tokenId.toNumber(),
          seller,
          owner,
          image,
          name,
          description,
          tokenURI,
        };
      }));
      return items;
    } catch (e) {
      console.log('No items listed: ', e);
      return [];
    }
  };

  const buyNFT = async (nft) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
    setIsLoadingNFT(true);
    await transaction.wait();
    setIsLoadingNFT(false);
  };

  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToIPFS, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs, buyNFT, createSale, isLoadingNFT }}>
      {children}
    </NFTContext.Provider>
  );
};
