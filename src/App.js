
import './App.css';
import { useEffect, useState } from 'react';
import lottery from "./lottery";

// import './App.css';
import web3 from './web3';
var Accounts = require('web3-eth-accounts');

// var accounts = new Accounts(window.web3.currentProvide);

function App() {
  const [admin, setAdmin] = useState();
  const [lotterys, setLotterys] = useState();
  const [balance, setBalance] = useState('0');

   useEffect(() => {
    
    // {admin: ƒ, 0xf851a440: ƒ, admin(): ƒ, getBalance: ƒ, 0x12065fe0: ƒ, …}
    // 0x5d495aea: ƒ ()
    // 0x12065fe0: ƒ ()
    // 0xf71d96cb: ƒ ()
    // 0xf851a440: ƒ ()
    // admin: ƒ ()
    // admin(): ƒ ()
    // getBalance: ƒ ()
    // getBalance(): ƒ ()
    // pickWinner: ƒ ()
    // pickWinner(): ƒ ()
    // players: ƒ ()
    // players(uint256): ƒ ()
    // [[Prototype]]: Object
  
    const fetchData = async() => {
      // const manager = await lottery.methods.players().call();
      // const players = await lottery.methods.getPlayers().call();
      // const balance = await web3.eth.getBalance(lottery.options.address);
      // setLotterys(lotterys);
      // lottery.defaultChain = 'rinkeby';
      // const bobo = await web3.eth.givenProvider[1];
      // console.log(bobo)
      // let accounts = await web3.eth.getAccounts() ; 
      // console.log(accounts)
      // console.log(await lottery.methods.admin().call());
      // console.log(await lottery.methods.players(2).call());
      // console.log(await lottery.methods)
      const admin = await lottery.methods.admin().call();
      // console.log(await lottery.methods.getBalance().call({from: admin})
      console.log('admin', admin)
      // lottery.events.BalancePool()
      // .on("data", function(event) {
      //   let lottery = event.returnValues;
      //   // We can access this event's 3 return values on the `event.returnValues` object:
      //   console.log(event);
      //   console.log("Currently balance in pool",  lottery.balance);
      // }).on("error", console.error);
      setAdmin(admin)
    }
    fetchData();
  }, [admin]);


  //subscribe to event
  lottery.events.BalancePool()
  .on('connected', function(event) {
    console.log('connected to smart contract')
  }).on("data", function(event) {
    let lottery = event.returnValues;
    console.log(event);
    let balance = lottery.balance
    let toEth =  web3.utils.fromWei(balance, 'ether')
    // We can access this event's 3 return values on the `event.returnValues` object:
    console.log("Currently balance in pool",  toEth);
    setBalance(toEth);
  }).on("error", console.error);

  async function handleOnclick(e) {
    // console.log(lottery.defaultChain)
    // console.log(lottery.options)
    try {
      const account = await web3.eth.accounts[0];
      const fromAddress = await web3.eth.getAccounts();
       console.log('from', fromAddress)
       console.log('account', account)
      await lottery.methods.pickWinner().send({from: fromAddress[0]});

    } catch (error) {
      console.log(error);
      const json = JSON.parse(error.Error);
      console.log(json);
    }

  }
  return (
    <div className="App">
        <h1>Lottery by smart contract</h1>
        <h2>Total balance:  {balance ===  '0' ? '0' : balance} ETH </h2>
       
      <h2>Admin  <a href="https://ropsten.etherscan.io/address/0xac56f689B36dC736301b3C5FAE880879057Ff65f" target={"_blank"} > {!admin ? "Loading" : admin} </a> </h2>

      {/* Button for admin */}
      <button onClick={handleOnclick}>
        pick the winner
      </button>
      
    </div>
  );
}

export default App;
