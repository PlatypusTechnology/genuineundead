import { ethers } from 'hardhat';
import { bytecode } from '../artifacts/contracts/GenuineUndeadStories.sol/GenuineUndeadStories.json';
import { encoder } from '../libs/utils';
import type { ImmutableCreate2Factory } from '../typechain';

const main = async () => {
  const deployerAddress = '0x0000000000FFe8B47B3e2130213B802212439497';
  const initCode =
    bytecode +
    encoder(['address', 'string'], ['0x7b361c3132b24C3b2bD5E48d83f9E4e01f921CF4', 'https://genuine-undead-git-feat-reader-chrisjayden.vercel.app/api/token/{id}']);


  const Factory = await ethers.getContractFactory('ImmutableCreate2Factory');
  const signers = await ethers.getSigners();
  const saltHex = signers[0].address + String(12321).padStart(24,"0");

  console.log(ethers.zeroPadValue(signers[0].address, 32));
  const deploy = await (
    Factory.attach(deployerAddress) as ImmutableCreate2Factory
  ).safeCreate2(saltHex, initCode);

  const txReceipt = await deploy.wait();
  if (txReceipt) console.log('Deployed to:', txReceipt.logs[0]);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
