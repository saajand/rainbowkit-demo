import React from "react";
import "./App.css";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    trustWallet,
} from '@rainbow-me/rainbowkit/wallets';

import Home from "./pages/Home";

const alchemyProviderKey = process.env.REACT_APP_ALCHEMY_KEY;

function App() {
    const { chains, provider } = configureChains(
        [mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet],
        [alchemyProvider({ apiKey: alchemyProviderKey, priority: 0 }), publicProvider({ priority: 1 })]
    );

    // const { connectors, wallets } = getDefaultWallets({
    //     appName: "My RainbowKit App",
    //     chains,
    // });

    const connectors = connectorsForWallets([
        {
            groupName: 'Recommended',
            wallets: [
                coinbaseWallet({ chains, appName: 'Rainbowkit demo' }),
                trustWallet({ chains }),
                metaMaskWallet({ chains, shimDisconnect: true }),
                walletConnectWallet({ chains }),
                rainbowWallet({ chains }),
            ],
        },
    ]);

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider,
    });

    return (
        <div className="App">
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <Home />
                </RainbowKitProvider>
            </WagmiConfig>
        </div>
    );
}

export default App;
