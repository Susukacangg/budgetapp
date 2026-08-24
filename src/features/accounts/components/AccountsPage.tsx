import {type FormEvent, useState, useEffect} from 'react'
import {
    type Account,
    convertAccountFromDao,
    insertAccountSchema,
} from '../model.ts'
import {
    Fab,
    List,
    Modal,
    Spinner,
    ListItem
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
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isInserting, setIsInserting] = useState<boolean>(false)
    const [formKey, setFormKey] = useState<number>(0)

    useEffect(() => {
        let areAccountsLoaded = false

        async function loadAccounts() {
            try {
                const accounts: AccountDao[] = await getAllAccounts()
                // Ignore the Strict Mode (or navigate-away) request that finished after cleanup
                if (areAccountsLoaded) return
                console.log('fetched accounts: ', accounts)
                setAccountsList(accounts.map(convertAccountFromDao))
                setIsLoading(false)
            } catch (err) {
                if (areAccountsLoaded) return
                console.error('get failed:', err)
            }
        }

        void loadAccounts()

        return () => {
            areAccountsLoaded = true
            setIsLoading(true)
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
            setIsInserting(true)
            const saved = await insert(parsed.data)
            console.log('Inserted:', saved)
            setIsInserting(false)
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
            {
                isLoading ? (<Spinner style={{
                    alignSelf: 'center',
                    marginTop: '50px'
                }}/>)
                :
                accountsList.length === 0 ? (
                    <p className="muted">No accounts yet.</p>
                ) : (
                    <List>
                        {accountsList.map((account, index) => (
                            <ListItem
                                index={index}
                                key={account.id}
                                clickable={true}
                            >
                                <strong>{account.name}</strong>
                                <span className="muted">
                                    {`${account.type} · RM${account.balance}`}
                                </span>
                            </ListItem>
                        ))}
                    </List>
                )
            }
            <Fab onClick={() => setIsModalOpen(true)}
            />
            <Modal title={"Add Account"}
                   isOpen={isModalOpen}
                   onClose={() => {
                       setIsModalOpen(false)
                       setFormKey((prev) => prev + 1)
                   }}
            >
                <AccountsForm key={formKey}
                              onSubmitHandler={addNewAccount}
                              isLoading={isInserting}
                />
            </Modal>
        </section>
    )
}
