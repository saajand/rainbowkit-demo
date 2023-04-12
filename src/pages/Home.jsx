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
        primaryWallet
      } = useDynamicContext();
    
      const [balance, setBalance] = useState(null);
    
      useEffect(() => {
        const fetchBalance = async () => {
          if (primaryWallet) {
            const value = await primaryWallet.connector.getBalance();
            setBalance(value);
          }
        };
        fetchBalance();
      }, [primaryWallet]);

    console.log(accObj)

    useEffect(() => {
        console.log("address", address);
        console.log("network chain", chain);
    }, [address, chain]);

    // if (primaryWallet && !showAuthFlow) {
    //     return (
    //       <div>
    //         <p>User is logged in</p>
    //         <p>Address: {primaryWallet.address}</p>
    //         <p>Balance: {balance}</p>
    //         <button type="button" onClick={handleLogOut}>
    //           Log Out
    //         </button>
    //       </div>
    //     );
        
    // }

    return (
        <div>
            <h1 className="app-title">Dynamic.xyz</h1>

            <DynamicWidget/>

            {primaryWallet && !showAuthFlow && (
            <div>
                <p>User is logged in</p>
                <p>Address: {primaryWallet.address}</p>
                <p>Balance: {balance}</p>
                <button type="button" onClick={handleLogOut}>
                Log Out
                </button>
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
                        {/* <td>{chain?.id && chain?.name ? <span>{chain.name} ({chain.id})</span> : '- -'}</td> */}
                    </tr>
                </tbody>
            </table>

            {
            (primaryWallet && !showAuthFlow) && 
            <button type="button" onClick={handleLogOut}>
                Log Out
            </button>
            }

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
