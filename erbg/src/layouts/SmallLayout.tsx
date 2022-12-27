import Button from 'react-bootstrap/Button'
import StartingClass from '../components/StartingClass'
import Weapons from '../components/Weapons'
import Armors from '../components/Armors'
import Shield from '../components/Shield'
import Talismans from '../components/Talismans'
import Incantations from '../components/Incantations'
import Sorceries from '../components/Sorceries'
import Ashes from '../components/Ashes'
import Spirits from '../components/Spirits'
import '../styles/smallLayout.css'
import SelectMenu from '../components/SelectMenu'
import { getNewItem } from '../functions/getNewItem'

function SmallLayout(props: any) {
    return (
        <div className='layout-wrapper-sm'>
            <div className='body-container-sm'>
                <div className='form'>
                    <div className='btn-container'>
                        <Button
                            className='button-sm'
                            onClick={props.generateNewBuild}
                            variant='danger'
                        >
                            GENERATE NEW BUILD
                        </Button>
                    </div>
                    <div className='select-menu-container-sm'>
                        <SelectMenu />
                    </div>
                    <div className='starting-class-sm'>
                        <StartingClass
                            starting_class={props.build['starting_class']}
                            size={props.size}
                        />
                    </div>
                    <div className='shield-sm'>
                        <Shield
                            items={props.build['shields']}
                            color={props.color}
                            size={props.size}
                            getNewItem={getNewItem}
                        />
                    </div>
                </div>
                <div className='flex-container-sm'>
                    <div className='flex-row-1'>
                        <div className='weapons-sm'>
                            <Weapons
                                items={props.build['weapons']}
                                color={props.color}
                                size={props.size}
                                getNewItem={getNewItem}
                            />
                        </div>

                        <div className='sorcs-sm'>
                            <Sorceries
                                items={props.build['sorcs']}
                                color={props.color}
                                size={props.size}
                                getNewItem={getNewItem}
                            />
                        </div>
                    </div>
                    <div className='flex-row-2'>
                        <div className='armor-sm'>
                            <Armors
                                items={props.build['armor']}
                                color={props.color}
                                size={props.size}
                                getNewItem={getNewItem}
                            />
                        </div>
                        <div className='incants-sm'>
                            <Incantations
                                items={props.build['incants']}
                                color={props.color}
                                size={props.size}
                                getNewItem={getNewItem}
                            />
                        </div>
                    </div>
                    <div className='flex-row-3'>
                        <div className='talismans-sm'>
                            <Talismans
                                items={props.build['talismans']}
                                color={props.color}
                                size={props.size}
                                getNewItem={getNewItem}
                            />
                        </div>

                        <div className='ashes-sm'>
                            <Ashes
                                items={props.build['ashes']}
                                color={props.color}
                                size={props.size}
                                getNewItem={getNewItem}
                            />
                        </div>
                        <div className='spirits-sm'>
                            <Spirits
                                items={props.build['spirits']}
                                color={props.color}
                                size={props.size}
                                getNewItem={getNewItem}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SmallLayout
