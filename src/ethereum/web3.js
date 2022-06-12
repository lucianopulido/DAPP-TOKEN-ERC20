import Web3 from "web3"

let web3

if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
}

window.addEventListener("load", async () => {
    if (window.ethereum) {

        window.web3 = new Web3(window.ethereum)
        try {
            console.log('window.ethereum esta activo')
            await window.ethereum.enable()
        } catch (error) {
           console.log(error)
        }
    } else if (window.web3) {
        console.log('window.web3 esta activo')
        window.web3 = new Web3(web3.currentProvider)
    } else {
        alert(' "No ethereum browser is installed. Try it installing MetaMask "')
    }
})

export default web3;