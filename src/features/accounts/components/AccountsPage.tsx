import {type SyntheticEvent, useState, useEffect, Fragment} from 'react'
import {
    type Account, ACCOUNT_TYPES,
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
import {minorUnitsToCurrencyDisplay} from "../../../shared/utility";
import {Add} from "../../../shared/icon";

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

    async function addNewAccount(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const fd = new FormData(form)

        const parsed = insertAccountSchema.safeParse({
            account_name: fd.get('account_name'),
            account_type: fd.get('account_type'),
            account_balance: fd.get('account_balance_submit'),
            account_desc: fd.get('account_desc') || undefined,
        })

        if (!parsed.success) {
            console.error('Validation failed:', parsed.error)
            return
        }

        try {
            setIsInserting(true)
            const saved = await insert(parsed.data as AccountDao)
            console.log('Inserted:', saved)
            const converted = convertAccountFromDao(saved)
            setAccountsList((prev) => [...prev, converted])
            setIsInserting(false)
            closeModal()
            // refresh list (state, refetch, etc.)
        } catch (err) {
            console.error('Insert failed:', err)
        }
    }

    function renderAccountsList() {
        return ACCOUNT_TYPES.map((accountType, index) => (
                <Fragment key={index}>
                    <p className="muted">{accountType}</p>
                    <List>
                        {accountsList
                            .filter((account) => accountType == account.type)
                            .map((account, index) => (
                            <ListItem
                                index={index}
                                key={account.id}
                                clickable={true}
                            >
                                <strong>{account.name}</strong>
                                <div className="trailing">
                                    <span className="muted">
                                        {minorUnitsToCurrencyDisplay(account.balance)}
                                    </span>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Fragment>
            ))
    }

    function closeModal() {
        setIsModalOpen(false)
        setFormKey((prev) => prev + 1)
    }

    return (
        <section className="page">
            <h2>Accounts</h2>
            {
                isLoading ? (
                    <Spinner style={{
                        alignSelf: 'center',
                        marginTop: '50px'
                    }}/>
                ) : renderAccountsList()
            }
            <Fab onClick={() => setIsModalOpen(true)}>
                <Add width={2.75}/>
            </Fab>
            <Modal title={"Add Account"}
                   isOpen={isModalOpen}
                   onClose={closeModal}
            >
                <AccountsForm key={formKey}
                              onSubmitHandler={addNewAccount}
                              isLoading={isInserting}
                />
            </Modal>
        </section>
    )
}
