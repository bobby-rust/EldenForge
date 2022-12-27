import React from 'react'
import '../App.css'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

type HeaderProps = {
    color: string
    colorButtonState: boolean
    layoutButtonState: boolean
    handleColorChange: () => void
    handleLayoutChange: () => void
}

function Header(props: HeaderProps) {
    /**
     * This is NOT a generic component.
     * It remains constant through every layout and can be styled here.
     */
    return (
        <div className={`header-container${props.color}`}>
            <div className='logo-container'>
                <div className='logo-inner'>
                    <div className='logo'>
                        <div className='ER'>ER</div>
                        <div className='BG'>BG</div>
                    </div>
                </div>
            </div>
            <div className='toggle-button-container'>
                <div className='toggle-button-label'>Dark mode</div>
                <BootstrapSwitchButton
                    checked={props.colorButtonState}
                    onstyle='dark'
                    offstyle='light'
                    style='border'
                    width={90}
                    onChange={props.handleColorChange}
                />
            </div>
            <div className='toggle-button-container'>
                <div className='toggle-button-label'>Large Layout</div>
                <BootstrapSwitchButton
                    checked={props.layoutButtonState}
                    onstyle='dark'
                    offstyle='light'
                    style='border'
                    width={90}
                    onChange={props.handleLayoutChange}
                />
            </div>
            <div className='title-container'>
                <div className='title-inner'>
                    <h1 className='header-title'>
                        Elden Ring Random Build Generator
                    </h1>
                </div>
            </div>
            <div className='dev-message-container'>
                <div className='dev-message-inner'>
                    <p className='dev-message'>
                        This tool is in development. Some features may not work.
                        View this project on{' '}
                        <a
                            target='_blank'
                            rel='noreferrer'
                            href='https://github.com/bobby-rust/elden-ring-random-build-generator/tree/master'
                        >
                            github
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Header
