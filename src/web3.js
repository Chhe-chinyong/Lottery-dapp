import Web3 from "web3";

// binding our instance of web3 with Metamask's
const web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

export default web3;
