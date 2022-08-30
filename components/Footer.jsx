import Image from 'next/image';
import { useTheme } from 'next-themes';

import images from '../assets';
import { Button } from '.';

const FooterLinks = ({ items, heading }) => (
  <div className="flex-1 justify-start items-start">
    <h3 className="font-cinzelDecorative dark:text-white text-nft-black-1 font-semibold text-xl mb-6">{heading}</h3>
    {items.map((item, index) => (
      <p key={index} className="font-poppins dark:text-white text-nft-black-1 font-normal text-base cursor-pointer dark:hover:text-nft-gray-1 hover:text-nft-black-1 my-3">{item}</p>
    ))}
  </div>
);

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="flexCenter flex-col border-t dark:border-nft-black-1 border-nft-gray-1 sm:p7-8 py-16 ">
      <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16 justify-between items-center">
        {/* LOGO */}
        <div className="flex flexBetweenStart flex-wrap md:ml-0 md:place-self-center ">
          <Image src={images.logo02} objectFit="contain" width={50} height={50} alt="logo" />
          <p className="dark:text-white text-nft-black-1 font-extrabold text-3xl ml-2 font-dancingScript">OpenSweeper</p>
        </div>
        {/* CONTACT FORM */}
        <div className="flex flex-col justify-center items-center">
          <p className="font-cinzelDecorative dark:text-white text-nft-black-1 font-semibold mt-6">Get the latest updates</p>
          <div className="flexBetween md:w-full minlg:w-557 w-357 mt-6 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md">
            <input type="email" placeholder="davey-jones@example.com" className="h-full flex-1 w-full dark:bg-nft-black-2 bg-white px-4 rounded-md dark:text-white text-nft-black-1 font-normal text-xs minlg:text-lg outline-none" />
            <div className="flex-initial">
              <Button btnName="Email Me" classStyles="rounded-md" />
            </div>
          </div>
        </div>
        {/* SUPPORT */}
        <div className="flex flexBetweenStart flex-wrap md:ml-0 md:mt-8 md:place-self-center">
          <FooterLinks heading="Support" items={['Explore', 'How It Works', 'Contact']} />
        </div>
      </div>

      <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
        <div className="flexBetween flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
          <p className="flex font-Satisfy dark:text-white text-nft-black-1 font-medium">OpenSweeper, Inc. All rights reserved</p>
          <div className="flex flex-row sm:mt-4">
            {[images.instagram, images.twitter, images.discord].map((image, i) => (
              <div className="mx-2 cursor-pointer" key={i}>
                <Image
                  src={image}
                  objectFit="contain"
                  width={24}
                  height={24}
                  alt="social"
                  className={theme === 'light' && 'filter invert'}
                />

              </div>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
