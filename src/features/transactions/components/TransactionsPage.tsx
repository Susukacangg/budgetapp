import {useState} from 'react';
import {Fab, PageModal, Spinner, usePageModal} from "../../../shared/ui";
import {Add} from "../../../shared/icon";

export function TransactionsPage() {
    const [isLoading] = useState<boolean>(false);
    const pageModal = usePageModal();

    return (
        <section className="page">
            <h2>Accounts</h2>
            {
                isLoading ? (
                    <Spinner style={{
                        alignSelf: 'center',
                        marginTop: '50px'
                    }}/>
                ) : 'nothing'
            }
            <Fab onClick={pageModal.openInsertForm}>
                <Add width={2.75}/>
            </Fab>
            <PageModal
                modal={pageModal}
                insertTitle="Add transaction record"
                resolveDetail={() => null}
            >
                ""
            </PageModal>
        </section>
  )
}
