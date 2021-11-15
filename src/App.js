import { useEffect, useState, useRef } from "react";
import lottery from "./lottery";
import MetaMaskOnboarding from "@metamask/onboarding";
// import './App.css';
import web3 from "./web3";
var Accounts = require("web3-eth-accounts");

function App() {
  const ONBOARD_TEXT = "Click here to install MetaMask!";
  const CONNECT_TEXT = "Connect";
  const CONNECTED_TEXT = "Connected";

  const [buttonText, setButtonText] = useState(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const onboarding = useRef();

  const [admin, setAdmin] = useState();
  const [lotterys, setLotterys] = useState();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    function handleNewAccounts(newAccounts) {
      setAccounts(newAccounts);
    }

    const fetchData = async () => {
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
      console.log("admin", admin);
      // lottery.events.BalancePool()
      // .on("data", function(event) {
      //   let lottery = event.returnValues;
      //   // We can access this event's 3 return values on the `event.returnValues` object:
      //   console.log(event);
      //   console.log("Currently balance in pool",  lottery.balance);
      // }).on("error", console.error);
      setAdmin(admin);
    };
    fetchData();

    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleNewAccounts);
      window.ethereum.on("accountsChanged", handleNewAccounts);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleNewAccounts);
        // window.ethereum.off('accountsChanged', handleNewAccounts);
      };
    }
  }, [admin]);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding.current.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  //subscribe to event
  lottery.events
    .BalancePool()
    .on("connected", function (event) {
      console.log("connected to smart contract");
    })
    .on("data", function (event) {
      let lottery = event.returnValues;
      console.log(event);
      let balance = lottery.balance;
      let toEth = web3.utils.fromWei(balance, "ether");
      // We can access this event's 3 return values on the `event.returnValues` object:
      console.log("Currently balance in pool", toEth);
      setBalance(toEth);
    })
    .on("error", console.error);

  async function handleOnclick(e) {
    // console.log(lottery.defaultChain)
    // console.log(lottery.options)
    try {
      const account = await web3.eth.accounts[0];
      const fromAddress = await web3.eth.getAccounts();
      console.log("from", fromAddress);
      console.log("account", account);
      await lottery.methods.pickWinner().send({ from: fromAddress[0] });
    } catch (error) {
      console.log(error);
      const json = JSON.parse(error.Error);
      console.log(json);
    }
  }

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      web3.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      onboarding.current.startOnboarding();
    }
  };

  const handleOnJoin = async () => {
    try {
      const account = await web3.eth.accounts[0];
      const fromAddress = await web3.eth.getAccounts();
      console.log("from", fromAddress);
      console.log("account", account);
      const amount = "0.1";

      const amountToSend = web3.utils.toWei(amount, "ether"); // Convert to wei value
      // using the callback
      web3.eth.sendTransaction({
        from: fromAddress[0],
        to: '0xA07511588c0d5B9dDb63A0d14B5E53Da06E25166',
        // chain: "ropsten",
        value: amountToSend,
        chainId: 3
      }, function (error, hash) {
        console.log(hash);
        console.log(error)
      });
    } catch (error) {
      console.log(error);
      const json = JSON.parse(error.Error);
      console.log(json);
    }


  }

  return (
    <div style={{ textAlign: "center", }}>
      <h1 style={{ fontSize: "2.5rem" }}>Lottery by smart contract</h1>
      <h2>Total Reward: {balance === "0" ? "0" : balance} ETH 💰💰</h2>

      <h2>
        Admin{" "}
        <a
          href="https://ropsten.etherscan.io/address/0xac56f689B36dC736301b3C5FAE880879057Ff65f"
          target={"_blank"}
          rel="noreferrer"
        >
          {!admin ? "Loading" : admin}{" "}
        </a>{" "}
      </h2>
      {/* Participant with smart contract */}
      <button onClick={handleOnJoin} style={{ padding: "0.5rem 1rem", margin: "1rem", fontWeight: "bold" }}>Partipate</button>

      {/* Button for admin */}
      <button onClick={handleOnclick} style={{ padding: "0.5rem 1rem", margin: "1rem", fontWeight: "bold" }}>pick the winner</button>

      <button disabled={isDisabled} onClick={onClick} style={{ padding: "0.5rem 1rem", margin: "1rem", fontWeight: "bold" }} >
        {buttonText}
      </button>
      <br />
      <ul style={{ display: "inline-block" }}>
        <p style={{ fontWeight: "bolder", color: "#f5222d" }}>RULE to participate in lottery: </p>
        <li>
          All players need 1ETH in order to play this lottery
        </li>
        <li>
          The winner of the prize is randomly gernerated by the computer
        </li>
        <li>
          The winner take 90% the prize pool, and 10% for developer.
        </li>
      </ul>

    </div>
  );
}

export default App;