

async function main() {
    const CyCertTokenB = await ethers.getContractFactory("CyCertTokenB")
    console.log("Deploying CyCertTokenB, ProxyAdmin, and then Proxy...")
    const proxy = await upgrades.deployProxy(CyCertTokenB, { initializer: 'initialize' })
    console.log("Proxy of CyCertTokenB deployed to:", proxy.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })