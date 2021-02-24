import {Navbar, Form, Button, Alert} from 'react-bootstrap'
import Web3 from 'web3'
import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import logo from './polygon.svg'
import {pinJSONToIPFS, pinFileToIPFS} from './UploadMetaData'

const abi = require('./abi.json')

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(window.ethereum)
    window.ethereum.enable()

    const networkId = await web3.eth.net.getId()
    this.setState({networkId: networkId})


    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.contract = new web3.eth.Contract(abi, "0xD05a795d339886bB8Dd46cfe2ac009d7f1E48A64") 

    this.setState({ account: accounts[0] })
  }
    
  constructor(props) {
    super(props)
    this.state = {
        account: '',
        name: '',
        description: '',
        url: '',
        ipfshash: null,
        imageHash: null,
        txnhash: null,
        selectedFile: null,
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm = () =>{
  if (this.state.name == "" || this.state.description == "" || this.state.selectedFile == null ) {
    alert("Please fill out the details properply");
    return false;
    }
  else{
    this.setState({submitted: true})
    return true;
    }
  }

  handleInputChange(event) {

    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

   onFileChange = async event => {
    
      await this.setState({ selectedFile: event.target.files[0] })
      console.log(this.state.selectedFile)
    
    }

  handleSubmit = async event => {
    

    let temp = async () => {

      const resp_img = await pinFileToIPFS(this.state.selectedFile)
      this.setState({imageHash: resp_img})

      const hashval = await pinJSONToIPFS({
                    name: this.state.name,
                    description: this.state.description,
                    image: 'https://gateway.pinata.cloud/ipfs/' + this.state.imageHash,
                    external_url: this.state.url
                })
      this.setState({ipfshash: hashval})


      const txnhash = await this.contract.methods.mintToCaller(this.state.account, 
                            'https://gateway.pinata.cloud/ipfs/' + this.state.ipfshash)
                            .send({from: this.state.account}).then(
                                this.setState({done: true})
                            )
      this.setState({txnhash: txnhash.transactionHash})
      console.log(this.state.txnhash)

      
      return null
      }

    if(this.validateForm()){
        temp()
    }

    event.preventDefault();
  }

  render() {
    return (
  <>
    <Navbar bg="light">
        <Navbar.Brand href="#">
          <img
            src={logo}
            width="120px"
            height="45px"
            className="d-inline-block align-center"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>

        <Navbar.Text className="">
            <div className="topnav-centered">
                <a href="#">POLYGON NFT MINTER</a>
            </div>
       </Navbar.Text>

    </Navbar> 
     
    <div className="container">

      <Form name="myForm" onSubmit={this.handleSubmit}> 

          <Form.Group controlId="formText">
            <Form.Label>Name of NFT</Form.Label>
            <Form.Control type="text" name="name" value={this.state.name} placeholder="Mitra Hall of Fame #1" onChange={this.handleInputChange} />
          </Form.Group>

          <Form.Group controlId="formText">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" as="textarea" name="description" value={this.state.description} placeholder="Lorem Ipsum random words" onChange={this.handleInputChange} />
          </Form.Group>

         <Form.Group controlId="formText">
            <Form.Label>Social Media URL (optional)</Form.Label>
            <Form.Control type="text" name="url" value={this.state.url} placeholder="https://twitter.com/example" onChange={this.handleInputChange} />
         </Form.Group>

        <Form.Group>
            <Form.File id="exampleFormControlFile1" label="Image or Logo"  onChange={this.onFileChange} />
        </Form.Group>
        
        <Button variant="primary" type="submit">
            Submit
        </Button>

      </Form>

      <br/>

      {this.state.done ? null : this.state.submitted ? <p>Waiting...</p> : null }

      {this.state.imageHash && this.state.done ? <Alert variant="success"> <p> Image uploaded to IPFS successfully! </p> </Alert>: null } 
      {this.state.ipfshash && this.state.done ? <Alert variant="success"><p> Details uploaded to IPFS successfully! </p> </Alert>: null }

      <br/>

      {this.state.txnhash && this.state.done ? 
          this.state.networkId == 137 ? 
                    <a href={'https://explorer-mainnet.maticvigil.com/tx/' + this.state.txnhash} target="_blank">Txn Hash </a> 
                : <a href={'https://explorer-mumbai.maticvigil.com/tx/' + this.state.txnhash} target="_blank">Txn Hash </a>
          : null
      }
 
    </div>
        
  </> 
    );
  }

  

}



export default App;
