// scripts/prepare_upgrade.js
async function main() {
    const proxyAddress = '0xB9C2C1D60DbFC0BeC67eEedD5D29154e4B7e47Ec'
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