import {type SyntheticEvent, useEffect, useState} from 'react';
import {Fab, List, ListItem, PageModal, Spinner, usePageModal} from "../../../shared/ui";
import {Add} from "../../../shared/icon";
import {PageModalInsertForm} from "../../../shared/ui/PageModal.tsx";
import {TransactionsForm} from "./TransactionsForm.tsx";
import {insertTxnLogSchema, type TxnLogDao} from "../model.ts";
import {type Transaction} from "../model.ts";
import {insert, getAllTxnLog} from "../repository.ts";

export function TransactionsPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const pageModal = usePageModal();
    const [isInserting, setIsInserting] = useState<boolean>(false);
    const [txnList] = useState<Transaction[]>([]);
    const [formKey, setFormKey] = useState<number>(0);

    useEffect(() => {
        let areLogsLoaded = false;

        async function loadTxns() {
            try {
                setIsLoading(true)
                const txnLogs = await getAllTxnLog()
                if (areLogsLoaded) return
                console.log("fetched transaction records:", txnLogs)
                setIsLoading(false)
            } catch (err) {
                if (areLogsLoaded) return
                console.log("Failed to fetch transaction records: ", err)
                setIsLoading(false)
            }
        }

        void loadTxns();

        return () => {
            areLogsLoaded = true
            setIsLoading(true)
        }
    }, [])

    async function insertTxnRecord(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const fd = new FormData(form)

        const parsed = insertTxnLogSchema.safeParse({
            txn_note: fd.get("txn_note"),
            txn_desc: fd.get("txn_desc"),
            txn_amount: fd.get("txn_amount"),
            txn_category: fd.get("txn_category"),
            txn_account: fd.get("txn_account"),
            txn_date_time: fd.get("txn_date_time"),
            txn_type: fd.get("txn_type"),
        })

        if (!parsed.success) {
            console.error('Validation failed:', parsed.error)
            return
        }

        console.log(parsed)

        try {
            setIsInserting(true)
            const saved = await insert(parsed.data as TxnLogDao)
            console.log('Inserted:', saved)
            setFormKey((prev) => prev + 1)
            // pageModal.replaceWithDetail(saved.id)
        } catch (err) {
            console.error('Insert failed:', err)
        } finally {
            setIsInserting(false)
        }
    }

    function renderTxns() {
        return (
            txnList.length === 0 ? 'No record yet' :
            <List>
                {txnList.map((txn) => (
                    <ListItem
                        key={txn.id}
                    >
                    </ListItem>
                ))}
            </List>
        )
    }

    return (
        <section className="page">
            <h2>Transactions</h2>
            {isLoading &&
                <Spinner style={{
                    alignSelf: 'center',
                    marginTop: '50px'
                }}/>}
            {!isLoading && renderTxns()}

            <Fab onClick={pageModal.openInsertForm}>
                <Add width={2.75}/>
            </Fab>
            <PageModal
                modal={pageModal}
                insertTitle="Add new record"
            >
                <PageModalInsertForm>
                    <TransactionsForm
                        key={formKey}
                        onSubmitHandler={insertTxnRecord}
                        isSubmitting={isInserting}/>
                </PageModalInsertForm>
            </PageModal>
        </section>
  )
}
