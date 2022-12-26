import Item from './Item'
import { v4 } from 'uuid'
import React from 'react'
import { BuildSetProps, BuildItem } from '../types/ItemTypes'

function Armors(props: BuildSetProps) {
    return (
        <>
            {props.items.map((currArmor: BuildItem, idx: number) => {
                return (
                    <Item
                        key={v4()}
                        item={currArmor}
                        color={props.color}
                        size={props.size}
                    />
                )
            })}
        </>
    )
}

export default Armors
