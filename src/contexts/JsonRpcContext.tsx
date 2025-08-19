import { createContext, PropsWithChildren, useContext } from 'react';
import { ChiaMethod } from '../constants/wallet-connect';
import { useWalletConnect } from './WalletConnectContext';

// Confirmed Working Chia Method Interfaces
interface ChiaSendRequest {
    assetId?: string;
    amount: number | string;
    fee?: number | string;
    address: string;
    memos?: string[];
}

interface ChiaGetNftsRequest {
    limit?: number;
    offset?: number;
    collectionId?: string;
}

interface ChiaSignMessageByAddressRequest {
    message: string;
    address: string;
}

interface AssetAmount {
    assetId: string;
    amount: number | string;
}

interface ChiaTakeOfferRequest {
    offer: string;
    fee?: number | string;
}

interface ChiaCreateOfferRequest {
    offerAssets: AssetAmount[];
    requestAssets: AssetAmount[];
    fee?: number | string;
}

interface ChiaCancelOfferRequest {
    id: string;
    fee?: number | string;
}

interface NftMint {
    address?: string;
    royaltyAddress?: string;
    royaltyTenThousandths?: number;
    dataUris?: string[];
    dataHash?: string;
    metadataUris?: string[];
    metadataHash?: string;
    licenseUris?: string[];
    licenseHash?: string;
    editionNumber?: number;
    editionTotal?: number;
}

interface ChiaBulkMintNftsRequest {
    did: string;
    nfts: NftMint[];
    fee?: number | string;
}

interface JsonRpc {
    // Confirmed Working Chia Methods
    chiaGetAddress: (data: Record<string, never>) => Promise<{ address: string }>;
    chiaSend: (data: ChiaSendRequest) => Promise<Record<string, never>>;
    chiaGetNfts: (data: ChiaGetNftsRequest) => Promise<{ nfts: unknown[] }>;
    chiaSignMessageByAddress: (data: ChiaSignMessageByAddressRequest) => Promise<{
        publicKey: string;
        signature: string;
    }>;
    chiaTakeOffer: (data: ChiaTakeOfferRequest) => Promise<{ id: string }>;
    chiaCreateOffer: (data: ChiaCreateOfferRequest) => Promise<{ id: string; offer: string }>;
    chiaCancelOffer: (data: ChiaCancelOfferRequest) => Promise<Record<string, never>>;
    chiaBulkMintNfts: (data: ChiaBulkMintNftsRequest) => Promise<{ nftIds: string[] }>;
}

export const JsonRpcContext = createContext<JsonRpc>({} as JsonRpc);

export function JsonRpcProvider({ children }: PropsWithChildren) {
    const { client, session, chainId: currentChainId } = useWalletConnect();

    async function request<T>(method: ChiaMethod, data: unknown): Promise<T> {
        if (!client) throw new Error('WalletConnect is not initialized');
        if (!session) throw new Error('Session is not connected');

        const result = await client.request<T | { error: unknown }>({
            topic: session.topic,
            chainId: currentChainId,
            request: {
                method,
                params: data,
            },
        });

        if (result && typeof result === 'object' && 'error' in result) {
            throw new Error(JSON.stringify(result.error));
        }

        return result as T;
    }

    // Confirmed Working Chia Methods
    async function chiaGetAddress(data: Record<string, never>) {
        return await request<{ address: string }>(ChiaMethod.ChiaGetAddress, data);
    }

    async function chiaSend(data: ChiaSendRequest) {
        return await request<Record<string, never>>(ChiaMethod.ChiaSend, data);
    }

    async function chiaGetNfts(data: ChiaGetNftsRequest) {
        return await request<{ nfts: unknown[] }>(ChiaMethod.ChiaGetNfts, data);
    }

    async function chiaSignMessageByAddress(data: ChiaSignMessageByAddressRequest) {
        return await request<{
            publicKey: string;
            signature: string;
        }>(ChiaMethod.ChiaSignMessageByAddress, data);
    }

    async function chiaTakeOffer(data: ChiaTakeOfferRequest) {
        return await request<{ id: string }>(ChiaMethod.ChiaTakeOffer, data);
    }

    async function chiaCreateOffer(data: ChiaCreateOfferRequest) {
        return await request<{ id: string; offer: string }>(ChiaMethod.ChiaCreateOffer, data);
    }

    async function chiaCancelOffer(data: ChiaCancelOfferRequest) {
        return await request<Record<string, never>>(ChiaMethod.ChiaCancelOffer, data);
    }

    async function chiaBulkMintNfts(data: ChiaBulkMintNftsRequest) {
        return await request<{ nftIds: string[] }>(ChiaMethod.ChiaBulkMintNfts, data);
    }

    return (
        <JsonRpcContext.Provider
            value={{
                // Confirmed Working Chia Methods
                chiaGetAddress,
                chiaSend,
                chiaGetNfts,
                chiaSignMessageByAddress,
                chiaTakeOffer,
                chiaCreateOffer,
                chiaCancelOffer,
                chiaBulkMintNfts,
            }}
        >
            {children}
        </JsonRpcContext.Provider>
    );
}

export function useJsonRpc() {
    const context = useContext(JsonRpcContext);

    if (!context)
        throw new Error(
            'Calls to `useJsonRpc` must be used within a `JsonRpcProvider`.'
        );

    return context;
}
