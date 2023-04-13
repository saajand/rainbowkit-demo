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
import { DynamicContextProvider, FilterAndSortWallets } from '@dynamic-labs/sdk-react';

import Home from "./pages/Home";

const alchemyProviderKey = process.env.REACT_APP_ALCHEMY_KEY;

const evmNetworks = [
    {
      blockExplorerUrls: ['https://etherscan.io/'],
      chainId: 1,
      chainName: 'Ethereum Mainnet',
      iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      networkId: 1,
      shortName: 'eth',
      rpcUrls: ['https://mainnet.infura.io/v3/'],
      vanityName: 'ETH Mainnet',
    },
  {
      blockExplorerUrls: ['https://etherscan.io/'],
      chainId: 5,
      chainName: 'Ethereum Goerli',
      iconUrls: ['https://app.dynamic.xyz/assets/networks/eth.svg'],
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      networkId: 5,
      rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      shortName: 'eth',
      vanityName: 'Goerli',
    },
    {
      blockExplorerUrls: ['https://polygonscan.com/'],
      chainId: 137,
      chainName: 'Matic Mainnet',
      iconUrls: ['https://app.dynamic.xyz/assets/networks/polygon.svg'],
      nativeCurrency: {
        decimals: 18,
        name: 'MATIC',
        symbol: 'MATIC',
      },
      networkId: 137,
      rpcUrls: ['https://polygon-rpc.com'],
      shortName: 'MATIC',
      vanityName: 'Polygon',
    },
    {
        blockExplorerUrls: ['https://mumbai.polygonscan.com'],
        chainId: 80001,
        chainName: 'Polygon - Mumbai',
        iconUrls: ['https://mumbai.polygonscan.com/images/svg/brands/poly.png'],
        nativeCurrency: {
          decimals: 18,
          name: 'MATIC',
          symbol: 'MATIC',
        },
        networkId: 80001,
        shortName: 'maticmum',
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        vanityName: 'Polygon - Mumbai',
      },
  ];

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
            {/* <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <Home />
                </RainbowKitProvider>
            </WagmiConfig> */}

            <div className="wallet-connect-button-container">
                <DynamicContextProvider theme={'light'}
                    settings={{
                    environmentId:'d2c7ff3e-9ed3-422a-a658-f7ac19a07cd4',
                    appName: 'Example dynamic.xyz demo',
                    multiWallet: true,
                    walletsFilter: FilterAndSortWallets(["metamask","coinbase","walletconnect","trust","rainbow"]),
                    privacyPolicyUrl: "",
                    termsOfServiceUrl: "",
                    evmNetworks
                    }}> 
                <Home />
                </DynamicContextProvider>
            </div>
        </div>
    );
}

export default App;
