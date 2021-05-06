export const domainType = [{
    name: "name",
    type: "string"
  }, {
    name: "version",
    type: "string"
  }, {
    name: "salt",
    type: "uint256"
  }, {
    name: "verifyingContract",
    type: "address"
  }];

export const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "functionSignature", type: "bytes" }
];

export const domainData721 = {
    name: "POLYGON ERC721 NFT MINTER",
    version: "1",
    salt: 137,
    verifyingContract: "0x72B6Dc1003E154ac71c76D3795A3829CfD5e33b9"
  };

export const domainData1155 = {
    name: "POLYGON ERC1155 NFT MINTER",
    version: "1",
    salt: 137,
    verifyingContract: "0xfd1dBD4114550A867cA46049C346B6cD452ec919"
};
