import { ethers } from "hardhat";
import { bytecode } from '../artifacts/contracts/GenuineUndeadStories.sol/GenuineUndeadStories.json';
import { create2Address, encoder } from "../libs/utils";


async function main() {
  const deployerAddress = '0x0000000000FFe8B47B3e2130213B802212439497';
  const initCode =
    bytecode +
    encoder(['address', 'string'], ['0x7b361c3132b24C3b2bD5E48d83f9E4e01f921CF4', 'https://genuine-undead-git-feat-reader-chrisjayden.vercel.app/api/token/{id}']);

    const signers = await ethers.getSigners();

  for (let i = 1; i < 100000000; i += 1) {

    const saltHex = signers[0].address + String(i).padStart(24,"0");


    
    const create2Addr = await create2Address(deployerAddress, saltHex, initCode);
    
    if (matchesPattern(create2Addr)) {
      console.log('Found matching address:', create2Addr, 'with salt', i);
    }
    if (i % 100000 === 0) console.log(i, create2Addr);
  }
}

const matchesPattern = (address: string): boolean => {
  // This regex will match a repeating pattern of any character (0-9a-f) that repeats at least 5 times in a row
  const pattern =
    /0x(0{5,}|1{5,}|2{5,}|3{5,}|4{5,}|5{5,}|6{5,}|7{5,}|8{5,}|9{5,}|a{5,}|b{5,}|c{5,}|d{5,}|e{5,}|f{5,})/;
  return pattern.test(address);
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
