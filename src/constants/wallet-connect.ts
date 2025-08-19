import { CoreTypes, ProposalTypes } from '@walletconnect/types';
import { CHAIN_ID } from './env';

export enum ChiaMethod {
    // Confirmed Working Chia Methods (tested with Sage)
    ChiaGetAddress = 'chia_getAddress',
    ChiaGetNfts = 'chia_getNfts',
    ChiaSignMessageByAddress = 'chia_signMessageByAddress',
    ChiaSend = 'chia_send',
    ChiaTakeOffer = 'chia_takeOffer',
    ChiaCreateOffer = 'chia_createOffer',
    ChiaCancelOffer = 'chia_cancelOffer',
    ChiaBulkMintNfts = 'chia_bulkMintNfts',
}

export const REQUIRED_NAMESPACES: ProposalTypes.RequiredNamespaces = {
    chia: {
        methods: Object.values(ChiaMethod),
        chains: [CHAIN_ID],
        events: [],
    },
};

export const METADATA: CoreTypes.Metadata = {
    name: 'Test App',
    description: 'A test application for WalletConnect.',
    url: '#',
    icons: ['https://walletconnect.com/walletconnect-logo.png'],
};
