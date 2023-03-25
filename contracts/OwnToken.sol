// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MyToken {

    // public variables here
    string public tokenName = "Chitcoin";
    string public tokenAbbreviation = "CTC";
    uint public tokenSupply; // default value 0


    // mapping variable here
    mapping(address => uint) internal addressToBalance; 

    //  key as address and value of that address is balance 

    // mint function

    function mint(uint _value) external {
        addressToBalance[msg.sender] += _value; 
        
        tokenSupply+= _value; 
    }

    // get balance 

    function getBalance() external view  returns (uint balance) {
        return addressToBalance[msg.sender];
    }

    // burn function

    function burn(uint _value) external{
        require(addressToBalance[msg.sender]>= _value , "Insuficient balance");
            addressToBalance[msg.sender]-= _value;
            tokenSupply-= _value; 
    }

}