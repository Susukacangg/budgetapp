import type {CSSProperties} from 'react'
import {formatMoney} from '../format'
import type {Account} from '../../features/accounts'
import type {Category} from '../../features/categories'

export type ListItemProps = {
  item: Account | Category
  index: number
}

function isAccount(item: Account | Category): item is Account {
  return 'balance' in item
}

export function ListItem({item, index}: ListItemProps) {
  return (
      <li
          key={item.id}
          className="list-item"
          style={{'--item-index': index} as CSSProperties}
      >
        <strong>{item.name}</strong>
        <span className="muted">
          {item.type}
          {isAccount(item) ? ` · RM${item.balance}` : null}
        </span>
      </li>
  )
}
