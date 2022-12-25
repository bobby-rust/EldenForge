import { v4 } from 'uuid'
import React from 'react'
import Item from './Item'
import { BuildSetProps, BuildItem } from '../types/ItemTypes'

function Sorceries(props: BuildSetProps) {
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
                    />
                )
            })}
        </>
    )
}

export default Sorceries
