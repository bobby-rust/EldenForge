import { v4 } from 'uuid'
import { memo } from 'react'
import Item from './Item'
import { BuildProps, BuildItem } from '../types/ItemTypes'

const Sorceries = memo((props: BuildProps) => {
    return (
        <>
            <h1>Sorceries</h1>
            {props.items.map((sorc: BuildItem) => {
                return (
                    <Item
                        item={sorc}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        getNewItem={() => props.getNewItem(sorc.id)}
                    />
                )
            })}
        </>
    )
})

export default Sorceries
