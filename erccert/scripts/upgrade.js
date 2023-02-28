async function main() {
    const Box = await ethers.getContractFactory("Box")
    let box = await upgrades.upgradeProxy("0x23472fFf6377EfEF528A88ae4734e782b463a9B0", Box)
    console.log("Your upgraded proxy is done!", box.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })