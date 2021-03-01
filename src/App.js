import {Navbar, Form, Button, Alert, ToggleButtonGroup, ToggleButton} from 'react-bootstrap'
import Web3 from 'web3'
import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
import logo from './polygon.svg'
import {pinJSONToIPFS, pinFileToIPFS} from './UploadMetaData'

const abi = require('./abi.json')
const abi_1155 = require('./abi_1155.json')


const MAINNET_1155 = "0xd52a86110c9a7597a057Ae2bB4F577B6CD42a639"
const TESTNET_1155 = "0x692d14f95012778aBb720Be8510f8eAeEaf74F44"

class App extends Component {

  componentWillMount() {
    //this.loadBlockchainData()
  }

  loadBlockchainData= async () =>  {
    const web3 = new Web3(window.ethereum)
    await window.ethereum.enable()

    const networkId = await web3.eth.net.getId()
    this.setState({networkId: networkId})

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    this.setState({ account: accounts[0] })

    // for erc721 mainnet and testnet
    this.contract = new web3.eth.Contract(abi, "0xD05a795d339886bB8Dd46cfe2ac009d7f1E48A64")

    // for erc1155 mainnet
    if(this.state.networkId == "137"){
        this.contract_1155 = new web3.eth.Contract(abi_1155, MAINNET_1155)
    // for erc1155 testnet
    }else{
        this.contract_1155 = new web3.eth.Contract(abi_1155, TESTNET_1155)
    }

    if(web3){
        this.setState({authorized: true})
        console.log(this.state.authorized)
    }
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
        quantity: 1
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
  }

  validateForm = () =>{

      if(this.state.name == "" || this.state.description == "" || this.state.selectedFile == null ) {
        alert("Please fill out the details properply");
        return false;
        }
      else if(!this.state.authorized || !(this.state.networkId == "137" || this.state.networkId == "80001" ) ){
        alert("web3 provider is not connected")
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

    console.log(this.state.quantity)
  }

   onFileChange = async event => {
    
      await this.setState({ selectedFile: event.target.files[0] })
      console.log(this.state.selectedFile)
    
    }

   onValueChange(event) {

    console.log(event)
    this.setState({
      selectedOption: event.target.value
        })

    console.log(this.state.selectedOption)
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

      if(this.state.selectedOption == "erc1155"){

        const encodedParams = "0x485f0f700000000000000000000000000000000000000000000000000000000000ad253b000000000000000000000000000000000000000000000000000000000013081b00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000008676976656e55524c000000000000000000000000000000000000000000000000"

        const txnhash = await this.contract_1155.methods.mintTocaller(
                        this.state.account,
                        this.state.quantity,
                        encodedParams,
                        this.state.ipfshash
                            )
                        .send({from: this.state.account})
                        .on("confirmation", (confirmationNumber, receipt) => {
                            console.log(receipt)
                            this.setState({done: true})
                            })
                        .on("error", (error, receipt) => {
                                this.setState({failed: true})
                            })

        console.log(txnhash)
        if(this.state.done){
            this.setState({txnhash: txnhash.transactionHash})
            console.log(this.state.txnhash)
        }else{
            this.setState({failed: true})
            }

      }else{
        
        const txnhash = await this.contract.methods.mintToCaller(this.state.account, 
                            'https://gateway.pinata.cloud/ipfs/' + this.state.ipfshash)
                            .send({from: this.state.account})
                            .on("confirmation", (confirmationNumber, receipt) => {
                                console.log(receipt)
                                this.setState({done: true})
                                })
                            .on("error", (error, receipt) => {
                                    this.setState({failed: true})
                                })

        console.log(txnhash)
        if(this.state.done){
            this.setState({txnhash: txnhash.transactionHash})
            console.log(this.state.txnhash)
        }else{
            this.setState({failed: true})
            }                    
      }
      
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

      <Button variant="primary" className="float-right" onClick={this.loadBlockchainData}>Connect to Web3</Button>
      <br/><br/>
      {this.state.authorized ? 
          this.state.networkId == "137" || this.state.networkId == "80001" ? 
                <p>{this.state.account}</p> 
            : <p className="float-right">Please change network to MATIC mainnet or Testnet and click "Connect To Web3"</p>
        : <p className="float-right">web3 is not connected</p> }

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

        <Form.Group>
            <ToggleButtonGroup type="radio" name="options" defaultValue="erc721" >
                <ToggleButton value="erc721" onChange={this.onValueChange}>ERC721</ToggleButton>
                <ToggleButton value="erc1155" onChange={this.onValueChange}>ERC1155</ToggleButton>
            </ToggleButtonGroup>
        </Form.Group>

        {this.state.selectedOption == "erc1155" ?
                <Form.Group>
                    <Form.Label>Quantity: </Form.Label>
                    <input type="number" value={this.state.quantity} onChange={this.handleInputChange} name="quantity" min="1" max="200"/>
                </Form.Group>

            : null
        }
                
        <Button variant="primary" type="submit">
            Submit
        </Button>

      </Form>

      <br/>

      {this.state.done || this.state.failed ? null : this.state.submitted ? <p>Waiting...</p> : null }

      {this.state.imageHash && this.state.done ? <Alert variant="success"> <p> Image uploaded to IPFS successfully! </p> </Alert>: null } 
      {this.state.ipfshash && this.state.done ? <Alert variant="success"><p> Details uploaded to IPFS successfully! </p> </Alert>: null }

      {this.state.failed && !this.state.done ? <Alert variant="danger"><p> Transaction Failed or cancelled </p> </Alert>: null }

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
