const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });
const { ALCHEMY_API_KEY, GOERLI_PRIVATE_KEY } = process.env;

require('@nomiclabs/hardhat-waffle');

// const privateKey = fs.readFileSync('.secret').toString().trim();

// module.exports = {
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//   },
//   solidity: '0.8.4',
// };

module.exports = {
  solidity: '0.8.4',
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};
