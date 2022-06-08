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

    // Compramos tokens mediante: direccion destino y cantidad de tokens
    function sendTokens(address _destinatario, uint _numTokens) public {
        token.transfer(_destinatario, _numTokens);
    }

    // Obtenemos el balance de tokens de una direccion
    function balanceOfAddress(address _direccion) public view returns (uint){
        return token.balanceOf(_direccion);
    }

    // Obtener el balance de tokens total del smart contract
    function getTotalBalance()public view returns(uint){
        return token.balanceOf(contrato);
    }
}
