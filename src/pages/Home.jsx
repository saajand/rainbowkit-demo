import React, { useEffect, useState } from 'react';
import '../stylings/Home.css';

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
    useSigner,
} from 'wagmi';
import { disconnect } from '@wagmi/core'
import {
    approveTowerSpender,
    createContract,
    getTowerBalance,
    signMessage,
} from '../services/HomeServices';
import Contract from '../abis/Contracts.json';


const Home = () => {
    const [towerBalance, setTowerBalance] = useState(0);
    const [messageValue, setMessageValue] = useState('');
    const [messageSignature, setMessageSignature] = useState('');
    const [spenderAddress, setSpenderAddress] = useState('');

    const { openConnectModal } = useConnectModal();
	const { openAccountModal } = useAccountModal();
	const { openChainModal } = useChainModal();

    // const provider = useProvider();
    // console.log(provider);

    const { address } = useAccount();
    const accObj = useAccount();
    const { chain } = useNetwork();

    const { data: signerData } = useSigner({ chainId: chain?.id });

    console.log(accObj);

    const handleSignMessageSubmit = async () => {
        let msgSign = await signMessage(messageValue, address);
        setMessageSignature(msgSign);
    }

    const handleApprove = async () => {
        const provider = signerData.provider.provider;
        const towerContract = await createContract(Contract.contracts['PolygonTower'], provider);
        let txn = await approveTowerSpender(towerContract, spenderAddress, "1000000000000000000", address);
        if (txn && txn?.transactionHash) {
            alert(`Approval Success. TXN HASH: ${txn.transactionHash}`);
        }
    }

    useEffect(() => {
        console.log("address", address);
        console.log("network chain", chain);

        (async () => {
            if (address && signerData?.provider) {
                const provider = signerData.provider.provider;
                const towerContract = await createContract(Contract.contracts['PolygonTower'], provider);
                let towerBalance = await getTowerBalance(towerContract, address);
                setTowerBalance(towerBalance);
            }
        })();
    }, [address, chain, signerData]);

    return (
        <div>
            <h1 className="app-title">Rainbowkit - React (v16)</h1>

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
            </table>


            <h3>TOWER Details</h3>
            <div>
                <div>TOWER Balance: <b>{towerBalance}</b></div>
                
                <div>
                    <input
                        type="text"
                        value={spenderAddress}
                        onChange={e => setSpenderAddress(e.target.value)}
                    />
                    <button onClick={handleApprove}>Approve</button>
                </div>

                <div>
                    <input
                        type="text"
                        value={messageValue}
                        onChange={e => setMessageValue(e.target.value)}
                    />
                    <button onClick={handleSignMessageSubmit}>Sign Message</button>
                    <div>{messageSignature}</div>
                </div>
            </div>
        </div>
    )
}

export default Home;
