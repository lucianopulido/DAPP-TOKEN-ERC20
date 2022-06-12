import React, {Component} from 'react';
import './App.css';
import Web3 from "web3";
import web3 from "../ethereum/web3";
import contratoToken from "../abis/Main.json"

class App extends Component {


    async componentWillMount() {
        // Carga de Web3
        await this.loadWeb3()
        // Carga de los datos de la blockchain
        await this.loadBlockchainData()
    }

    // Carga de Web3

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            console.log('window.web3 esta activo')
            window.web3 = new Web3(web3.currentProvider)
        } else {
            window.alert(' "No ethereum browser is installed. Try it installing MetaMask "')
        }
    }

    // Carga de los datos de la blockchain
    async loadBlockchainData() {
        const web3 = window.web3
        // Carga de la cuenta
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        console.log("smart contract", this.state)
        console.log('account: ', this.state.account)
        const networkId = '5777'
        console.log('networkId: ', networkId)
        const networkData = contratoToken.networks[networkId]
        console.log('networkData: ', networkData)

        if (networkData) {
            const abi = contratoToken.abi
            const address = networkData.address
            console.log('abi', abi)
            console.log('address', address)
            const contract = new web3.eth.Contract(abi, address)
            this.setState({contract})

            // Direccion del contrato
            const smartContract = await this.state.contract.methods.getContract().call()
            this.setState({direccion_smart_contract: smartContract})
            console.log("direccion smart contract: ", smartContract)
        } else {
            window.alert('El Smart Contract no se ha desplegado en la red blockchain!')
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            contract: null,
            direccion_smart_contract: '',
            owner: '',
            direccion: '',
            cantidad: 0,
            loading: false,
            errorMessage: '',
            address_balance: '',
            numTokens: 0

        }
    }

    // Funcion para realizar la compra de Tokens
    envio = async (direccion, cantidad, ethers, mensaje) => {
        try {
            console.log(mensaje)
            const accounts = await web3.eth.getAccounts()
            await this.state.contract.methods.sendTokens(direccion, cantidad).send({from: accounts[0], value: ethers})
        } catch (err) {
            this.setState({errorMessage: err.message})
        } finally {
            this.setState({loading: false})
        }
    }

    // Funcion para visualizar el balance de tokens de un usuario
    balance_persona = async (address_balance, mensaje) => {
        try {
            console.log("direccion del balance: ", address_balance)
            console.log(mensaje)
            const balance_direccion = await this.state.contract.methods.balanceOfAddress(address_balance).call()
            alert(parseFloat(balance_direccion))
            this.setState({address_balance: balance_direccion})
        } catch (err) {
            this.setState({errorMessage: err.message})
        } finally {
            this.setState({loading: false})
        }
    }

    // Funcion para visualizar el balance del Smart Contract
    balance_contrato = async (mensaje) => {
        try {
            console.log(mensaje)
            const balance = await this.state.contract.methods.getTotalBalance().call()
            alert(parseFloat(balance))
        } catch (err) {
            this.setState({errorMessage: err.message})
        } finally {
            this.setState({loading: false})
        }
    }

    // Funcion para incrementar el numero de tokens del Smart Contract

    incremento_tokens = async (numeroTokens, mensaje) => {
        try {
            const accounts = await web3.eth.getAccounts()
            console.log(mensaje)
            await this.state.contract.methods.generaTokens(numeroTokens).send({from: accounts[0]})
        } catch (err) {
            this.setState({errorMessage: err.message})
        } finally {
            this.setState({loading: false})
        }
    }


    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="https://frogames.es/rutas-de-aprendizaje"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        DApp
                    </a>
                    <ul className={"navbar-nav px-3"}>
                        <li className={"nav-item text-nowrap d-none d-sm-none d-sm-block"}>
                            <small className={"text-white"}>
                                <span id={"account"}>{this.state.direccion_smart_contract}</span>
                            </small>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <h1>Comprar tokens ERC-20</h1>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const direccion = this.direccion.value
                                    const cantidad = this.cantidad.value
                                    const ethers = web3.utils.toWei(this.cantidad.value, 'ether')
                                    const mensaje = "Compra de tokens en ejecucion..."
                                    this.envio(direccion, cantidad, ethers, mensaje)
                                }}>
                                    <input type={"text"}
                                           className={"form-control mb-1"}
                                           placeholder={"Direccion de destino"}
                                           ref={(input) => {
                                               this.direccion = input
                                           }}/>

                                    <input type={"text"}
                                           className={"form-control mb-1"}
                                           placeholder={"Cantidad de tokens a comprar (1 Token = 1 Ether)"}
                                           ref={(input) => {
                                               this.cantidad = input
                                           }}/>

                                    <input type={"submit"}
                                           className={"btn btn-block btn-danger btn-sm"}
                                           value="COMPRAR TOKENS"/>

                                </form>

                                &nbsp;

                                <h1>Balance total de tokens de un usuario</h1>

                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const address = this.address_balance.value
                                    const mensaje = "Balance de tokens de una persona en ejecucion..."
                                    this.balance_persona(address, mensaje)
                                }}>

                                    <input type={"text"}
                                           className={"form-control mb-1"}
                                           placeholder={"Direccion del usuario"}
                                           ref={(input) => {
                                               this.address_balance = input
                                           }}/>
                                    <input type={"submit"}
                                           className={"btn btn-block btn-success btn-sm"}
                                           value="BALANCE DE TOKENS"/>
                                </form>


                                &nbsp;

                                <h1>Balance de tokens del Smart Contract</h1>

                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = "Balance de tokens del Smart Contract en ejecucion..."
                                    this.balance_contrato(mensaje)
                                }}>
                                    <input type={"submit"}
                                           className={"btn btn-block btn-primary btn-sm"}
                                           value="BALANCE DE TOKENS"/>
                                </form>

                                &nbsp;

                                <h1>Añadir nuevos tokens</h1>

                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = "Incremento de tokens del Smart Contract en ejecucion..."
                                    const numTokens = this.numTokens.value
                                    this.incremento_tokens(numTokens, mensaje)
                                }}>
                                    <input type={"text"}
                                           className={"form-control mb-1"}
                                           placeholder={"Cantidad de tokens a incrementar"}
                                           ref={(input) => {
                                               this.numTokens = input
                                           }}/>

                                    <input type={"submit"}
                                           className={"btn btn-block btn-warning btn-sm"}
                                           value="INCREMENTO DE TOKENS"/>
                                </form>

                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
