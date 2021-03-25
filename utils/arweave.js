const Arweave = require("arweave");
const key = require("./key");
const testFile = require("./test"); // testing this file for uploading

async function sendToArweave(metadata) {
    const options = {
        host: "arweave.net",
        port: 443,
        protocol: "https",
        timeout: 20000,
        logging: false,
    };

    const arweave = Arweave.init(options);

    const transaction = await arweave.createTransaction(
        {
            data: Buffer.from(JSON.stringify(metadata)),
        },
        key
    );
    transaction.addTag("Content-Type", "application/json");
    // transaction.addTag('key2', 'value2'); for ArQL searching

    await arweave.transactions.sign(transaction, key);
    // console.log(transaction); for debugging

    // if file is big, use chunk uploading.
    //let uploader = await arweave.transactions.getUploader(transaction);

    // while (!uploader.isComplete) {
    //     await uploader.uploadChunk();
    //     console.log(
    //         `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    //     );
    // }

    const response = await arweave.transactions.post(transaction);

    console.log(response);
    console.log(response.status);
    // If not 200 then throw

    return transaction.id;
    // unique_id stirng, view transaction at: https://viewblock.io/arweave/tx/:id
    // view uploaded contents at: https://arweave.net/:id
}

sendToArweave(testFile);
