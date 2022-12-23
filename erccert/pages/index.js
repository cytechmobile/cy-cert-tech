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
    const [bal, setBalance] = useState('')
    const [addRole,setAddRole] = useState('')
    const [addAddress,setAddAddress] = useState('')
    const [removeRole,setRemoveRole] = useState('')
    const [removeAddress,setRemoveAddress] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    const [mintAddress, setMintAddress] = useState(null)
    const [mintUri, setMintUri] = useState('')
    const [burnId, setBurnId] = useState(null)
    const [ownerOfId, setOwnerOfToken] = useState('')
    const [ownerOfIdAddress, setOwnerOfTokenAddress] = useState('')
    const [minterRoleValue, setMinterRoleValue] = useState('')
    const [burnerRoleValue, setBurnerRoleValue] = useState('')


    useEffect(() => {
        //this loads asap
        if (vmContract && address) getMinterBurnerROle();
    })
    const getOwner = async () => {
        // const own = await vmContract.methods.ownerOf().call()
        // setOwner(own)
    }

    const getBalance = async () => {
        const bal = await vmContract.methods.balanceOf(address).call()
        setBalance(web3.utils.fromWei(String(bal), 'ether'))
    }

    const updateMintAddress = event => {
        setMintAddress(event.target.value)
    }
    const updateMintUri = event => {
        setMintUri(event.target.value)
    }
    const mintTokenToAddress = async () => {
        console.log("mint to address :" , mintAddress)
        const mintToAddress = await vmContract.methods.safeMint(mintAddress,mintUri).send({
            from:address,
            value:web3.utils.toWei("0",'ether'),
            gas:300000,
            gasPrice:200000000
        }).then((res) => {
            console.log("Success", res)
        }).catch(e => {
            console.log("got exception: ",e);
        });
    }

    const updateBurnId = event => {
        setBurnId(event.target.value)
    }
    const burnToken = async () => {
        console.log("burning token with ID :" , burnId)
        const burnToken = await vmContract.methods.burn(burnId).send({
            from:address,
            value:web3.utils.toWei("0",'ether'),
            gas:300000,
            gasPrice:200000000
        }).then((res) => {
            console.log("Success", res)
        }).catch(e => {
            console.log("got exception: ",e);
        });
    }

    const updateAddRole = event => {
        setAddRole(event.target.value)
    }
    const updateAddAddress = event => {
        setAddAddress(event.target.value)
    }
    const addRoleToAddress = async () => {
          console.log("role :" , addRole)
          console.log("to address :" , addAddress)
          const addRoleToAddress = await vmContract.methods.grantRole(addRole,addAddress).send({
            from:address,
            value:web3.utils.toWei("0",'ether'),
            gas:300000,
            gasPrice:200000000
          }).then((res) => {
            console.log("Success", res)
          }).catch(e => {
            console.log("got exception: ",e);
          });
    }
    const updateRemoveRole = event => {
        setRemoveRole(event.target.value)
    }
    const updateRemoveAddress = event => {
        setRemoveAddress(event.target.value)
    }

    const removeRoleFromAddress = async () => {
        console.log("role :" , removeRole)
        console.log("to address :" , removeAddress)
        const removeRoleFromAddress = await vmContract.methods.revokeRole(removeRole,removeAddress).send({
            from:address,
            value:web3.utils.toWei("0",'ether'),
            gas:300000,
            gasPrice:200000000
        }).then((res) => {
            console.log("Success", res)
        }).catch(e => {
            console.log("got exception: ",e);
        });
    }

    const updateOwnerOfToken = event => {
        setOwnerOfToken(event.target.value)
    }

    const ownerOfToken = async () => {
        console.log("Owner of token with ID :" , ownerOfId)
        setOwnerOfTokenAddress(0);
        const ownerOfToken = await vmContract.methods.ownerOf(ownerOfId).call()
        setOwnerOfTokenAddress(ownerOfToken);
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
        <div>
            <Head>
                <title>
                    CyCertToken
                </title>
                <meta name="description" content="A Blockchain Certificates App"/>
            </Head>
            <div className="split left">
                <div className="content">
                    <div className="centered">
                        <section>
                            <div className="container">
                                <h2>Connected metamask address: {address}</h2>
                            </div>
                            <div className="container">
                                <h2>Balance of Address: {bal} (CCT)</h2>
                            </div>
                            <div className="container">
                                <h3>Minter Role Value: {minterRoleValue}</h3>
                                <h3>Burner Role Value: {burnerRoleValue}</h3>
                            </div>
                        </section>

                        <button onClick={connectWalletHandler} className="button is-primary mt-1">Connect Wallet
                        </button>
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
                            <input onChange={updateMintAddress} className="input is-primary mt-4" type="type"
                                   placeholder="Address"/>
                            <input onChange={updateMintUri} className="input is-primary mt-1" type="type"
                                   placeholder="Uri"/>
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
                        <div>
                            <section>
                                <input onChange={updateOwnerOfToken} className="input is-primary mt-4" type="type"
                                       placeholder="Token ID"/>

                                <button
                                    onClick={ownerOfToken}
                                    className="button is-primary mt-1"
                                >Owner Of Token :
                                </button><div> {ownerOfIdAddress}</div>
                            </section>
                        </div>
                        <section>
                            <div className="container has-text-danger">
                                <p>{error}</p>
                            </div>
                        </section>
                    </div>
                </div>

            </div>
        </div>
    )
}
export default CyCert