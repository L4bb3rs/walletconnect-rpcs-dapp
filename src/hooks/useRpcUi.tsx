import { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useJsonRpc } from '../contexts/JsonRpcContext';

export function useRpcUi() {
    const rpc = useJsonRpc();
    const [responseData, setResponseData] = useState<any>(null);

    // State variables for form inputs
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState(0);
    const [fee, setFee] = useState(0);
    const [assetId, setAssetId] = useState('');
    const [message, setMessage] = useState('');
    const [memos, setMemos] = useState('');
    const [count, setCount] = useState(0);
    const [startIndex, setStartIndex] = useState(0);
    const [collectionId, setCollectionId] = useState('');
    const [offer, setOffer] = useState('');
    const [offerId, setOfferId] = useState('');

    const commands = {
        // Confirmed Working Chia Methods
        chia_getAddress: [
            submitButton('Get Address', async () => {
                try {
                    const result = await rpc.chiaGetAddress({});
                    setResponseData(result);
                } catch (error) {
                    setResponseData({ error: (error as Error).message });
                }
            }),
        ],
        chia_send: [
            stringOption('Address', address, setAddress),
            numberOption('Amount', amount, setAmount),
            numberOption('Fee', fee, setFee),
            stringOption('Asset ID (optional)', assetId, setAssetId),
            stringOption('Memos (comma-separated)', memos, setMemos),
            submitButton('Send', async () => {
                try {
                    const result = await rpc.chiaSend({
                        address,
                        amount,
                        fee: fee || undefined,
                        assetId: assetId || undefined,
                        memos: memos.trim().length
                            ? memos.split(',').map((memo) => memo.trim())
                            : undefined,
                    });
                    setResponseData(result);
                } catch (error) {
                    setResponseData({ error: (error as Error).message });
                }
            }),
        ],
        chia_getNfts: [
            numberOption('Limit', count, setCount),
            numberOption('Offset', startIndex, setStartIndex),
            stringOption('Collection ID (optional)', collectionId, setCollectionId),
            submitButton('Get NFTs', async () => {
                try {
                    const result = await rpc.chiaGetNfts({
                        limit: count || undefined,
                        offset: startIndex || undefined,
                        collectionId: collectionId || undefined,
                    });
                    setResponseData(result);
                } catch (error) {
                    setResponseData({ error: (error as Error).message });
                }
            }),
        ],
        chia_signMessageByAddress: [
            stringOption('Message', message, setMessage),
            stringOption('Address', address, setAddress),
            submitButton('Sign Message By Address', async () => {
                try {
                    const result = await rpc.chiaSignMessageByAddress({ message, address });
                    setResponseData(result);
                } catch (error) {
                    setResponseData({ error: (error as Error).message });
                }
            }),
        ],
        chia_takeOffer: [
            stringOption('Offer', offer, setOffer),
            numberOption('Fee', fee, setFee),
            submitButton('Take Offer', async () => {
                try {
                    const result = await rpc.chiaTakeOffer({
                        offer,
                        fee: fee || undefined,
                    });
                    setResponseData(result);
                } catch (error) {
                    setResponseData({ error: (error as Error).message });
                }
            }),
        ],
        chia_cancelOffer: [
            stringOption('Offer ID', offerId, setOfferId),
            numberOption('Fee', fee, setFee),
            submitButton('Cancel Offer', async () => {
                try {
                    const result = await rpc.chiaCancelOffer({
                        id: offerId,
                        fee: fee || undefined,
                    });
                    setResponseData(result);
                } catch (error) {
                    setResponseData({ error: (error as Error).message });
                }
            }),
        ],
    };

    return { commands, responseData };
}

function stringOption(
    name: string,
    value: string,
    setValue: (value: string) => void
): JSX.Element {
    return (
        <Box sx={{ mb: 2 }}>
            <TextField
                label={name}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                variant="outlined"
            />
        </Box>
    );
}

function numberOption(
    name: string,
    value: number,
    setValue: (value: number) => void
): JSX.Element {
    return (
        <Box sx={{ mb: 2 }}>
            <TextField
                label={name}
                type="number"
                value={value}
                onChange={(e) => setValue(+e.target.value)}
                fullWidth
                variant="outlined"
            />
        </Box>
    );
}

function submitButton(
    name: string,
    onClick: () => void
): JSX.Element {
    return (
        <Box sx={{ mb: 2 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={onClick}
                fullWidth
            >
                {name}
            </Button>
        </Box>
    );
}