import Web3 from "web3";
import { fromWei } from "web3-utils";

async function createContract (contractDetails, customProvider=null) {
    try {
        let web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(contractDetails.abi, contractDetails.address);
        if (customProvider) {
            contract.setProvider(customProvider);
        }
        return contract;
    } catch (e) {
        console.log(e);
    }
}

async function getTowerBalance (contract, targetWalletAddress) {
    try {
        console.log("getTowerBalance");
        let balance = await contract.methods.balanceOf(targetWalletAddress).call();
        let bal = Number(fromWei(balance));
        return bal;
    } catch (err) {
        console.log("Unable to fetch TOWER balance.");
    }
}

async function signMessage (signMessage, signerAddress) {
    try {
        let web3 = new Web3(window.ethereum);
        const signature = await web3.eth.personal.sign(signMessage, signerAddress, undefined);
        return signature;
    } catch (err) {
        console.log("Error siging message");
    }
}

async function approveTowerSpender (contract, spenderAddress, amount, requesterAddress) {
    try {
        const tx = await contract.methods.approve(spenderAddress, amount).send({
            from: requesterAddress,
        });

        if (tx?.status && tx?.transactionHash) {
            return tx;
        }
    } catch (err) {
        console.log("Error siging message");
    }
}

export {
    createContract,
    getTowerBalance,
    signMessage,
    approveTowerSpender,
}