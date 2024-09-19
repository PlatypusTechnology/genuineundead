import { ethers } from 'hardhat';

export const encoder = (types: any, values: any) => {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const encodedParams = abiCoder.encode(types, values);
  return encodedParams.slice(2);
};
export async function create2Address(
    factoryAddress: string,  // address of the factory contract
    salt: string,           // any value used as a salt
    initCode: string        // init code of the contract to be deployed
  ): Promise<string> {
    // convert the salt if it's not a hex string
    if(!salt.startsWith('0x')) {
      salt = ethers.id(salt);
    }
  
    // convert the salt to a hex string
    const saltHex: string = ethers.hexlify(salt);
  
    // pack the values
    const packed: string = ethers.solidityPacked(
      ['bytes1', 'address', 'bytes32', 'bytes32'],
      ['0xff', factoryAddress, saltHex, ethers.keccak256(initCode)]
    );
  
    // calculate the address
    const create2Address: string = ethers.getAddress(
      '0x' + ethers.keccak256(packed).slice(-40)
    );
  
    return create2Address;
  }