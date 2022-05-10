import { useState, useContext } from 'react';
import Web3Context from './contexts_and_providers/web3Context';
import NFTContext from './contexts_and_providers/nftContext';
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const MintNFTForm = () => {  
  const [NFTName, setNFTName] = useState('');
  const [nameIsValid, setNameIsValid] = useState(true);
  const [NFTDescription, setNFTDescription] = useState('');
  const [descriptionIsValid, setDescriptionIsValid] = useState(true);
  const [NFTImageFileBuffer, setNFTImageFileBuffer] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(true);
  const web3Ctx = useContext(Web3Context);
  const nftCtx = useContext(NFTContext);
  
  const enterNFTNameHandler = (event) => {
    setNFTName(event.target.value);
  };

  const enterNFTDescriptionHandler = (event) => {
    setNFTDescription(event.target.value);
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setNFTImageFileBuffer(Buffer(reader.result));     
    }
  };  

  const submissionHandler = (event) => {
    event.preventDefault();
    NFTName ? setNameIsValid(true) : setNameIsValid(false);
    NFTDescription ? setDescriptionIsValid(true) : setDescriptionIsValid(false);
    NFTImageFileBuffer ? setFileIsValid(true) : setFileIsValid(false);
    const formIsValid = NFTName && NFTDescription && NFTImageFileBuffer;
    
    const mintNFT = async() => {
      const fileAdded = await ipfs.add(NFTImageFileBuffer);
      if(!fileAdded) 
      {
        console.error('Error, while updloading file to IPFS');
        return;
      }
      else
      {
        console.log(fileAdded);
      }

      const metadata = 
      {
        title: "NFT Metadata",
        type: "object",
        properties: {
          name: {
            type: "string",
            description: NFTName
          },
          description: {
            type: "string",
            description: NFTDescription
          },
          image: {
            type: "string",
            description: fileAdded.path
          }
        }
      };

      const metadataAdded = await ipfs.add(JSON.stringify(metadata));
      if(!metadataAdded) 
      {
        console.error('Error, while updloading metadata to IPFS');
        return;
      }
      else
      {
        console.log(metadataAdded);
      }

      nftCtx.contract.methods.Mint(metadataAdded.path).send({ from: web3Ctx.account }).on('transactionHash', (hash) => {
        nftCtx.setNftIsLoading(true);
      }).on('error', (e) =>{
        window.alert('Error, Something went wrong');
        nftCtx.setNftIsLoading(false);  
      })      
    };
    formIsValid && mintNFT();
  };

  const nameClass = nameIsValid? "form-control" : "form-control is-invalid";
  const descriptionClass = descriptionIsValid? "form-control" : "form-control is-invalid";
  const fileClass = fileIsValid? "form-control" : "form-control is-invalid";
  
  return(
    <form onSubmit={submissionHandler}>
      <div className="row justify-content-center">
        <div className="col-md-2">
          <input
            type='text'
            className={`${nameClass} mb-1`}
            placeholder='Name...'
            value={NFTName}
            onChange={enterNFTNameHandler}
          />
        </div>
        <div className="col-md-5">
          <input
            type='text'
            className={`${descriptionClass} mb-1`}
            placeholder='Description...'
            value={NFTDescription}
            onChange={enterNFTDescriptionHandler}
          />
        </div>
        <div className="col-md-2">
          <input
            type='file'
            className={`${fileClass} mb-1`}
            onChange={captureFile}
          />
        </div>
      </div>
      <br></br>
      <button type='submit' className='btn btn-lg btn-success text-black btn-block'>Create</button>
    </form>
  );
};

export default MintNFTForm;