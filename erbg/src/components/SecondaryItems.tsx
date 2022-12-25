import Talismans from './Talismans'
import Incantations from './Incantations'
import Sorceries from './Sorceries'
import Ashes from './Ashes'
import Spirits from './Spirits'
import React from 'react'
import { BuildItem, BuildSetProps } from '../types/ItemTypes'

function SecondaryItems(props: BuildSetProps) {
    const color = props.color
    const _items = props.items

    if (!('sorcs' in _items)) return
    if (!('incants' in _items)) return
    if (!('talismans' in _items)) return
    if (!('ashes' in _items)) return
    if (!('spirits' in _items)) return

    return (
        <>
            <div>
                <Sorceries
                    items={_items['sorcs'] as BuildItem[]}
                    color={color}
                    size={props.size}
                />
                <Incantations
                    items={_items['incants'] as BuildItem[]}
                    color={color}
                    size={props.size}
                />
                <Talismans
                    items={_items['talismans'] as BuildItem[]}
                    color={color}
                    size={props.size}
                />
                <div>
                    <Ashes
                        items={_items['ashes'] as BuildItem[]}
                        color={color}
                        size={props.size}
                    />
                    <Spirits
                        items={_items['spirits'] as BuildItem[]}
                        color={color}
                        size={props.size}
                    />
                </div>
            </div>
        </>
    )
}

export default SecondaryItems
