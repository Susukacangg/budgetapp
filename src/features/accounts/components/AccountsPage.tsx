import {type FormEvent, useState, useEffect} from 'react'
import {
    type Account,
    convertAccountFromDao,
    insertAccountSchema,
} from '../model.ts'
import {
    AddButton,
    List,
    Modal
} from '../../../shared/ui/'
import {
    insert,
    getAllAccounts,
    type AccountDao
} from "../repository.ts"
import {AccountsForm} from "./AccountsForm.tsx";

export function AccountsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [accountsList, setAccountsList] = useState<Account[]>([])

    useEffect(() => {
        let areAccountsLoaded = false

        async function loadAccounts() {
            try {
                const accounts: AccountDao[] = await getAllAccounts()
                // Ignore the Strict Mode (or navigate-away) request that finished after cleanup
                if (areAccountsLoaded) return
                console.log('fetched accounts: ', accounts)
                setAccountsList(accounts.map(convertAccountFromDao))
            } catch (err) {
                if (areAccountsLoaded) return
                console.error('get failed:', err)
            }
        }

        void loadAccounts()

        return () => {
            areAccountsLoaded = true
        }
    }, [])

    async function addNewAccount(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const fd = new FormData(form)

        const parsed = insertAccountSchema.safeParse({
            account_name: fd.get('account_name'),
            account_type: fd.get('account_type'),
            account_balance: fd.get('account_balance'),
            account_desc: fd.get('account_desc') || undefined,
        })

        if (!parsed.success) {
            console.error('Validation failed:', parsed.error.flatten().fieldErrors)
            return
        }

        try {
            const saved = await insert(parsed.data)
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
            {accountsList.length === 0 ? (
                <p className="muted">No accounts yet.</p>
            ) : (
                <List items={accountsList}/>
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
