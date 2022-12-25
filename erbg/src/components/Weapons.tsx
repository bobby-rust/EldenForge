import Item from './Item'
import { v4 } from 'uuid'
import React from 'react'

function Weapons(props: any) {
    return (
        <>
            {props.weapons.map((weapon: any) => {
                return (
                    <Item
                        item={weapon}
                        color={props.color}
                        key={v4()}
                        size={props.size}
                    />
                )
            })}
        </>
    )
}

export default Weapons
