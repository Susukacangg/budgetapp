import {useState} from 'react'
import type {Account} from '../model.ts'
import {AddButton, List, Modal} from '../../../shared/ui/'
import {AccountsForm} from "./AccountsForm.tsx";

type AccountsPageProps = {
  accounts: readonly Account[]
}

export function AccountsPage({accounts}: AccountsPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

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
            <Modal isOpen={isModalOpen}
                   onClose={() => setIsModalOpen(false)}
            >
                <AccountsForm/>
            </Modal>
        </section>
    )
}
