import Head from 'next/head'
import Web3 from 'web3';
import {useEffect, useState} from "react";
import 'bulma/css/bulma.css'
import configuration from '/build/contracts/CyCertToken.json';
import Contract from "web3-eth-contract";

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send
let provider = new Web3.providers.HttpProvider('http://localhost:7545')

const CyCert = () => {
    const CONTRACT_ADDRESS = configuration.networks['5777'].address;
    const CONTRACT_ABI = configuration.abi;


    const [error, setError] = useState('')
    // const [owner, setOwner] = useState('')
    const [bal, setBalance] = useState('')
    // const [enterLot,setEnterAmount] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    const [players, setPlayers] = useState(null)


    useEffect(() => {
        //this loads asap
        // if (vmContract && address) getOwner();
    })
    const getOwner = async () => {
        // const own = await vmContract.methods.ownerOf().call()
        // setOwner(own)
    }

    const getBalance = async () => {
        const bal = await vmContract.methods.balanceOf(address).call()
        setBalance(web3.utils.fromWei(String(bal), 'ether'))
    }

    // const getPlayers = async () => {
    //   const pl = await vmContract.methods.getPlayers().call()
    //   setPlayers(pl)
    // }
    const updateEnterAmount = event => {
        console.log(event.target.value)
        setEnterAmount(event.target.value)
    }
    //
    const enterLottery = async () => {
        //   console.log("value :" , enterLot)
        //   console.log("account :" , address)
        //   const enter = await vmContract.methods.enterLottery().send({
        //     from:address,
        //     value:web3.utils.toWei("1",'ether'),//web3.utils.toWei(String(enterLot),'ether'),
        //     gas:300000,
        //     gasPrice:200000000
        //   }).then((res) => {
        //     console.log("Success", res)
        //   }).catch(e => {
        //     console.log("got exception: ",e);
        //   });
    }
    //
    // const pickWinner = async() =>{
    //   const winner = await vmContract.methods.pickWinner().send({
    //     from:address,
    //     value:web3.utils.toWei("0",'ether'),//web3.utils.toWei(String(enterLot),'ether'),
    //     gas:300000,
    //     gasPrice:200000000,
    //   })
    //
    //       .then((res) => {
    //         console.log("Success", res)
    //       }).catch(e => {
    //         console.log("got exception: ",e);
    //       });
    // }

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
        <div>
            <Head>
                <title>
                    CyCertToken
                </title>
                <meta name="description" content="A Blockchain Certificates App"/>
            </Head>
            <nav className="navbar">


                <section>
                    <div className="container">
                        <h2>Connected metamask address: {address}</h2>
                    </div>
                    <div className="container">
                        {/*<h2>Number of players: {players}</h2>*/}
                    </div>
                    <div className="container">
                        <h2>Balance of Address: {bal} (CCT)</h2>
                    </div>

                </section>

            </nav>
            <button onClick={connectWalletHandler} className="button is-primary mt-1">Connect Wallet</button>
            <section>
                <button
                    onClick={getBalance}
                    className="button is-primary mt-1"
                >get Balance of Connected Address
                </button>
            </section>

            <div>
                <div>
                    <b>CyCertToken Issuer</b>
                </div>

            </div>

            <section>
                <input onChange={updateEnterAmount} className="input is-primary mt-4" type="type" placeholder="Role"/>
                <input onChange={updateEnterAmount} className="input is-primary mt-1" type="type"
                       placeholder="Address"/>
                <button
                    onClick={enterLottery}
                    className="button is-primary mt-1"
                >Add Role to Address
                </button>

            </section>

            <div></div>
            <section>
                <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
            </section>
        </div>
    )
}
export default CyCert