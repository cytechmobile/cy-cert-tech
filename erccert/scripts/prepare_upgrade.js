// scripts/prepare_upgrade.js
async function main() {
    const proxyAddress = '0x23472fFf6377EfEF528A88ae4734e782b463a9B0'
    const Box = await ethers.getContractFactory("Box")
    console.log("Preparing upgrade...")
    const boxAddress = await upgrades.prepareUpgrade(proxyAddress, Box)
    console.log("Box at:", boxAddress)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })