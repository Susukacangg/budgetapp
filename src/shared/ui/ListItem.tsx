import type {CSSProperties, ReactNode} from 'react'

export type ListItemProps = {
  index: number,
  clickable: boolean,
  children: ReactNode
}

export function ListItem({index, clickable, children}: ListItemProps) {
  return (
      <li
          className={`list-item ${clickable ? 'clickable' : ''}`}
          style={{'--item-index': index} as CSSProperties}
      >
        {children}
      </li>
  )
}
