import {Fragment, type CSSProperties} from 'react'
import type {ModalListItemDetailView} from '../types'
import {Trash} from '../icon'
import {AppForm} from './AppForm.tsx'
import {Fab} from './Fab.tsx'
import {List} from './List.tsx'
import {ListItem} from './ListItem.tsx'
import {FormInput} from "./FormInput.tsx";

type ModalDetailDisplayProps = ModalListItemDetailView

export function ModalDetailDisplay({
    displayFields,
    sublistSection,
    onDelete,
}: Readonly<ModalDetailDisplayProps>) {
    const deleteFabStyle = {
        '--fab-bg-color': 'var(--accent-error)',
        '--fab-bg-color-active': 'var(--accent-error-active)',
        '--fab-outline-color': 'var(--accent-error)',
    } as CSSProperties

    return (
        <AppForm
        >
            {displayFields.map((field) => (
                <Fragment key={field.htmlFor}>
                    <label htmlFor={field.htmlFor}>{field.label}</label>
                    <FormInput
                        type="text"
                        name={field.htmlFor}
                        value={field.value}
                    />
                </Fragment>
            ))}

            {sublistSection != null && sublistSection.items.length > 0 && (
                <>
                    <h3>{sublistSection.title}</h3>
                    <List>
                        {sublistSection.items.map((item) => (
                            <ListItem
                                key={item.id}
                                onClick={
                                    sublistSection.onItemSelect != null
                                        ? () => sublistSection.onItemSelect!(item.id)
                                        : undefined
                                }
                            >
                                {item.label}
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            <Fab style={deleteFabStyle} onClick={onDelete}>
                <Trash width={0.1}/>
            </Fab>
        </AppForm>
    )
}
