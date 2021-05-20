require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Web3 = require("web3");
const { MongoClient, ObjectId } = require('mongodb');
const { nanoid } = require("nanoid");
const cookieParser = require("cookie-parser");
const ERC721ABI = require("./config/erc721.json");
const ERC1155ABI = require("./config/erc1155.json");
const ERC721V1ABI = require("./config/erc721_v1.json");
const ERC1155V1ABI = require("./config/erc1155_v1.json");

var web3 = new Web3("https://rpc-mainnet.maticvigil.com");
var account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const ERC721 = new web3.eth.Contract(
  ERC721ABI,
  "0x36a8377E2bB3ec7D6b0F1675E243E542eb6A4764"
);
const ERC1155 = new web3.eth.Contract(
  ERC1155ABI,
  "0x2AFa1b13D2dF7Da8C7942e7Dc14432d4fFD7e459"
);
const ERC721_v1 = new web3.eth.Contract(
  ERC721V1ABI,
  "0x72B6Dc1003E154ac71c76D3795A3829CfD5e33b9"
);
const ERC1155_v1 = new web3.eth.Contract(
  ERC1155V1ABI,
  "0xfd1dBD4114550A867cA46049C346B6cD452ec919"
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}\
?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const encodedParams =
  "0x485f0f700000000000000000000000000000000000000000000000000000000000ad253b0000000000000000000000\
00000000000000000000000000000000000013081b00000000000000000000000000000000000000000000000000000000000000600000000000000\
000000000000000000000000000000000000000000000000008676976656e55524c000000000000000000000000000000000000000000000000";

let collection, addresses;

async function run() {
  try {
    console.log("Starting DB connection...");
    await client.connect();
    const db = await client.db("minter");
    collection = db.collection("tokens");
    addresses = db.collection("addresses");
    console.log("DB ready!");
  } catch (e) {
    console.log(e);
  }
}

run();

var app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({credentials: true, origin: ["https://mintnft.today", "http://localhost:3000", "http://localhost"]}));

app.get("/", async function (req, res) {
  res.send("NFT Minter Admin API");
});

app.get("/nonce", async function (req, res) {
  try {
    const count = await addresses.countDocuments(
      { address: req.query.address },
      { limit: 1 }
    );
    if (count == 0) {
      res.sendStatus(403);
      return;
    }
    res.send(await generate_nonce(req.query.address));
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post("/authenticate", async function (req, res) {
  try {
    const { address, signature } = req.body;
    var result = await addresses.findOne({ address: address });
    console.log(result);
    if (result.nonce === undefined) {
      res.sendStatus(403);
      return;
    }
    const account = await web3.eth.accounts.recover(result.nonce, signature);
    if (account !== address) {
      res.sendStatus(403);
      return;
    }
    const token = nanoid();
    var result = await addresses.updateOne(
      { address: address },
      { $set: { token: token } }
    );
    res.cookie("address", address, {
      maxAge: 604800000,
      sameSite: true,
      httpOnly: false,
    });
    res.cookie("token", token, {
      maxAge: 604800000,
      sameSite: true,
      httpOnly: false,
    });
    res.send(token);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post("/logout", auth, async function (req, res) {
  try {
    const result = await addresses.updateOne({ "address": req.headers.address },
      { $unset: { nonce: "", token: "", expires: "" } });
    res.clearCookie("address");
    res.clearCookie("token");
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post("/add", async function (req, res) {
  try {
    const {
      minter,
      name,
      description,
      image,
      external_url,
      uri,
      type,
      count,
    } = req.body;
    const newDocument = {
      minter: minter,
      name: name,
      description: description,
      image: image,
      external_url: external_url,
      uri: uri,
      type: type, // ERC721 or ERC1155
      count: count,
      timestamp: Date.now(),
    };
    const result = await collection.insertOne(newDocument);
    res.send(result.data);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post("/mint", async function (req, res) {
  try {
    const { minter, uri, count, type } = req.body;
    let status;
    if (type === "ERC721")
      status = await ERC721.methods.mintToCaller(minter, uri).send({ from: account.address, gas: 500000 });
    else if (type === "ERC1155")
      status = await ERC1155.methods.mintTocaller(
        minter, count, encodedParams, uri).send({ from: account.address, gas: 500000 }
        );
    res.send(status);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.get("/all", auth, async function (req, res) {
  try {
    const result = await collection.find({}, { sort: { timestamp: 1 }, limit: 10 }).toArray();
    res.send(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.get("/all/:page(\\d+)", auth, async function (req, res) {
  try {
    const result = await collection.find({}, {
      sort: { timestamp: 1 }, limit: 10, skip: (parseInt(req.params.page) - 1) * 10
    }
    ).toArray();
    res.send(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post("/approve", auth, async function (req, res) {
  try {
    const { id } = req.body;
    const item = await collection.findOne({ _id: ObjectId(id) });
    let status;
    if (item.type === "ERC721")
      status = await ERC721_v1.methods
        .mintToCaller(item.minter, item.uri)
        .send({ from: account.address, gas: 500000 });
    else if (item.type === "ERC1155")
      status = await ERC1155_v1.methods
        .mintTocaller(item.minter, item.count, encodedParams, item.uri)
        .send({ from: account.address, gas: 500000 });
    const result = await collection.deleteOne({ _id: ObjectId(id) });
    res.send(status);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

app.post("/decline", auth, async function (req, res) {
  try {
    const { id } = req.body;
    // unpin from IPFS
    const result = await collection.deleteOne({ _id: ObjectId(id) });
    console.log(result);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

async function auth(req, res, next) {
  const result = await addresses.findOne(
    { address: req.headers.address, token: req.headers.token },
    { _id: 0 }
  );
  if (result === null) {
    res.sendStatus(401);
    return;
  } else if (result.expires < Date.now() || result.expires === undefined) {
    res.status(401).send(await generate_nonce(req.headers.address));
    return;
  }
  next();
}

async function generate_nonce(address) {
  const nonce = `I am signing this nonce: ${nanoid()}`;
  const result = await addresses.updateOne(
    { address: address },
    { $set: { nonce: nonce, expires: Date.now() + 604800000 } }
  );
  return nonce;
}

app.listen(process.env.PORT || 8080, () => {
  console.log("Server starting on port 8080...")
});
