import { memo, useMemo } from "react";
import { BuildItem } from "../types/ItemTypes";

type ItemProps = {
    item: BuildItem;
    buildDispatch: any;
    color: string;
    size: string;
};

const Item = memo((props: ItemProps) => {
    /**
     * This is a generic component
     * Any styling on this component should remain generic
     * i.e. NOT specific to any layout or theme
     */

    return (
        <div className='item'>
            <div className='item-name-container'>
                <span>{props.item.name}</span>
            </div>
            <button onClick={props.buildDispatch}>Respin</button>
            <a
                href={`https://eldenring.wiki.fextralife.com/${props.item.name}`}
                rel='noreferrer'
                target='_blank'>
                {props.item.image === undefined ? (
                    <span>loading...</span>
                ) : (
                    <img
                        className='item-img'
                        src={props.item.image}
                        alt={props.item.name + " img"}
                        loading='lazy'
                    />
                )}
            </a>
            <div className='item-desc-container'>
                <p className='item-desc'>{props.item.description}</p>
            </div>
        </div>
    );
});

export default Item;
