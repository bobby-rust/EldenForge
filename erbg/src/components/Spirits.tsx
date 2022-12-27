import Item from './Item'
import { v4 } from 'uuid'
import React from 'react'
import { BuildItem, BuildProps } from '../types/ItemTypes'

function Spirits(props: BuildProps) {
    return (
        <>
            {/* <h2>Spirits</h2> */}
            {props.items.map((spirit: BuildItem) => {
                return (
                    <Item
                        item={spirit}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        getNewItem={() => props.getNewItem(spirit.id)}
                    />
                )
            })}
        </>
    )
}

export default Spirits
