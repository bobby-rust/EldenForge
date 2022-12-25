import Item from './Item'
import { v4 } from 'uuid'
import React from 'react'
import { BuildSetProps, BuildItem } from '../types/ItemTypes'

function Talismans(props: BuildSetProps) {
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
                    />
                )
            })}
        </>
    )
}

export default Talismans
