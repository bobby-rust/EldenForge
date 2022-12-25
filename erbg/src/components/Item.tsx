import React from 'react'
import { BuildItemProps } from '../types/ItemTypes'

function Item(props: BuildItemProps) {
    /**
     * This is a generic component
     * Any styling on this component should remain generic
     * i.e. NOT specific to any layout or theme
     */
    return (
        <div className='item'>
            <span>{props.item.name}</span>
            <a
                href={`https://eldenring.wiki.fextralife.com/${props.item.name}`}
                rel='noreferrer'
                target='_blank'
            >
                {props.item.image === undefined ? (
                    <span>loading...</span>
                ) : (
                    <img
                        className='item-img'
                        src={props.item.image}
                        alt={props.item.name + ' img'}
                    />
                )}
            </a>
            <p className='item-desc'>{props.item.description}</p>
        </div>
    )
}

export default Item
