import type {Account} from "../../features/accounts";
import {HOME_CURRENCY} from "../../domain/money";

export const mockAccounts: readonly Account[] = [
    {
        id: '1',
        name: 'TnG Jobi',
        type: 'E-Wallet',
        openingBalance: {
            minorUnits: BigInt(1999),
            currencyCode: HOME_CURRENCY,
            scale: 2
        },
        version: 1
    },
    {
        id: '2',
        name: 'CIMB CC',
        type: 'Credit Card',
        openingBalance: {
            minorUnits: BigInt(2001012),
            currencyCode: HOME_CURRENCY,
            scale: 2
        },
        version: 1
    },
    {
        id: '3',
        name: 'CIMB CC',
        type: 'Credit Card',
        openingBalance: {
            minorUnits: BigInt(2001012),
            currencyCode: HOME_CURRENCY,
            scale: 2
        },
        version: 1
    },
    {
        id: '4',
        name: 'CIMB CC',
        type: 'Credit Card',
        openingBalance: {
            minorUnits: BigInt(2001012),
            currencyCode: HOME_CURRENCY,
            scale: 2
        },
        version: 1
    },
    {
        id: '5',
        name: 'CIMB CC',
        type: 'Credit Card',
        openingBalance: {
            minorUnits: BigInt(2001012),
            currencyCode: HOME_CURRENCY,
            scale: 2
        },
        version: 1
    },
    {
        id: '6',
        name: 'CIMB CC',
        type: 'Credit Card',
        openingBalance: {
            minorUnits: BigInt(2001012),
            currencyCode: HOME_CURRENCY,
            scale: 2
        },
        version: 1
    },
    {
        id: '7',
        name: 'CIMB CC',
        type: 'Credit Card',
        openingBalance: {
            minorUnits: BigInt(2001012),
            currencyCode: HOME_CURRENCY,
            scale: 2
        },
        version: 1
    }
];