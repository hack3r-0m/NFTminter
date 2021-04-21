import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { domainType, metaTransactionType, domainData721, domainData1155 } from '../utils/biconomy-vars';
import { getSignatureParameters, web3 } from './ConnectWallet';

import { pinJSONToIPFS, pinFileToIPFS, encodedParams } from '../utils/ipfs';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Form = ({
  signerAddress,
  contract_1155,
  contract_721,
  setIsLoading,
  setTrsHash,
  setErr,
  setOpen,
  setArkaneUrl
}) => {
  const classes = useStyles();

  // hooks
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [surl, setSurl] = useState('');
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [imgHash, setImgHash] = useState('');
  const [nftType, setNftType] = useState('ERC721');
  const [ercTwoNum, setErcTwoNum] = useState(1);
  const [errors, setErrors] = useState({
    name: "",
    desc: "",
    file: ""
  })

  // validate form
  const validateName = () => {
    if (name === "") {
      setErrors(pS => ({ ...pS, name: 'Name cannot be empty' }))
    } else {
      setErrors(pS => ({ ...pS, name: '' }))
    }
  }
  const validateDesc = () => {
    if (desc === "") {
      setErrors(pS => ({ ...pS, desc: 'Add description for your token' }))
    } else {
      setErrors(pS => ({ ...pS, desc: '' }))
    }
  }
  // handle file upload
  const handleFile = async (e) => {
    // console.log("object")
    if (e.target.files[0]?.size < 1e7) {
      setFile(e.target.files[0]);
      const cid = await pinFileToIPFS(e.target.files[0]);
      toast("File uploaded to IPFS", { type: "success" });
      console.log("IPFS imgHash", cid);
      setImgHash(cid);
      setErrors(pS => ({ ...pS, file: '' }))
      // console.log(e.target.files[0]?.size < 1e7)
      if (e.target.files.length !== 0) {
        const reader = new FileReader();
        reader.onload = e => {
          setImgSrc(e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setErrors(pS => ({ ...pS, file: 'File should be less than 10MB' }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    // if all req fields are avaialable
    if (name && desc && file && signerAddress && imgHash) {
      console.log("Submitting...")
      setIsLoading(true);
      setErr('');
      setTrsHash('');

      // Upload files on IPFS
      let ipfsHash = '';
      try {
        ipfsHash = await pinJSONToIPFS({
          name: name,
          description: desc,
          image: 'https://gateway.pinata.cloud/ipfs/' + imgHash,
          external_url: surl
        })
        toast("JSON data uploaded to IPFS", { type: "success" });
        console.log(ipfsHash)
      } catch (err) {
        console.log('Error Uploading files on IPFS', err);
        setOpen(true);
        setErr('Uploading files on IPFS failed');
      }

      if (nftType === 'ERC721') {

        let nonce = await contract_721.methods.getNonce(signerAddress).call();
        let functionSignature = contract_721.methods.mintToCaller(signerAddress, 'https://gateway.pinata.cloud/ipfs/' + ipfsHash).encodeABI();

        let message = {};
        message.nonce = parseInt(nonce);
        message.from = signerAddress;
        message.functionSignature = functionSignature;

        const dataToSign = JSON.stringify({
          types: {
            EIP712Domain: domainType,
            MetaTransaction: metaTransactionType
          },
          domain: domainData721,
          primaryType: "MetaTransaction",
          message: message
        });

        const rpc = {
          jsonrpc: "2.0",
          id: 999999999999,
          method: "eth_signTypedData_v4",
          params: [signerAddress, dataToSign]
        }

        const txnhash = await web3.currentProvider.sendAsync(
          rpc,
          async function (error, response) {
            //console.log(response)
            let { r, s, v } = getSignatureParameters(response.result);

            const tx = await contract_721.methods.executeMetaTransaction(signerAddress,
              functionSignature, r, s, v)
              .send({ from: signerAddress })
              .once("confirmation", (confirmationNumber, receipt) => {
                //console.log(confirmationNumber)
                //console.log(receipt)
                console.log('0x72B6Dc1003E154ac71c76D3795A3829CfD5e33b9/' + parseInt(receipt.events.Transfer.raw.topics[3]));
                setArkaneUrl('0x72B6Dc1003E154ac71c76D3795A3829CfD5e33b9/' + parseInt(receipt.events.Transfer.raw.topics[3]));
                setTrsHash(receipt.transactionHash);
              })
              .on("error", (error) => {
                console.log(error)
                setOpen(true);
                setErr('Transaction failed');
              })
            //console.log(tx)
            setIsLoading(false);
            toast("NFT Minted", { type: "success" });
          }
        )
      } else if (nftType === 'ERC1155') {

        contract_1155.handleRevert = true // https://web3js.readthedocs.io/en/v1.3.4/web3-eth.html#handlerevert

        let nonce = await contract_1155.methods.getNonce(signerAddress).call();
        let functionSignature = contract_1155.methods.mintTocaller(signerAddress, ercTwoNum, encodedParams, ipfsHash).encodeABI();

        let message = {};
        message.nonce = parseInt(nonce);
        message.from = signerAddress;
        message.functionSignature = functionSignature;

        const dataToSign = JSON.stringify({
          types: {
            EIP712Domain: domainType,
            MetaTransaction: metaTransactionType
          },
          domain: domainData1155,
          primaryType: "MetaTransaction",
          message: message
        });

        const rpc = {
          jsonrpc: "2.0",
          id: 999999999999,
          method: "eth_signTypedData_v4",
          params: [signerAddress, dataToSign]
        }

        const txnhash = web3.currentProvider.sendAsync(
          rpc,
          async function (error, response) {
            console.log(response)
            let { r, s, v } = getSignatureParameters(response.result);

            const tx = contract_1155.methods.executeMetaTransaction(signerAddress,
              functionSignature, r, s, v)
              .send({ from: signerAddress })
              .once("confirmation", (confirmationNumber, receipt) => {
                //console.log(confirmationNumber)
                //console.log(receipt)
                console.log('0xfd1dBD4114550A867cA46049C346B6cD452ec919/' + parseInt(receipt.events.TransferSingle.returnValues[3]));
                setArkaneUrl('0xfd1dBD4114550A867cA46049C346B6cD452ec919/' + parseInt(receipt.events.TransferSingle.returnValues[3]));
                setTrsHash(receipt.transactionHash);
              })
              .on("error", (error) => {
                console.log(error)
                setOpen(true);
                setErr('Transaction failed');
              })
            // console.log(tx)
            setIsLoading(false);
            toast("NFT Minted", { type: "success" });
          }
        )
      } else {
        validateName();
        validateDesc();
        setIsLoading(false);
        if (!signerAddress) {
          setOpen(true);
          setErr("Connect to wallet first");

          // } else if (networkId !== 80001 && networkId !== 137) {
          //   setOpen(true);
          //   setErr("");

        } else {
          setOpen(true);
          setErr("Enter all mandatory fields");
        }
      }
    }
  }

  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>

      {/* Left Container */}
      <div className={classes.uploadContainer}>
        <div style={{ margin: imgSrc ? '50px 0px' : '25% auto' }}>
          {
            imgSrc ?
              <div><img src={imgSrc} className={classes.previewImg} alt="preview-img" /></div>
              :
              <img src="img/upload.svg" alt="upload" />
          }
          {
            !imgSrc &&
            <React.Fragment>
              <Typography variant="h6" className={classes.uploadTitle}>
                Upload your file here
              </Typography>
              <Typography variant="h6" className={classes.uploadTitle2}>
                JPG, PNG, MP4, PDF or HTML  videos accepted.
                10MB limit.
              </Typography>
            </React.Fragment>
          }
          <input accept="audio/*, video/*, image/*, .html, .pdf" id="upload-file" onChange={handleFile} type='file' hidden />
          <label htmlFor="upload-file">
            <Button component="span" className={classes.uploadBtn}>
              {file ? file.name : 'Click to upload'}
            </Button>
          </label>
          {errors.file &&
            <Typography variant="h6" className={classes.errUpload}>
              {errors.file}
            </Typography>
          }
        </div>
      </div>

      {/* Divider Line */}
      <div className={classes.divider}></div>

      {/* Right Side Container */}
      <div className={classes.rightContainer}>
        <div className={classes.formTitle}>
          <label className={classes.formTitleLabel}>Title</label>
          <input
            type="text"
            style={{ border: errors.name ? '1px solid tomato' : '1px solid black' }}
            placeholder="Hall of Fame"
            className={classes.formGroupInput}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErr('')
              setErrors(pS => ({ ...pS, name: '' }))
            }}
            onBlur={validateName}
            required
          />
          {errors.name && <p className={classes.error}>{errors.name}</p>}
        </div>
        <div className={classes.formTitle}>
          <label className={classes.formTitleLabel}>Description</label>
          <textarea
            type="text"
            style={{ border: errors.desc ? '1px solid tomato' : '1px solid black' }}
            className={classes.formGroupInputDesc}
            value={desc}
            placeholder="A description about your NFT"
            onChange={(e) => {
              setErrors(pS => ({ ...pS, desc: '' }));
              setErr('')
              setDesc(e.target.value)
            }}
            onBlur={validateDesc}
            required
          ></textarea>
          {errors.desc && <p className={classes.error}>{errors.desc}</p>}
        </div>

        <div className={classes.formType}>
          <div className={classes.formTypeBtnGroup}>
            <label className={classes.formTitleLabel}>NFT Type</label>
            <div className={classes.btnGrp}>
              <Button
                className={classes.formTypeButton}
                disabled={nftType === 'ERC721' ? true : false}
                onClick={() => {
                  setErcTwoNum(1);
                  setNftType('ERC721')
                }}>
                ERC721
              </Button>
              <Button className={classes.formTypeButton}
                disabled={nftType === 'ERC1155' ? true : false}
                onClick={() => setNftType('ERC1155')}>
                ERC1155
              </Button>
            </div>
          </div>
          <div className={classes.formTitle}>
            <label className={classes.formTitleLabel}>Quantity</label>
            <input
              type="number"
              placeholder="1"
              disabled={nftType === 'ERC1155' ? false : true}
              className={classes.formGroupInput}
              value={ercTwoNum}
              onChange={(e) => setErcTwoNum(e.target.value)}
            />
          </div>
        </div>
        <div className={classes.formTitle}>
          <label className={classes.formTitleLabel}>Social Media URL (optional)</label>
          <input
            type="url"
            placeholder="https://twitter.com/example"
            className={classes.formGroupInput}
            value={surl}
            pattern="https?://.+"
            onChange={(e) => setSurl(e.target.value)}
          />
        </div>

        <div className={classes.lastSec}>
          <div className={classes.note}>
            Once your NFT is minted on the Polygon blockchain, you will not
            be able to edit or update any of its information.
          </div>
          <Button type="submit" disabled={imgHash ? false : true} className={classes.submit}>Submit</Button>
        </div>
      </div>

    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    },
  },
  uploadContainer: {
    width: '48%',
    height: 550,
    backgroundColor: '#F3F4F7',
    borderRadius: 20,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: 'max-content',
    },
  },
  // uploadContainerCenter: {
  //   margin: '25% auto',
  //   [theme.breakpoints.down('md')]: {
  //     margin: 20,
  //   },
  // },
  previewImg: {
    maxWidth: 400,
    maxHeight: 400,
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: 500,
  },
  uploadTitle2: {
    maxWidth: 300,
    textAlign: 'center',
    margin: 'auto',
    fontSize: 16,
    fontWeight: 400,
  },
  uploadBtn: {
    maxWidth: 300,
    background: '#061024',
    padding: '10px 16px',
    fontSize: 16,
    color: '#FFFFFF',
    borderRadius: 37,
    margin: '20px auto',
    '&:hover': {
      background: '#061024',
    }
  },
  errUpload: {
    maxWidth: 300,
    textAlign: 'center',
    margin: 'auto',
    color: 'tomato',
    fontSize: 16,
    fontWeight: 400,
  },
  // uploadBtnName: {
  //   overflow: 'hidden',
  //   textOverflow: 'ellipsis',
  //   whiteSpace: 'nowrap',
  // },

  divider: {
    border: '1px solid #DCDFE6',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
  },

  rightContainer: {
    width: '48%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  formTitle: {
    margin: '0 auto 1rem auto',
    padding: '0.25rem'
  },
  formTitleLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 10
  },
  formGroupInput: {
    width: '100%',
    height: 54,
    fontSize: 16,
    padding: '0.3rem 0.75rem',
    border: '1px solid black',
    borderRadius: '0.25rem',
    outline: 'none',
  },
  formGroupInputDesc: {
    resize: 'none',
    width: '100%',
    height: 100,
    fontSize: 16,
    margin: 0,
    padding: '1.1rem 0.75rem',
    borderRadius: '0.25rem',
    outline: 'none',
  },

  formType: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  formTypeBtnGroup: {
    margin: 0,
    padding: 0
  },
  btnGrp: {
    display: 'flex',
    height: 52,
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F7',
    padding: 4,
    margin: 'auto',
    borderRadius: 8
  },
  formGroupFile: {
    display: 'flex'
  },
  formTypeButton: {
    width: 102,
    height: 44,
    marginRight: 4,
    fontSize: 17,
    letterSpacing: "-0.01em",
    border: 0,
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: '#F3F4F7',
    '&:hover': {
      backgroundColor: '#fffafa',
    },
    "&:disabled": {
      backgroundColor: '#FFFFFF',
      border: 0,
      color: 'rgba(0, 0, 0, 1)',
      boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
    }
  },
  lastSec: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      display: 'block',
      margin: '30px 0'
    },
  },
  note: {
    color: '#6E798F',
    maxWidth: 370,
    margin: 'auto 0',
    [theme.breakpoints.down('md')]: {
      margin: 'auto',
      marginBottom: 20
    },
  },
  submit: {
    background: '#8247E5',
    padding: '11px 30px',
    fontSize: 16,
    color: '#FFFFFF',
    borderRadius: 37,
    marginTop: 10,
    '&:hover': {
      background: '#8247E5',
    },
    '&:disabled': {
      background: '#9c67f5',
    }
  },
  error: {
    margin: '2px 0px',
    textAlign: 'left',
    color: 'tomato'
  },
}));

export default Form;
