const axios = require('axios');
const FormData = require('form-data');


export const pinJSONToIPFS = ( JSONBody ) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: "f9445edc1e659038580f",
                pinata_secret_api_key:"88103f3a2572a20d9ccbbd251171a7c61fe1e78515072a74bdf7e34c5980f160" 
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
                pinata_api_key: "f9445edc1e659038580f",
                pinata_secret_api_key:"88103f3a2572a20d9ccbbd251171a7c61fe1e78515072a74bdf7e34c5980f160"
        }})
        .then(function (response) {
            const y = response.data.IpfsHash
            return y
        })
        .catch(function (error) {
           console.log(error) 
        });
}
