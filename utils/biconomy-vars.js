// for future use if EIP712 signature needs to be implemented

// export const domainType = [
//     { name: "name", type: "string" },
//     { name: "version", type: "string" },
//     { name: "verifyingContract", type: "address" },
//     { name: "salt", type: "bytes32" },
// ];

// export const metaTransactionType = [
//     { name: "nonce", type: "uint256" },
//     { name: "from", type: "address" },
//     { name: "functionSignature", type: "bytes" }
// ];

// export const domainData721 = {
//     name: "NFT",
//     version: "2",
//     verifyingContract: "0x72B6Dc1003E154ac71c76D3795A3829CfD5e33b9",
//     // converts Number to bytes32. pass your chainId instead of 42 if network is not Kovan - changed to 137
//     salt: '0x' + (137).toString(16).padStart(64, '0')
// };

// export const domainData1155 = {
//     name: "NFT",
//     version: "2",
//     verifyingContract: "0xfd1dBD4114550A867cA46049C346B6cD452ec919",
//     // converts Number to bytes32. pass your chainId instead of 42 if network is not Kovan 
//     salt: '0x' + (137).toString(16).padStart(64, '0')
// };

