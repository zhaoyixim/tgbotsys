import { ethers } from "ethers";
import { Buffer } from 'buffer';
import TronWeb from 'tronweb';

window.Buffer = Buffer;

const walletArr = [
    "0xCe27e430CFBa649429921ac5b6DDB3E2282C91ef",
    "0xE229e40AEf73d6a2c2e26e0a00321d6f66100812"
 ]

/**webtron */
export const createTronInstance = async () =>{
    const tronweb = await new TronWeb({
        fullHost:"https://nile.trongrid.io",
        //fullHost:"http://127.0.0.1:8090",
       // headers: { "TRON-PRO-API-KEY": 'your api key' },
       // privateKey: 'your private key'
    })
    return tronweb;
}
(window as any).tronWeb = createTronInstance();

export const createContractInstance = async(contractAddress:string,walletAddress:string) => {
    const tronInstance = await createTronInstance();
    tronInstance.setAddress(walletAddress);
    const instance = await tronInstance.contract().at(contractAddress);
    //let instance = await tronInstance.contract([AbiFilesAbi],contractAddress)

   // instance.loadAbi(AbiFilesAbi);
    //let res = await instance.totalSupply().call({_isConstant:true});
    console.log("instance",instance);

    //使用send来执行智能合约方法，消耗资源并且还广播到网络。
	//feeLimit	调用合约方法消耗最大数量的SUN。上限是 1000 TRX。(1TRX = 1,000,000SUN)	Integer
    //callValue	本次调用往合约转账的SUN。	Integer
    //shouldPollResponse 如果设置为 TRUE，则会等到在 Solidity 节点上确认事务之后再返回结果。 Boolean
    //tokenId	本次调用往合约中转账TRC10的tokenId。如果没有，不需要设置	String
    //tokenValue	本次调用往合约中转账TRC10的数量，如果不设置tokenId，这项不设置。	Integer
    console.log("getContractBalance",await instance.getContractAddress().call());
    // console.log("getContract",await tronInstance.trx.getContract(contractAddress));

    // console.log("getBalance",await tronInstance.trx.getBalance(contractAddress));
    // console.log("getAccountResources",await tronInstance.trx.getAccountResources(contractAddress));
    // console.log("getAccount",await tronInstance.trx.getAccount(contractAddress));
   
    return {tronWebInstance:instance,tronWebAbiList:instance.abi};
}


// let wallet1 =  null as any
// let wallet2 =  null as any
// const createWalletInstance =async () =>{
//     wallet1 =  await new ethers.Wallet(walletArr[0]);
//     wallet2 =  await new ethers.Wallet(walletArr[1]);
// }

// createWalletInstance();
// const createProvider = async() =>{
//     return await new ethers.providers.JsonRpcProvider("https://nile.trongrid.io/");
// }



// export const createContractInstance = async(contractAddress:string,AbiFiles:any)=>{
//     const provider = await createProvider()
//     const signer =  provider.getSigner()
//     const contract = await new ethers.Contract(contractAddress,AbiFiles.abi,signer)
//     const connect = await contract.connect(signer)
//    // console.log("connect",connect)
//    // console.log("contrAbiFilesact",AbiFiles.abi)
//     return {contract,connect};
// }
