import {type FormEvent, useState} from 'react'
import type {Account, AccountType} from '../model.ts'
import {AddButton, List, Modal} from '../../../shared/ui/'
import {AccountsForm} from "./AccountsForm.tsx";
import {insert} from "../repository.ts"

type AccountsPageProps = {
  accounts: readonly Account[]
}

export function AccountsPage({accounts}: AccountsPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    async function addNewAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const fd = new FormData(form)

        const newAccount: Account = {
            accountName: String(fd.get('account_name') ?? '').trim(),
            accountType: String(fd.get('account_type') ?? ''),
            accountBalance: Number(fd.get('account_balance')),
            accountDesc: String(fd.get('account_desc') ?? '') || undefined,
        }

        try {
            const saved = await insert(newAccount)
            console.log('Inserted:', saved)
            setIsModalOpen(false)
            // refresh list (state, refetch, etc.)
        } catch (err) {
            console.error('Insert failed:', err)
        }
    }

    return (
        <section className="page">
            <h2>Accounts</h2>
            <p className="muted">Cash, bank, credit, and savings accounts.</p>
            {accounts.length === 0 ? (
                <p className="muted">No accounts yet.</p>
            ) : (
                <List items={accounts}/>
            )}
            <AddButton onClick={() => setIsModalOpen(true)}
            />
            <Modal title={"Add Account"}
                   isOpen={isModalOpen}
                   onClose={() => setIsModalOpen(false)}
            >
                <AccountsForm onSubmitHandler={addNewAccount}/>
            </Modal>
        </section>
    )
}
