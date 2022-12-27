import { v4 } from 'uuid'
import { BuildItem, BuildProps } from '../types/ItemTypes'
import Item from './Item'
import { memo } from 'react'

const Shields = memo((props: BuildProps) => {
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
})

export default Shields
