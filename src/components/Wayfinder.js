import React, { Component } from 'react';
import styled from 'styled-components';
import { SoulMachinesContext } from '@contexts/SoulMachines';
import { CSSTransition } from 'react-transition-group';
import Media from '@style/media';

class Wayfinder extends Component {

    static contextType = SoulMachinesContext;

    static defaultProps = {
        title: '',
        options: [],
        isStandAlone: false
    };

    constructor() {
        super();

        this.handleChoosePrompt = this.handleChoosePrompt.bind(this);
    }

    handleChoosePrompt(message) {
        this.context.sendMessage(message, true);
    }

    render() {
        const { title, options, isOpen, className, isStandAlone } = this.props;

        const Component = isStandAlone ? StyledStandAloneWayfinder : StyledWayfinder;

        return (
            <CSSTransition in={ isOpen } timeout={ 300 } unmountOnExit classNames="wayfinder">
                <Component className={ className }>
                    <span>{ title }</span>

                    { options.map((item, index) => (
                        <a key={ index } onClick={ () => this.handleChoosePrompt(item) }>
                            { item }
                        </a>
                    ))}
                </Component>
            </CSSTransition>
        );
    }
}

const StyledWayfinder = styled.div`
    left: 0;
    right: 0;
    z-index: 1;

    span {
        display: block;
        color: ${props => props.theme.textDark};
        font-size: 1.6rem;
        margin: 0 0 2rem 0;
    }

    a {
        font-size: 1.8rem;
        line-height: 1.25;
        color: ${props => props.theme.textDark};
        display: block;
        font-family: 'ChronicleDisplay', serif;
        margin: 0 0 2rem 0;
        opacity: 0;
        transition: opacity 0.5s ease-in-out, color 0.3s ease-in-out;
    
        &:nth-child(2) {
            transition-delay: 0.5s;
        }

        &:nth-child(3) {
            transition-delay: 1s;
        }

        &:nth-child(4) {
            transition-delay: 1.5s;
        }

        &:nth-child(5) {
            transition-delay: 2.0s;
        }

        &:nth-child(6) {
            transition-delay: 2.5s;
        }

        &:last-child {
            margin-bottom: 0;
        }

        ${Media.desktop`
            font-size: 2.4rem;

            &:hover {
                color: #a37a93;
            }
        `}
    }

    article a {
        &:after {
            display: none;
        }
    }

    ${Media.desktop`
        left: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0;

        a {
            font-size: 2.2rem;
        }
    `}

    /* Enter/Exit animation */
    &.wayfinder-enter {
        a {
            opacity: 0;
        }
    }

    &.wayfinder-enter-done,
    &.wayfinder-enter-active {
        a {
            opacity: 1;
        }
    }

    &.wayfinder-enter-done {
        a {
            transition-delay: 0s;
        }
    }

    &.wayfinder-exit {
        a {
            opacity: 1;
        }
    }

    &.wayfinder-exit-done,
    &.wayfinder-exit-active {
        a {
            opacity: 0;
        }
    }
`;

const StyledStandAloneWayfinder = styled(StyledWayfinder)`
    position: absolute;
    bottom: 7.8rem;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    z-index: 1;
    display: none;

    a {
        opacity: 0;
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out, color 0.3s ease-in-out;
        transform: translateX(-2rem);
        
        ${Media.desktop`
            font-size: 3.2rem;
        `}
    }

    ${Media.desktop`
        width: 34rem;
        left: auto;
        right: 6rem;
        top: 15rem;
    `}

    /* Enter/Exit animation */
    &.wayfinder-enter {
        opacity: 0;

        a {
            opacity: 0;
            transform: translateX(-2rem);
        }
    }

    &.wayfinder-enter-done,
    &.wayfinder-enter-active {
        opacity: 1;

        a {
            opacity: 1;
            transform: translateX(0rem);
        }
    }

    &.wayfinder-enter-done {
        a {
            transition-delay: 0s;
        }
    }

    &.wayfinder-exit {
        opacity: 1;

        a {
            opacity: 1;
            transform: translateX(0rem);
        }
    }

    &.wayfinder-exit-done,
    &.wayfinder-exit-active {
        opacity: 0;

        a {
            opacity: 0;
            transform: translateX(-2rem);
        }
    }
`;

export default Wayfinder;
