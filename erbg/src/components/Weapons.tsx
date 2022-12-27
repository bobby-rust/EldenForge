import Item from './Item'
import { v4 } from 'uuid'
import { BuildProps, BuildItem } from '../types/ItemTypes'
import { memo } from 'react'

const Weapons = memo((props: BuildProps) => {
    return (
        <>
            {props.items.map((weapon: BuildItem) => {
                return (
                    <Item
                        item={weapon}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        getNewItem={() => props.getNewItem(weapon.id)}
                    />
                )
            })}
        </>
    )
})

export default Weapons
