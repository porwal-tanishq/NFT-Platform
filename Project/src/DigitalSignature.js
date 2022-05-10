
import './App.css';
import {Button} from "reactstrap";
import web3 from './web3';
import React, { useState } from "react";

const App = ()=>
{
  const [state,setState]=useState({ account: '', signature: '', message: ''});
  
  const signMessage= async()=>{
    const accounts= await web3.eth.getAccounts();
    const account=accounts[0];
    document.getElementById('wallet-address').textContent=account;
    const message= 'Welcome to Medi-Caps University NFT - Platform! \n\nClick "Sign" to sign in. No password needed! \nThis request will not trigger a blockchain transaction or cost any gas fees. \n\nWallet address: ' + account;
    const signature = await web3.eth.personal.sign(message,account);
    console.log("Signature: " + signature);
    setState({account, signature, message});
  }

  const recover= async()=>{
      const acc_address= await web3.eth.personal.ecRecover(state.message,state.signature);
      window.alert('Signature Verified, Wallet Address is: '+acc_address);
      console.log('Verified Signature from account: '+acc_address);
  }
    return (
      <>
        <div className="bg">
            <p style={{color:"white"}}>Wallet Address: <span id="wallet-address"></span></p>
            <Button color="primary" outline color="primary" className="primary lg rounded-pill pe-5 ps-5 mt-5" size="lg" onClick={signMessage}> Sign Message </Button>
            <br/>
            <Button color="primary" outline color="primary" className="primary lg rounded-pill pe-5 ps-5 mt-5" size="lg" onClick={recover}>Verify Signature </Button>
        </div>
        <footer>
          <div className="about">
                <h3>About</h3>
                <ul>
                    <li><a href="About" id="noline"> About Us</a></li>
                    <li><a href="Objectives" id="noline"> Objectives</a></li>
                </ul>
          </div>
          <div className="mail">
              <h3>Mail Us</h3>
              <p>nftplatform@gmail.com</p><br></br>
          </div>
          <div className="office">
            <h3>Registered Office</h3>
            <p>Computer-Science Block,<br></br> 
            Medi-Caps University <br></br>
            <br></br>
            A.B. Road, Pigdamber, Rau <br></br>
            Indore - 453331</p>
          </div>
        </footer>
      </>
    );
}
export default App;
