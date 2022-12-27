import Item from './Item'
import { v4 } from 'uuid'
import React from 'react'
import { BuildItem, BuildProps } from '../types/ItemTypes'

function Ashes(props: BuildProps) {
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
}

export default Ashes
