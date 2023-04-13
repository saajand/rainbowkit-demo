import React, { useEffect, useState } from 'react';
import '../stylings/Home.css';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react';

import {
	ConnectButton,
	useConnectModal,
	useAccountModal,
	useChainModal,
} from "@rainbow-me/rainbowkit";

import {
    useProvider,
    useAccount,
    useNetwork,
} from 'wagmi';
import { disconnect } from '@wagmi/core'
import { approveTowerSpender, createContract } from '../services/HomeServices';

const Home = () => {
    const { openConnectModal } = useConnectModal();
	const { openAccountModal } = useAccountModal();
	const { openChainModal } = useChainModal();

    const provider = useProvider();
    console.log(provider)

    const { address } = useAccount();
    const accObj = useAccount();
    const { chain } = useNetwork();
    const {
        handleLogOut,
        setShowAuthFlow,
        showAuthFlow,
        primaryWallet,
        network,
        networkConfigurations
      } = useDynamicContext();
    
      const [balance, setBalance] = useState(null);
      const [chainName, setChainName] = useState("");
      const [messageValue, setMessageValue] = useState('');
      const [spenderAddress, setSpenderAddress] = useState('');
    
      useEffect(() => {
        const fetchBalance = async () => {
          if (primaryWallet) {
            const value = await primaryWallet.connector.getBalance();
            setBalance(value);
          }
          
        };
        fetchBalance();
        if (networkConfigurations) {
            networkConfigurations.evm.map((value) => {
                if (value.chainId === network) {
                    setChainName(value.chainName)
                }
            })
        }
      }, [primaryWallet, network]);

    console.log(accObj)

    useEffect(() => {
        console.log("address", address);
        console.log("network chain", chain);
    }, [address, chain]);

    const signMessage = async () => {
        try {
            if (!primaryWallet) return;
        
            const signer = await primaryWallet.connector.getSigner();
        
            if (!signer) return;
        
            const signature = await signer.signMessage(messageValue);
        
            console.log('signature', signature);
        } catch (error) {
            console.log(error);
        }
    };

    // const handleApprove = async () => {
    //     if (!primaryWallet) return;
    //     const signer = await primaryWallet.connector.getSigner();
    //     if (!signer) return;
    //     const provider = signer.provider.provider;
    //     const towerContract = await createContract(Contract.contracts['PolygonTower'], provider);
    //     let txn = await approveTowerSpender(towerContract, spenderAddress, "1000000000000000000", address);
    //     if (txn && txn?.transactionHash) {
    //         alert(`Approval Success. TXN HASH: ${txn.transactionHash}`);
    //     }
    // }

    // const approveTowerSpender = async(contract, spenderAddress, amount, requesterAddress) => {
    //     try {
    //         const tx = await contract.methods.approve(spenderAddress, amount).send({
    //             from: requesterAddress,
    //         });
    
    //         if (tx?.status && tx?.transactionHash) {
    //             return tx;
    //         }
    //     } catch (err) {
    //         console.log("Error approving spender", err);
    //     }
    // }
    

    return (
        <div>
            <h1 className="app-title">Dynamic.xyz</h1>

            <div className='dynamic-widget'>
                <DynamicWidget/>
            </div>

            {primaryWallet && !showAuthFlow && (
            <div className='user-details-section'>
                <p>User is logged in</p>
                <div className='log-out-btn'>
                    <button type="button" onClick={handleLogOut}>
                    Log Out
                    </button>
                </div>
            </div>)
            }

            <h3>Details from Dynamic</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Connected Wallet:</td>
                        <td>{(primaryWallet && !showAuthFlow && primaryWallet.address) ? <span>{primaryWallet.address}</span> : '- -'}</td>
                    </tr>
                    <tr>
                        <td>Balance:</td>
                        <td>{(primaryWallet && !showAuthFlow) ? <span>{balance}</span> : '- -'}</td>
                    </tr>
                    <tr>
                        <td>Connected Network:</td>
                        <td>{network && chainName ? <span>{chainName} ({network})</span> : '- -'}</td>
                    </tr>
                </tbody>
            </table>
            <input
                type="text"
                value={messageValue}
                onChange={e => setMessageValue(e.target.value)}
            />
            <button onClick={signMessage}>Sign message</button>

            {/* <div>
                <input
                    type="text"
                    value={spenderAddress}
                    onChange={e => setSpenderAddress(e.target.value)}
                />
                <button onClick={handleApprove}>Approve</button>
            </div> */}

            {/* <h1 className="app-title">Rainbowkit - React (v16)</h1>

            <h3>Default Rainbowkit Connect button</h3>
            <div className="wallet-connect-button-container">
                <ConnectButton
                    accountStatus="full"
                    chainStatus="full"
                    label="Connect Wallet"
                    showBalance={true}
                />
            </div>

            <h3>Rainbowkit Modal function buttons</h3>
            <div>
                {openConnectModal && (
                    <button onClick={openConnectModal} type="button" className="connect-button">
                        openConnectModal
                    </button>
                )}

                {openChainModal && (
                    <button onClick={openChainModal} type="button" className="connect-button">
                        openChainModal (Switch Network)
                    </button>
                )}

                {openAccountModal && (
                    <button onClick={openAccountModal} type="button" className="connect-button">
                        openAccountModal
                    </button>
                )}
            </div>

            <button onClick={disconnect}>disconnect</button>

            <h3>Details from Wagmi</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Connected Wallet:</td>
                        <td>{address ? <span>{address}</span> : '- -'}</td>
                    </tr>
                    <tr>
                        <td>Connected Network:</td>
                        <td>{chain?.id && chain?.name ? <span>{chain.name} ({chain.id})</span> : '- -'}</td>
                    </tr>
                </tbody>
            </table> */}
        </div>
    )
}

export default Home;