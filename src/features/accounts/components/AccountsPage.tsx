import {
    type SyntheticEvent,
    useState,
    useEffect,
    Fragment,
} from 'react'
import {
    type Account, ACCOUNT_TYPES,
    AccountInsertSchema,
} from '../model.ts'
import {
    Fab,
    List,
    PageModal,
    Spinner,
    ListItem,
    usePageModal,
} from '../../../shared/ui/'
import {AccountsForm} from "./AccountsForm.tsx";
import {minorUnitsToCurrencyDisplay} from "../../../shared/utility";
import {Add} from "../../../shared/icon";
import {toAccountDetailView} from '../detailDisplay.ts'
import {PageModalDetailDisplayForm, PageModalInsertForm} from "../../../shared/ui/PageModal.tsx";
import type {AccountFacade} from "../facade/AccountFacade.ts";
import {AccountFacadeImpl} from "../impl/facade/AccountFacadeImpl.ts";

const facade: AccountFacade = new AccountFacadeImpl()

export function AccountsPage() {
    const [accountsList, setAccountsList] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isInserting, setIsInserting] = useState<boolean>(false)
    const [formKey, setFormKey] = useState<number>(0)
    const pageModal = usePageModal()

    useEffect(() => {
        let areAccountsLoaded = false

        async function loadAccounts() {
            try {
                const accounts: Account[] = await facade.readAllAccounts()
                // Ignore the Strict Mode (or navigate-away) request that finished after cleanup
                if (areAccountsLoaded) return
                console.log('fetched accounts: ', accounts)
                setAccountsList(accounts)
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

        const parsed = AccountInsertSchema.safeParse({
            name: fd.get('account_name'),
            type: fd.get('account_type'),
            balance: Number(fd.get('account_balance_submit')),
            accountDesc: fd.get('account_desc'),
        })

        if (!parsed.success) {
            console.error('Validation failed:', parsed.error)
            return
        }

        try {
            setIsInserting(true)
            const saved = await facade.createNewAccount(parsed.data as Account)
            console.log('Inserted:', saved)
            setAccountsList((prev) => [...prev, saved])
            setFormKey((prev) => prev + 1)
            pageModal.replaceWithDetail(saved.id)
        } catch (err) {
            console.error('Insert failed:', err)
        } finally {
            setIsInserting(false)
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
                                onClick={() => pageModal.openDetail(account.id)}
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

    function openInsertForm() {
        setFormKey((prev) => prev + 1)
        pageModal.openInsertForm()
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
            <Fab onClick={openInsertForm}>
                <Add width={2.75}/>
            </Fab>
            <PageModal
                modal={pageModal}
                insertTitle="Add Account"
            >
                <PageModalInsertForm>
                    <AccountsForm
                        key={formKey}
                        onSubmitHandler={addNewAccount}
                        isLoading={isInserting}
                    />
                </PageModalInsertForm>
                <PageModalDetailDisplayForm
                    resolveDetail={(id) =>
                        accountsList.find((acc) => acc.id === id) as Account}
                    resolveTitle={(account) => account == null ? "" : account.name}
                    resolveDetailDisplay={(account) => toAccountDetailView(account)}
                />
            </PageModal>
        </section>
    )
}
