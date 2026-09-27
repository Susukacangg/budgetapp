import type {ModalListItemDetailView} from '../../shared/types'
import type {CategoryGroup} from './model.ts'

export function toCategoryDetailView(
    categoryGroup: CategoryGroup,
    onSubCatSelect: (id: number) => void,
): ModalListItemDetailView {
    const {parent, children} = categoryGroup

    return {
        displayFields: [
            {
                htmlFor: 'category_type',
                label: 'Type',
                value: parent.type
            },
            {
                htmlFor: 'category_desc',
                label: 'Description',
                value: parent.categoryDesc ?? '',
            },
        ],
        sublistSection: children.length > 0
            ? {
                title: 'Subcategories',
                items: children.map((child) => ({
                    id: child.id,
                    label: child.name,
                })),
                onItemSelect: onSubCatSelect,
            }
            : undefined,
    }
}
