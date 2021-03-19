const axios = require('axios');
const FormData = require('form-data');

export const pinJSONToIPFS = (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: REACT_APP_IPFS_API_KEY,
        pinata_secret_api_key: REACT_APP_IPFS_API_SECRET
      }
    })
    .then(function (response) {
      const x = response.data.IpfsHash
      return x
    })
    .catch(function (error) {
      console.error(error)
    });
}

export const pinFileToIPFS = (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append('file', file)

  return axios
    .post(url, data, {
      maxContentLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: '345afdb6208614d7c9b1',
        pinata_secret_api_key: 'fd4b7f422d0ebd1b6f81f4c476a68b5bbd4f8dfcca23dc95844f2e8eaab87a79'
      }
    })
    .then(function (response) {
      const y = response.data.IpfsHash
      return y
    })
    .catch(function (error) {
      console.log(error)
    });
}

export const encodedParams = "0x485f0f700000000000000000000000000000000000000000000000000000000000ad253b000000000000000000000000000000000000000000000000000000000013081b00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008676976656e55524c000000000000000000000000000000000000000000000000"
