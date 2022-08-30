const Button = ({ classStyles, btnName, handleClick }) => (
  <button
    type="button"
    className={`nft-gradient text-lg minlg:text-lg py-2 px-4 minlg-px-6 font-cinzelDecorative text-white ${classStyles}`}
    onClick={handleClick}
  >{btnName}
  </button>
);

export default Button;
