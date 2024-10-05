import { ref } from "vue";

import {TronLinkAdapter} from "@tronweb3/tronwallet-adapter-tronlink";


const isConnected = ref(false)

export const WalletConnect =async () =>{
  const tronlinkAdapter = new TronLinkAdapter();
  await tronlinkAdapter.connect();
  await tronlinkAdapter.signMessage('连接钱包');
  const address = tronlinkAdapter.address;
  const state = tronlinkAdapter.state;
  const readyState = tronlinkAdapter.readyState;
  const connecting = tronlinkAdapter.connecting;
  return {address,state,readyState,connecting};
}