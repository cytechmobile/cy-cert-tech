import Head from 'next/head'
import Web3 from 'web3';
import {useEffect, useState} from "react";
import 'bulma/css/bulma.css'
import configuration from '/build/contracts/CyCertToken.json';
import axios from 'axios';


Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send


const CyCert = () => {
    const CONTRACT_ADDRESS = configuration.networks['5777'].address;
    const CONTRACT_ABI = configuration.abi;


    const [error, setError] = useState('')
    const [bal, setBalance] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    const [mintAddress, setMintAddress] = useState(null)
    const [burnId, setBurnId] = useState(null)
    const [minterRoleValue, setMinterRoleValue] = useState('')
    const [burnerRoleValue, setBurnerRoleValue] = useState('')

    useEffect(() => {
        //this loads asap
        //get data from db
        if (vmContract && address) getMinterBurnerROle();
        if (vmContract && address) getBalance();
    })

    function addIPFSProxy(ipfsHash) {
        const URL = "https://cycert.infura-ipfs.io/ipfs/"
        const hash = ipfsHash.replace(/^ipfs?:\/\//, '')
        const ipfsURL = URL + hash
        console.log(ipfsURL)
        return ipfsURL
    }

    const getBalance = async () => {
        const bal = await vmContract.methods.balanceOf(address).call()
        setBalance(web3.utils.fromWei(String(bal), 'wei'))
    }

    const updateMintAddress = event => {
        setMintAddress(event.target.value)
    }
    const updateMintUri = event => {
        //setMintUri(event.target.value)
    }

    const createTokenImageAndMetadata = async () =>{
        const https = require('https');

        const projectId = '2JscfK1XHZIfaK352hUbNX8MapQ';
        const projectSecret = 'c933f0da8b643f9b29adbfc6ad779279';


        const options = {
            host: 'ipfs.infura.io',
            port: 5001,
            path: '/api/v0/pin/add?arg=QmXoAUJfiduHHDNsrCM6od913wRdDdBCzWMnsKRxY6w9Gx',
            method: 'POST',
            auth: projectId + ':' + projectSecret,
        };

        let req = https.request(options, (res) => {
            let body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                console.log(body);
            });
        });
        req.end();
    }
    const mintTokenToAddress = async () => {
        console.log("mint to address :", mintAddress)
        createTokenImageAndMetadata();
        //setMintUri('QmNRU6xPgDQqyCcoUBg2xDe4C4f8XTz9kckE3DUx4ZgeDt')

        const mintToAddress = await vmContract.methods.safeMint(mintAddress, 'QmXoAUJfiduHHDNsrCM6od913wRdDdBCzWMnsKRxY6w9Gx').send({
            from: address,
            value: web3.utils.toWei("0", 'ether'),
            gas: 300000,
            gasPrice: 200000000
        }).then(async (res) => {

            let data={'address': mintAddress, 'mintUri':'QmXoAUJfiduHHDNsrCM6od913wRdDdBCzWMnsKRxY6w9Gx'}
            axios.post('/api/sendpost', data)
                .then((response) => {
                    console.log(response)
                })
                .catch((e) => { console.log(e)}
                )

        }).catch(e => {
            console.log("got exception: ", e);
        });
    }

    const updateBurnId = event => {
        setBurnId(event.target.value)
    }
    const burnToken = async () => {
        console.log("burning token with ID :", burnId)
        const burnToken = await vmContract.methods.burn(burnId).send({
            from: address,
            value: web3.utils.toWei("0", 'ether'),
            gas: 300000,
            gasPrice: 200000000
        }).then((res) => {
            console.log("Success", res)

            console.log("searching ID: ",burnId)
            let row = tokensAtAddress.findIndex(row => row.includes(parseInt(burnId)));
            let col = tokensAtAddress[row].indexOf(parseInt(burnId));
            tokensAtAddress[row].splice(col,1);

            //TODO completely remove address if no token is left

            console.log("owners :", mintedAddress)
            console.log("tokens :", tokensAtAddress)

        }).catch(e => {
            console.log("got exception: ", e);
        });
    }

    const getMinterBurnerROle = async () => {
        const minterRoleValue = await vmContract.methods.MINTER_ROLE().call()
        const burnerRoleValue = await vmContract.methods.BURNER_ROLE().call()
        setMinterRoleValue(minterRoleValue);
        setBurnerRoleValue(burnerRoleValue);
    }

    const connectWalletHandler = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                var Contract = require('web3-eth-contract');
                // set provider for all later instances to use
                Contract.setProvider('ws://localhost:7545');
                setWeb3(new Web3(window.ethereum))
                const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
                const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS)
                setAddress(accounts[0])

                setVmContract(contract)
            } catch (err) {
                console.log(err)
                setError(err.message)
            }
        } else {
            alert("Metamask required!")
        }
    }

    return (
        <div className="container">
            <Head>
                <title>
                    CyCertToken
                </title>
                <meta name="description" content="A Blockchain Certificates App"/>
            </Head>
            <div className="split left">
                <section>
                        <h3>Connected metamask address: {address} / Balance of Address: {bal} (CCT)</h3>
                        <h3></h3>
                        <h3>Minter Role Value: {minterRoleValue}</h3>
                        <h3>Burner Role Value: {burnerRoleValue}</h3>
                        <div>
                        <button onClick={connectWalletHandler} className="button is-primary mt-1">Connect Wallet
                        </button>
                        <button onClick={getBalance} className="button is-primary mt-1 m-1">get Balance of Connected Address
                        </button>
                        </div>
                </section>


                <section>

                </section>
                <div>
                    <div>
                        <b>CyCertToken Issuer</b>
                    </div>
                </div>
                <section>
                    <input onChange={updateMintAddress} className="input is-primary mt-4" type="type"
                           placeholder="Address"/>
                    {/*<input onChange={updateMintUri} className="input is-primary mt-1" type="type"*/}
                    {/*       placeholder="Uri"/>*/}
                    <button
                        onClick={mintTokenToAddress}
                        className="button is-primary mt-1"
                    >Mint Token to Address
                    </button>
                </section>


                <section>
                    <input onChange={updateBurnId} className="input is-primary mt-4" type="type"
                           placeholder="Token ID"/>
                    <button
                        onClick={burnToken}
                        className="button is-primary mt-1"
                    >Burn Token
                    </button>
                </section>

            </div>
        </div>
    )
}
export default CyCert