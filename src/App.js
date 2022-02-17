import React,{useEffect, useState,useRef} from 'react';
import './App.css';
import { ethers } from 'ethers';
import alanBtn from "@alan-ai/alan-sdk-web";
// import LoadingIndicator from './Components/LoadingIndicator';
import Bongo from "./assets/images/sample.jpeg";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const alanBtnContainer = useRef();

  const checkIfWalletConnected = async() => {
    try{
      const {ethereum} = window;
      if (!ethereum){
        console.log("make sure that you have metamask");
        setIsLoading(false);
      }else {
        const accounts = await ethereum.request({method:"eth_accounts"});
        console.log(accounts);

        if (accounts.length!==0){
          const account = accounts[0];
          console.log('Found an authorized account', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch(error){
      console.log(error);
    } 
  }

  const renderContent = () => {

    // if (isLoading) {
    //   return <LoadingIndicator />;
    // }

    if(!currentAccount){
      return(
        <div className="connect-wallet-container">
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount){
      return (
        <img src={Bongo} />
      );
    } 
  }

  const connectWalletAction = async() => {
    try{
      const {ethereum} = window;

      if (!ethereum){
        alert("Get Metamask!");
        return;
      } else{
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        setCurrentAccount(accounts[0]);
        console.log("connected->", accounts[0]);
      }
    } catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    setIsLoading(true);
    checkIfWalletConnected();
  },[]);

  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address:', currentAccount);
  
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const gameContract = new ethers.Contract(
      //   CONTRACT_ADDRESS,
      //   myEpicGame.abi,
      //   signer
      // );
  
      // const txn = await gameContract.checkIfUserHasNFT();
      // if (txn.name) {
      //   console.log('User has character NFT');
      //   setCharacterNFT(transformCharacterData(txn));
      // } else {
      //   console.log('No character NFT found');
      // }
      setIsLoading(false);
    };
  
    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log('CurrentAccount:', currentAccount);
      
      fetchNFTMetadata();

      alanBtn({
          key: 'b0cee82a998b3ad0809792cfc8d50e972e956eca572e1d8b807a3e2338fdd0dc/stage',
          onCommand: (commandData) => {
            if (commandData.command === 'go:back') {
              // Call the client code that will react to the received command
              console.log("dddd");
            }
          }
      });
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Bongo Marketplace ⚔️</p>
          <p className="sub-text">Bongo!</p>
          <div className="connect-wallet-container">
            {renderContent()} 
          </div>
          
        </div>
      </div>
      <div ref={alanBtnContainer}></div>
    </div>
  );
}

export default App;
