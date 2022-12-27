import Item from './Item'
import { v4 } from 'uuid'
import { BuildProps, BuildItem } from '../types/ItemTypes'

function Armors(props: BuildProps) {
    console.log(props)
    return (
        <>
            {props.items.map((currArmor: BuildItem) => {
                return (
                    <Item
                        key={v4()}
                        item={currArmor}
                        color={props.color}
                        size={props.size}
                        getNewItem={() => props.getNewItem(currArmor.id)}
                    />
                )
            })}
        </>
    )
}

export default Armors
