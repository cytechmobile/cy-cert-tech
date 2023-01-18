import Head from 'next/head'
import Web3 from 'web3';
import {useEffect, useState} from "react";
import 'bulma/css/bulma.css'
import configuration from '/build/contracts/CyCertToken.json';
import axios, {all} from "axios";

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

let mintedAddress = [];
let tokensAtAddress = [[],[]];
let newTokenId = 0;

const CyCert = () => {
    const CONTRACT_ADDRESS = configuration.networks['5777'].address;
    const CONTRACT_ABI = configuration.abi;


    const [error, setError] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    const [ownerOfId, setOwnerOfToken] = useState('')
    const [ownerOfIdAddress, setOwnerOfTokenAddress] = useState('')
    const [allTokensByAddress, setAllTokensByAddress] = useState('')
    const [allTokensArray, setAllTokensArray] = useState('')
    const [allTokensAtAddress, setAllTokensAtAddress] = useState([]);



    useEffect(() => {
        //this loads asap
        //get data from db
    })
    const getTokenIdFromAddress = async () => {
        console.log(allTokensByAddress)
        let data={'address': allTokensByAddress}
        let response = await axios.post('/api/getTokensByAddress', data)
            .then((response) => {
                setAllTokensAtAddress(response.data.result.rows)
            })
            .catch((e) => { console.log(e)}
            )

    }


    const getAllTokensByAddress = event => {
        setAllTokensByAddress(event.target.value)
    }

    const updateOwnerOfToken = event => {
        setOwnerOfToken(event.target.value)
    }

    const ownerOfToken = async () => {
        console.log("Owner of token with ID :", ownerOfId)
        //setOwnerOfTokenAddress(0);
        const ownerOfToken = await vmContract.methods.ownerOf(ownerOfId).call()
        setOwnerOfTokenAddress(ownerOfToken);
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
                <div>
                    <b>CyCertToken Verifier</b>
                </div>
                <section>
                    <h3>Connected metamask address: {address} </h3>
                    <h3></h3>

                    <div>
                        <button onClick={connectWalletHandler} className="button is-primary mt-1">Connect Wallet
                        </button>
                    </div>
                </section>

                <section>
                    <input onChange={getAllTokensByAddress} className="input is-primary mt-4" type="type"
                           placeholder="Address"/>
                    <button
                        onClick={getTokenIdFromAddress}
                        className="button is-primary mt-1"
                    >Get TokenID from Address
                    </button>
                </section>
            </div>

            <section>
                <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
            </section>
            <h3 key='id'> {'id'}    |   {'address'} |   {'ipfs'}</h3>
            {allTokensAtAddress.map((item =>
                    <h3 key={item.token_id}>{item.token_id} | {item.address} | {item.ipfs}</h3>
            ))}

        </div>

    )
}
export default CyCert