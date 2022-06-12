// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 <0.7.0;
pragma experimental ABIEncoderV2;

import "./ERC20.sol";

contract Main {
    //Instancia del contrato token
    ERC20Basic private token;

    //Dueño del contrato
    address public owner;

    //Direccion del Smart Contract
    address public contrato;

    constructor() public {
        token = new ERC20Basic(10000);
        owner = msg.sender;
        contrato = address(this);
    }

    function getOwner() public view returns (address){
        return owner;
    }

    function getContract() public view returns (address){
        return contrato;
    }

    //Establecer el precio del token
    function precioTokens(uint _numTokens) internal pure returns (uint){
        //Conversion de tokens a ethers : 1 token -> 1 Ether
        return _numTokens * (1 ether);
    }
    // Compramos tokens mediante: direccion destino y cantidad de tokens
    function sendTokens(address _destinatario, uint _numTokens) public payable {
        // Restriccion para filtrar el numero de tokens a comprar
        require(_numTokens <= 10, "La cantidad de tokens es demasiado alta");
        // Establecer un costo
        uint coste = precioTokens(_numTokens);
        // Se evalua la cantidad de Ethers que paga el cliente
        require(msg.value >= coste, "Compra menos tokens  o paga con mas ethers");
        // Diferencia de lo que el cliente paga
        uint returnValue = msg.value - coste;
        // Retorna la cantidad de tokens determinada
        msg.sender.transfer(returnValue);
        // Obtener el balance de tokens disponibles
        uint balance = getTotalBalance();
        require(_numTokens <= balance, "Compra un numero menor de tokens");
        // Transferencia de los tokens al _destinatario
        token.transfer(_destinatario, _numTokens);
    }

    // Obtenemos el balance de tokens de una direccion
    function balanceOfAddress(address _direccion) public view returns (uint){
        return token.balanceOf(_direccion);
    }

    // Obtener el balance de tokens total del smart contract
    function getTotalBalance() public view returns (uint){
        return token.balanceOf(contrato);
    }

    // Generacion de tokens al contrato
    function generaTokens(uint _numTokens) public onlyByOwner {
        token.increaseTotalSupply(_numTokens);
    }

    // Modificador que permita  la ejecucion tan solo por el owner
    modifier onlyByOwner(){
        require(msg.sender == owner, "No tiene permisos para esta funcion");
        _;
    }
}
