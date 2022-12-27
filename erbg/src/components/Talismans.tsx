import Item from './Item'
import { v4 } from 'uuid'
import { BuildProps, BuildItem } from '../types/ItemTypes'
import { memo } from 'react'

const Talismans = memo((props: BuildProps) => {
    return (
        <>
            <h1>Talismans</h1>
            {props.items.map((talisman: BuildItem) => {
                return (
                    <Item
                        item={talisman}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        getNewItem={() => props.getNewItem(talisman.id)}
                    />
                )
            })}
        </>
    )
})

export default Talismans
