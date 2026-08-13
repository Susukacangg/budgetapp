import type {Category} from "../../features/categories";
import type {Account} from "../../features/accounts";
import {ListItem} from "./ListItem.tsx";

type ListProps = {
    items: readonly (Account | Category)[]
}

export function List({items}: ListProps) {
    return (
        <ul className="list">
            {items.map((item,  index) => (
                <ListItem key={item.id} item={item} index={index}/>
            ))}
        </ul>
    )
}