async function main() {
    const adminAddress = '0xa3E5e1f23cDF18aE6499a78D4aDaa075Ff43d46C'

    console.log("Transferring ownership of ProxyAdmin...")
    // The owner of the ProxyAdmin can upgrade our contracts
    await upgrades.admin.transferProxyAdminOwnership(adminAddress)
    console.log("Transferred ownership of ProxyAdmin to:", adminAddress)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })