require('dotenv').config();
import Web3 from 'web3';

console.log(process.env.REACT_APP_MY_ENV_VALUE);
// binding our instance of web3 with Metamask's
const web3 = new Web3(Web3.givenProvider || process.env.REACT_APP_MY_ENV_VALUE);

export default web3;
