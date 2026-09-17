import {type CategoryGroup} from "../model.ts";
import {AppForm, Fab, List, ListItem} from "../../../shared/ui";
import {Trash} from "../../../shared/icon";
import {type CSSProperties} from "react";

type CategoryDetailDisplayProps = {
    categoryGroup: CategoryGroup,
    onSubCatSelect: (id: number) => void,
}

export function CategoryDetailDisplay({categoryGroup, onSubCatSelect}: CategoryDetailDisplayProps) {

    function getCategoryDesc() {
        const categoryDesc = categoryGroup.parent.categoryDesc
        return categoryDesc ? categoryDesc : ""
    }

    function hasSubCat() {
        return categoryGroup.children.length > 0;
    }

    return (
        <AppForm>
            <label htmlFor="category_desc">Description</label>
            <input
                type="text"
                name="category_desc"
                readOnly
                style={{cursor: "default"}}
                value={getCategoryDesc()}
            />
            {hasSubCat() &&
                <>
                    <h3>Subcategories</h3>
                    <List
                    >
                        {categoryGroup.children.map((subCat) => (
                            <ListItem
                                key={subCat.id}
                                onClick={() => onSubCatSelect(subCat.id)}
                            >
                                {subCat.name}
                            </ListItem>
                        ))}
                    </List>
                </>
            }
            <Fab style={{
                "--fab-bg-color": "var(--accent-error)",
                "--fab-bg-color-active": "var(--accent-error-active)",
                "--fab-outline-color": "var(--accent-error)"
            } as CSSProperties}>
                <Trash width={0.1}/>
            </Fab>
        </AppForm>
    )
}