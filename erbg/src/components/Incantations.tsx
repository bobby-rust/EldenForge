import Item from './Item'
import { v4 } from 'uuid'
import React from 'react'
import { BuildItem, BuildProps } from '../types/ItemTypes'
import { memo } from 'react'
const Incantations = memo((props: BuildProps) => {
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
                        getNewItem={() => props.getNewItem(incant.id)}
                    />
                )
            })}
        </>
    )
})

export default Incantations
