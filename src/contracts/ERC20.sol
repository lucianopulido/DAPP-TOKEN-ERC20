// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 <0.7.0;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";

//Interface de nuestro token ERC20
interface IREC20 {
    //Devuelve la cantidad de tokens existentes
    function totalSupply() external view returns (uint);

    //Devuelve la cantidad de tokens para una direccion indicada por parametro
    function balanceOf(address _account) external view returns (uint);

    //Devuelve el numero de tokens que el spender podra gastar en nombre del propietario
    function allowance(address _owner, address _spender) external view returns (uint);

    //Devuelve un valor booleano como resultado de la operacion indicada
    function transfer(address _recipient, uint _amount) external returns (bool);

    //Devuelve un valor booleano con el resultado de la operacion de gasto
    function approve(address _spender, uint _amount) external returns (bool);

    //Devuelve un valor booleano con el resultado de la operacion de paso de una cantidad de tokens usando el metodo allowance
    function transferFrom(address _sender, address _recipient, uint _amount) external returns (bool);

    //Evento que se debe emitir cuando una cantidad de tokens pase de un origen a un destino
    event Transfer(address indexed from, address indexed to, uint value);

    //Evento que se debe emitir cuando se establece una asignacion con el metodo allowance
    event Approval(address indexed owner, address indexed spender, uint value);
}


//Implementacion de las funciones del token ERC20
contract ERC20Basic is IREC20 {

    string public constant name = "ERC20BlockchainAZ";
    string public constant symbol = "ERC";
    uint8 public constant decimals = 2;

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed owner, address indexed spender, uint tokens);

    using SafeMath for uint;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint))allowed;
    uint totalSupply_;

    constructor(uint initialSupply) public {
        totalSupply_ = initialSupply;
        balances[msg.sender] = totalSupply_;
    }

    function totalSupply() public override view returns (uint){
        return totalSupply_;
    }

    function balanceOf(address _addressOwner) public override view returns (uint){
        return balances[_addressOwner];
    }

    function increaseTotalSupply(uint _newTokensAmount) public {
        totalSupply_ += _newTokensAmount;
        balances[msg.sender] += _newTokensAmount;
    }

    function allowance(address _owner, address _delegate) public override view returns (uint){
        return allowed[_owner][_delegate];
    }

    function transfer(address _recipient, uint _numTokens) public override returns (bool){
        require(_numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(_numTokens);
        balances[_recipient] = balances[_recipient].add(_numTokens);
        emit Transfer(msg.sender, _recipient, _numTokens);
        return true;
    }

    function approve(address _delegate, uint _numTokens) public override returns (bool){
        allowed[msg.sender][_delegate] = _numTokens;
        emit Approval(msg.sender, _delegate, _numTokens);
        return true;
    }

    function transferFrom(address _sender, address _buyer, uint _numTokens) public override returns (bool){
        require(_numTokens <= balances[_sender]);
        require(_numTokens <= allowed[_sender][msg.sender]);

        balances[_sender] = balances[_sender].sub(_numTokens);
        allowed[_sender][msg.sender] = allowed[_sender][msg.sender].sub(_numTokens);
        balances[_buyer] = balances[_buyer].add(_numTokens);
        emit Transfer(_sender, _buyer, _numTokens);
        return true;
    }

}