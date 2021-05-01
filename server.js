require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
const MongoClient = require('mongodb').MongoClient;
const ERC721ABI = require('./config/erc721.json');
const ERC1155ABI = require('./config/erc721.json');

var web3 = new Web3("https://rpc-mainnet.maticvigil.com");
var account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const ERC721 = new web3.eth.Contract(ERC721ABI, "0x36a8377E2bB3ec7D6b0F1675E243E542eb6A4764");
const ERC1155 = new web3.eth.Contract(ERC1155ABI, "0x2AFa1b13D2dF7Da8C7942e7Dc14432d4fFD7e459");

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}\
?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const encodedParams = "0x485f0f700000000000000000000000000000000000000000000000000000000000ad253b0000000000000000000000\
00000000000000000000000000000000000013081b00000000000000000000000000000000000000000000000000000000000000600000000000000\
000000000000000000000000000000000000000000000000008676976656e55524c000000000000000000000000000000000000000000000000";

let collection;

async function run() {
  try {
  	console.log("Starting DB connection...");
    await client.connect();
    collection = await client.db("minter").collection("tokens");
    console.log("DB ready");
  } catch(e) {
  	console.log(e);
  }
}

run();

var app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/add', async function (req, res) {
	try {
		const { address, name, description, image, external_url, uri, type, count } = req.body;
		const newDocument = {
			minter: minter,
			name: name,
			description: description,
			image: image,
			external_url: external_url,
			uri: uri,
			type: type, // ERC721 or ERC1155
			count: count,
			timestamp: Date.now()
		}
		const result = await collection.insertOne(newDocument);
		res.send(result);
	} catch(e) {
		console.log(e);
		res.sendStatus(400);
	}
});

app.get('/all', async function (req, res) {
	try {
		const result = await collection.find({}, {sort: { timestamp: 1 }}).toArray();
		console.log(result);
		res.send(result);
	} catch(e) {
		console.log(e);
		res.sendStatus(400);
	}
});

app.post('/approve', async function (req, res) {
	try {
		const { id } = req.body;
		const item = await collection.findOne({_id: id});
		let status;
		if(item.type === "ERC721")
			status = await ERC721.methods.mintTocaller(item.minter, item.uri).send({from: account.address});
		else if(item.type === "ERC1155")
			status = await ERC1155.methods.mintTocaller(
				item.minter, item.count, encodedParams, item.uri).send({from: account.address}
			);
		const result = await collection.deleteOne({_id: id});
		console.log(status);
		res.send(result);
	} catch(e) {
		console.log(e);
		res.sendStatus(400);
	}
});

app.post('/decline', async function (req, res) {
	try {
		const { id } = req.body;
		// unpin from IPFS
		const result = await collection.deleteOne({_id: id});
		console.log(result);
		res.send(result);
	} catch(e) {
		console.log(e);
		res.sendStatus(400);
	}
});

app.post('/mint', async function (req, res) {
	try {
		// direct mints; approval-less content
		res.send();
	} catch(e) {
		console.log(e);
		res.sendStatus(400);
	}
});

app.listen(8080);
