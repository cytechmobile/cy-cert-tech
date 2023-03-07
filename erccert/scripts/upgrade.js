async function main() {
    const Box = await ethers.getContractFactory("Box")
    let box = await upgrades.upgradeProxy("0xB9C2C1D60DbFC0BeC67eEedD5D29154e4B7e47Ec", Box)
    console.log("Your upgraded proxy is done!", box.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })