import React, { useState, useEffect } from 'react';
import Web3 from 'web3'

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Paper from "@material-ui/core/Paper";
import { makeStyles } from '@material-ui/core/styles';

import { pinJSONToIPFS, pinFileToIPFS, encodedParams } from '../utils/ipfs';

const abi = require('../config/abi.json');
const abi_1155 = require('../config/abi_1155.json');

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const Form = ({ signerAddress, contract_1155, contract_721, setIsLoading, setTrsHash, setErr, networkId, setOpen }) => {
  const classes = useStyles();

  // hooks
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [surl, setSurl] = useState('');
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
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
  const handleFile = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files.length !== 0) {
      const reader = new FileReader();
      reader.onload = e => {
        setImgSrc(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }


  const onSubmit = async (e) => {
    e.preventDefault();

    if (name && desc && file && signerAddress && (networkId === 80001 || networkId === 137)) {
      setIsLoading(true);
      setErr('');
      setTrsHash('');

      const imgHash = await pinFileToIPFS(file);
      toast("File uploaded to IPFS", { type: "success" });

      const ipfsHash = await pinJSONToIPFS({
        name: name,
        description: desc,
        image: 'https://gateway.pinata.cloud/ipfs/' + imgHash,
        external_url: surl
      })
      toast("JSON data uploaded to IPFS", { type: "success" });
      console.log(ipfsHash)

      if (nftType === 'ERC721') {
        const txnhash = await contract_721.methods.mintToCaller(signerAddress, 'https://gateway.pinata.cloud/ipfs/' + ipfsHash)
          .send({ from: signerAddress })
          .on("confirmation", (confirmationNumber, receipt) => { })
          .on("error", (error, receipt) => {
            setErr("Transaction Failed")
          })

        setTrsHash(txnhash.transactionHash);
        console.log(txnhash.transactionHash);

      } else if (nftType === 'ERC1155' && networkId === 80001) {
        const txnhash = await contract_1155.methods.mintTocaller(signerAddress, ercTwoNum, encodedParams, ipfsHash)
          .send({ from: signerAddress })
          .on("confirmation", (confirmationNumber, receipt) => { })
          .on("error", () => setErr("Transaction Failed"))

        setTrsHash(txnhash.transactionHash);
        console.log(txnhash.transactionHash);

      } else if (nftType === 'ERC1155' && networkId === 137) {
        const txnhash = await contract_1155.methods.mintTocaller(signerAddress, ercTwoNum, encodedParams, ipfsHash)
          .send({ from: signerAddress, gasPrice: "1000000000", gas: 35000 })
          .on("confirmation", () => { })
          .on("error", (error, receipt) => {
            setErr("Transaction Failed");
          })

        setTrsHash(txnhash.transactionHash);
        console.log(txnhash.transactionHash);
      }

      toast("NFT Minted", { type: "success" });
      setIsLoading(false);
    } else {
      validateName();
      validateDesc();
      if (signerAddress && (networkId !== 80001 && networkId !== 137)) {
        setOpen(true);
        setErr("Wallet not found");
      } else
        setErr("Enter all mandatory fields");
    }
  }


  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={onSubmit}>
      <div className={classes.formGroup}>
        <label className={classes.formGroupLabel}>Name of NFT</label>
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
      <div className={classes.formGroup}>
        <label className={classes.formGroupLabel}>Description</label>
        <input
          type="text"
          style={{ border: errors.desc ? '1px solid tomato' : '1px solid black' }}
          placeholder="This is description of NFT"
          className={classes.formGroupInput}
          value={desc}
          onChange={(e) => {
            setErrors(pS => ({ ...pS, desc: '' }));
            setErr('')
            setDesc(e.target.value)
          }}
          onBlur={validateDesc}
          required
        />
        {errors.desc && <p className={classes.error}>{errors.desc}</p>}
      </div>
      <div className={classes.formGroup}>
        <label className={classes.formGroupLabel}>Social Media URL (optional)</label>
        <input
          type="url"
          placeholder="https://twitter.com/example"
          className={classes.formGroupInput}
          value={surl}
          pattern="https?://.+"
          onChange={(e) => setSurl(e.target.value)}
        />
      </div>

      <div className={classes.endCont}>

        <div className={classes.formGroup} style={{ margin: '0.5rem 0' }}>
          <label className={classes.formGroupLabel}>Add Logo for your NFT</label>
          <div className={classes.formGroupFile}>
            <input accept="image/*" id="upload-company-logo" onChange={handleFile} type='file' hidden />
            <label htmlFor="upload-company-logo">
              <Button component="span" >
                <Paper elevation={5}>
                  <Avatar src={imgSrc} className={classes.avatar} variant='rounded' />
                </Paper>
              </Button>
            </label>
          </div>
          {file && <p>{file.name}</p>}
        </div>

        <div className={classes.formGroup} style={{ margin: '0.5rem 0', minHeight: 122 }}>
          <label className={classes.formGroupLabel}>Type of NFT</label>
          <div style={{ display: 'flex' }}>
            <Button
              className={classes.typeButton}
              disabled={nftType === 'ERC721' ? true : false}
              onClick={() => setNftType('ERC721')}
            >
              ERC721
          </Button>
            <Button className={classes.typeButton}
              disabled={nftType === 'ERC1155' ? true : false}
              onClick={() => setNftType('ERC1155')}
            >
              ERC1155
            </Button>
          </div>

          {nftType === 'ERC1155' && <div className={classes.quant}>
            Quantity
            <input
              type="number"
              placeholder="1"
              className={classes.quantInput}
              value={ercTwoNum}
              onChange={(e) => setErcTwoNum(e.target.value)}
            />
          </div>}
        </div>

      </div>

      <Button type="submit" className={classes.submit}>Submit</Button>
    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  error: {
    margin: '2px 0px',
    textAlign: 'left',
    color: 'tomato'
  },
  formGroup: {
    margin: '0 auto 1rem auto',
    padding: '0.25rem'
  },
  formGroupLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.125rem',
    marginBottom: '0.5rem'
  },
  formGroupInput: {
    display: 'block',
    width: '100%',
    height: '2.375rem',
    padding: '0.375rem 0.75rem',
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    backgroundClip: 'padding-box',
    border: '1px solid black',
    borderRadius: '0.25rem',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    'hover': {

    }
  },
  endCont: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    },
  },
  formGroupFile: {
    display: 'flex'
  },
  formGroupFileImg: {
    marginRight: 20
  },
  typeButton: {
    marginRight: 10,
    border: `2px solid ${theme.custom.palette.btn}`,
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: theme.custom.palette.btn,
    '&:hover': {
      background: theme.custom.palette.btn,
    },
    "&:disabled": {
      border: `2px solid ${theme.palette.text.primary}`,
      color: 'rgba(0, 0, 0, 1)'
    }
  },
  quant: {
    margin: 0,
    marginTop: 10,
    fontSize: 16,
    textAlign: 'left'
  },
  quantInput: {
    width: '80px',
    marginLeft: 10,
    padding: '0.375rem 0.75rem',
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    backgroundClip: 'padding-box',
    border: '1px solid black',
    borderRadius: '0.25rem',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    'hover': {

    }
  },
  submit: {
    backgroundColor: theme.custom.palette.btn,
    padding: '10px 16px',
    fontSize: 18,
    '&:hover': {
      background: theme.custom.palette.btn,
      // border: `2px solid ${theme.palette.text.primary}`,
    }
  }
}));

export default Form;
