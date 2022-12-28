import SecondaryItems from "../components/SecondaryItems";
import Button from "react-bootstrap/Button";
import StartingClass from "../components/StartingClass";
import Weapons from "../components/Weapons";
import Armors from "../components/Armors";

function LargeLayout(props) {
    // Need buttonstate, css, generate props.build func, props.build
    return (
        <>
            <div className='body-container-lg'>
                <div
                    className={`class-button-container${props.color}${props.size}`}>
                    <StartingClass
                        starting_class={props.build["starting_class"]}
                    />
                    <div className='button-container'>
                        <Button
                            className='button-large'
                            onClick={props.generateNewBuild}
                            variant='danger'>
                            GENERATE NEW BUILD
                        </Button>
                    </div>
                </div>
                <Weapons
                    weapons={props.build["weapons"]}
                    shields={props.build["shields"]}
                    color={props.color}
                    size={props.size}
                />
                <Armors
                    items={props.build["armor"]}
                    color={props.color}
                    size={props.size}
                />
                <SecondaryItems
                    color={props.color}
                    items={props.build}
                    size={props.size}
                />
            </div>
        </>
    );
}

export default LargeLayout;
