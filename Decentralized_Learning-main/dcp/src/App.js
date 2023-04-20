import Storage from './contracts/Storage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import { useEffect, useState } from "react";
import { Buffer } from 'buffer';
import { NFTStorage } from 'nft.storage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
	const [filesCount, setfCount] = useState(0);
	const [contract, setContract] = useState(null);
	const [account, setAccount] = useState("");
  const [files, setFiles]= useState([]);
  const [buffer, setBuffer] = useState();
  const [name , setName] = useState(null);
  const [type , setType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dstorage,setdStorage] = useState(null);
  const updateFiles = async (storage) => {
    // Load files & sort by the newest
    const filesCount = await storage.methods.fileCount().call()
    const updatedFiles = [];
    for (var i = filesCount; i >= 1; i--) {
      const file = await storage.methods.files(i).call();
      updatedFiles.push(file);
    }
    setFiles(updatedFiles);
  };
	useEffect(() => {
	  const init = async () => {
		try {
		  // Create Web3 instance using Ganache provider
		  const ganacheProvider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
		  const web3Instance = new Web3(ganacheProvider);
  
		  // Get chain id of Ganache network
		  const chainId = await web3Instance.eth.getChainId();
		  console.log("Chain ID:", chainId);
  
		  // Get accounts from Ganache network
		  const accounts = await web3Instance.eth.getAccounts();
		  console.log("Accounts:", accounts);
		  setAccount(accounts[0]);
  
		  // Load contract
		  const networkId = await web3Instance.eth.net.getId();
		  const deployedNetwork = Storage.networks[networkId];
		  const storage = new web3Instance.eth.Contract(
			Storage.abi,
			deployedNetwork && deployedNetwork.address,
		  );
		  setContract(storage);
     updateFiles(storage);
      
		} catch (error) {
		  console.log(error);
		}
	  };
	  init();
	}, []);

  const captureFile = async (event) => {
    event.preventDefault()

    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
      setName(file.name);
      setType(file.type);
      console.log('buffer',buffer)
    }
  }
    

  //Upload File
  const uploadFile = async (description) => {
    console.log('Submitting File to Decentralized Storage...');

    // Convert the buffer to a Blob
    const file = new Blob([buffer], { type: 'application/octet-stream' });

    // Upload file to nft.storage
    const client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDhBNjA4YmJiYjcwNDExRDExODJiQThERWRDRjNGMkFGY0FmQTg2NTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MTA0NjcwMzk4NiwibmFtZSI6ImRjcF9wcm9qZWN0In0.Ze23yTsnuqwYb2dg4TV4KuEvcHFq8ysVHRYW4oo2w9k' }); // replace with your nft.storage token
    const ipnft = await client.storeBlob(file); // storeBlob returns a Promise
    

    if (!ipnft ) {
      console.error('Failed to upload file to nft.storage');
      return;
    }
      setLoading(true);
   
    // Call the contract's uploadFile function with IPFS hash and file metadata
    console.log(ipnft);
    console.log(type, name, description);
    const gasLimit = 3000000;
    contract.methods.uploadFile(ipnft , 100, type, name, description).send({ from: account, gas: gasLimit  })
      .on('transactionHash', (ipnft) => {
        console.log("Hello");
        setLoading(false);
        setType(null);
        setName(null);
       window.location.reload();
      })

      // .on('error', (e) => {
      //   window.alert('Error');
      //   setLoading(false);
      // });
  };
  //Set states


	return (
    <div >
      <Navbar account={account} />
         { loading
              ? <div id="loader" className="text-center mt-5 "><p>Loading...</p></div>
              : <Main
                  
                  files={files}
                  captureFile={captureFile}
                  uploadFile={uploadFile}
                />
           }
           </div>
	);
};

export default App;
