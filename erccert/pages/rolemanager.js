import Head from 'next/head'
import Web3 from 'web3';
import {useEffect, useState} from "react";
import 'bulma/css/bulma.css'
import configuration from '/build/contracts/CyCertToken.json';

Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

const CyCert = () => {
    const CONTRACT_ADDRESS = configuration.networks['5777'].address;
    const CONTRACT_ABI = configuration.abi;


    const [error, setError] = useState('')
    const [addRole, setAddRole] = useState('')
    const [addAddress, setAddAddress] = useState('')
    const [removeRole, setRemoveRole] = useState('')
    const [removeAddress, setRemoveAddress] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    const [minterRoleValue, setMinterRoleValue] = useState('')
    const [burnerRoleValue, setBurnerRoleValue] = useState('')

    useEffect(() => {
        //this loads asap
        //get data from db
        if (vmContract && address) getMinterBurnerROle();
    })


    const updateAddRole = event => {
        setAddRole(event.target.value)
    }
    const updateAddAddress = event => {
        setAddAddress(event.target.value)
    }
    const addRoleToAddress = async () => {
        console.log("role :", addRole)
        console.log("to address :", addAddress)
        const addRoleToAddress = await vmContract.methods.grantRole(addRole, addAddress).send({
            from: address,
            value: web3.utils.toWei("0", 'ether'),
            gas: 300000,
            gasPrice: 200000000
        }).then((res) => {
            console.log("Success", res)
        }).catch(e => {
            console.log("got exception: ", e);
        });
    }
    const updateRemoveRole = event => {
        setRemoveRole(event.target.value)
    }
    const updateRemoveAddress = event => {
        setRemoveAddress(event.target.value)
    }

    const removeRoleFromAddress = async () => {
        console.log("role :", removeRole)
        console.log("to address :", removeAddress)
        const removeRoleFromAddress = await vmContract.methods.revokeRole(removeRole, removeAddress).send({
            from: address,
            value: web3.utils.toWei("0", 'ether'),
            gas: 300000,
            gasPrice: 200000000
        }).then((res) => {
            console.log("Success", res)
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
                    <h3>Connected metamask address: {address} </h3>
                    <h3></h3>
                    <h3>Minter Role Value: {minterRoleValue}</h3>
                    <h3>Burner Role Value: {burnerRoleValue}</h3>
                    <div>
                        <button onClick={connectWalletHandler} className="button is-primary mt-1">Connect Wallet
                        </button>

                    </div>
                </section>


                <section>

                </section>
                <div>
                    <div>
                        <b>CyCertToken Role Manager</b>
                    </div>
                </div>

                <section>
                    <input onChange={updateAddRole} className="input is-primary mt-4" type="type"
                           placeholder="Role"/>
                    <input onChange={updateAddAddress} className="input is-primary mt-1" type="type"
                           placeholder="Address"/>
                    <button
                        onClick={addRoleToAddress}
                        className="button is-primary mt-1"
                    >Add Role to Address
                    </button>
                </section>
                <div>
                    <section>
                        <input onChange={updateRemoveRole} className="input is-primary mt-4" type="type"
                               placeholder="Role"/>
                        <input onChange={updateRemoveAddress} className="input is-primary mt-1" type="type"
                               placeholder="Address"/>
                        <button
                            onClick={removeRoleFromAddress}
                            className="button is-primary mt-1"
                        >Revoke Role from Address
                        </button>
                    </section>
                </div>
            </div>
        </div>
    )
}
export default CyCert