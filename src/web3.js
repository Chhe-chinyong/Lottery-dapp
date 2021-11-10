<<<<<<< HEAD
import Web3 from "web3";
=======
import Web3 from 'web3';

// binding our instance of web3 with Metamask's 
const web3 = new Web3(window.web3.currentProvider);
>>>>>>> parent of d6aa18b (implement metamask)

// binding our instance of web3 with Metamask's
const web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

export default web3;
