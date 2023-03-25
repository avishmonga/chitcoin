import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import simple_token_abi from "../../../artifacts/contracts/OwnToken.sol/MyToken.json";
const Chitcoin = () => {
  const contractAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [defaultAccount, setDefaultAccount] = useState<String>();
  const [contract, setContract] = useState<object>();
  const [tokenSupply, setTokenSupply] = useState<Number>(0);
  const [balance, setBalance] = useState<Number>(0);
  const [alert, setAlert] = useState<string>("");
  const [inputNumber, setInputNumber] = useState<Number>(0);
  const updateState = async (contract: any) => {
    try {
      let bal = await contract.getBalance();
      bal = bal.toNumber();
      let supply = await contract.tokenSupply();
      setTokenSupply(supply);
      setBalance(bal);
    } catch (err) {
      console.log(err.stack);
    }
  };
  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result: string[]) => {
          accountChangedHandler(result[0]);
          setIsWalletConnected(true);
        })
        .catch((error: object) => {
          console.log("error", error);
        });
    } else {
      console.log("Need to install MetaMask");
    }
  };

  const accountChangedHandler = (newAccount: string) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const mintHandler = async () => {
    try {
      let a = await contract.mint(inputNumber);
      await updateState(contract);
      setAlert("transaction sucessful");
      console.log("transaction done");
      setInputNumber(0);
    } catch (err) {
      console.log(err);
    }
  };

  const burnHandler = async () => {
    try {
      await contract.burn(inputNumber);
      await updateState(contract);
      setAlert("transaction sucessful");
      console.log("transaction done");

      setInputNumber(0);
    } catch (err) {
      console.log(err);
    }
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    let tempSigner = tempProvider.getSigner();
    let tempContract = new ethers.Contract(
      contractAddress,
      simple_token_abi.abi,
      tempSigner
    );
    updateState(tempContract);
    setContract(tempContract);
  };
  return (
    <>
      {isWalletConnected ? (
        <>
          <div className="mt-4">
            <div className="flex font-mono font-bold text-xl text-orange-400 justify-between w-2/3 m-auto">
              <h3>{tokenSupply && `Token Supply: ${tokenSupply}`}</h3>
              <div className="flex gap-4">
                <h3>{`Balance: ${balance}`}</h3>
                <button
                  onClick={async () => {
                    await updateState(contract);
                  }}
                  className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] bg-orange-500"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="block max-w-sm rounded-lg bg-orange-400 p-6 shadow-lg dark:bg-neutral-700 mt-16 w-2/3">
                <input
                  value={inputNumber.toString()}
                  onChange={(e) => setInputNumber(+e.target.value)}
                  placeholder="Enter value"
                  className="peer block min-h-[auto]  rounded border-0 bg-white py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none  w-full text-black"
                  type="number"
                />
                <div className="flex justify-between">
                  <button
                    onClick={mintHandler}
                    className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] bg-green-500 mt-6"
                  >
                    Mint
                  </button>
                  <button
                    onClick={burnHandler}
                    className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] bg-red-500 mt-6"
                  >
                    Burn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center h-screen items-center">
          <button
            className="px-3 py-3 bg-orange-400 w-40 font-mono text-slate-700"
            onClick={connectWalletHandler}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </>
  );
};

export default Chitcoin;
