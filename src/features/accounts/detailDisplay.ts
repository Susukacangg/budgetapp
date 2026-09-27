import type {ModalListItemDetailView} from '../../shared/types'
import {minorUnitsToCurrencyDisplay} from '../../shared/utility'
import type {Account} from './model.ts'

export function toAccountDetailView(account: Account): ModalListItemDetailView {
    return {
        displayFields: [
            {
                htmlFor: 'account_type',
                label: 'Type',
                value: account.type,
            },
            {
                htmlFor: 'account_balance',
                label: 'Balance',
                value: minorUnitsToCurrencyDisplay(account.balance),
            },
            {
                htmlFor: 'account_desc',
                label: 'Description',
                value: account.accountDesc ?? '',
            },
        ],
    }
}
