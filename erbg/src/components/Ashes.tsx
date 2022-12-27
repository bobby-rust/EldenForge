import Item from './Item'
import { v4 } from 'uuid'
import { BuildItem, BuildProps } from '../types/ItemTypes'
import { memo } from 'react'

const Ashes = memo((props: BuildProps) => {
    return (
        <>
            <h1>Ashes</h1>
            {props.items.map((ash: BuildItem) => {
                return (
                    <Item
                        item={ash}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        getNewItem={() => props.getNewItem(ash.id)}
                    />
                )
            })}
        </>
    )
})

export default Ashes
