const axios = require('axios');
const FormData = require('form-data');


export const pinJSONToIPFS = ( JSONBody ) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: process.env.IPFS_API_KEY,
                pinata_secret_api_key: process.env.IPFS_API_SECRET
            }
        })
        .then(function (response) {
            const x = response.data.IpfsHash
            return x
        })
        .catch(function (error){
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
                pinata_api_key: process.env.IPFS_API_KEY,
                pinata_secret_api_key: process.env.IPFS_API_SECRET
        }})
        .then(function (response) {
            const y = response.data.IpfsHash
            return y
        })
        .catch(function (error) {
           console.log(error) 
        });
}
