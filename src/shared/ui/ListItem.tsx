import type {CSSProperties, ReactNode} from 'react'

export type ListItemProps = {
    index?: number,
    clickable?: boolean,
    children?: ReactNode,
    style?: CSSProperties,
    onClick?: () => void
}

export function ListItem(
    {index=0, clickable=true, children, style, onClick}: Readonly<ListItemProps>) {
  return (
      <li
          className={`list-item ${clickable ? 'clickable' : ''}`}
          style={{
              '--item-index': index,
              ...style
          } as CSSProperties}
          onClick={onClick}
      >
        {children}
      </li>
  )
}
