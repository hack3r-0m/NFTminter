require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}\
?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let collection;

async function run() {
  try {
    await client.connect();
    collection = await client.db("minter").collection("tokens");
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
		const { name, description, image, external_url } = req.body;
		const newDocument = {
			name: name,
			description: description,
			image: image,
			external_url: external_url,
			timestamp:
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
		const result = await collection.find({}).toArray();
		console.log(result);
		res.send(result);
	} catch(e) {
		console.log(e);
		res.sendStatus(400);
	}
});

app.listen(8080);
