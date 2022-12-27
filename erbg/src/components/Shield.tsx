import { v4 } from 'uuid'
import React from 'react'
import { BuildItem, BuildProps } from '../types/ItemTypes'
import Item from './Item'

function Shields(props: BuildProps) {
    return (
        <div>
            <h1>Shield</h1>
            {props.items.map((shield: BuildItem) => {
                return (
                    <Item
                        item={shield}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                        getNewItem={() => props.getNewItem(shield.id)}
                    />
                )
            })}
        </div>
    )
}

export default Shields
