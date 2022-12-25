import Item from './Item'
import { v4 } from 'uuid'
import React from 'react'
import { BuildItem, BuildSetProps } from '../types/ItemTypes'

function Incantations(props: BuildSetProps) {
    return (
        <>
            <h1>Incantations</h1>
            {props.items.map((incant: BuildItem) => {
                return (
                    <Item
                        item={incant}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                    />
                )
            })}
        </>
    )
}

export default Incantations
