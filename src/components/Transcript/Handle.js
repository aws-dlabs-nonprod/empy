import React from 'react';
import styled from 'styled-components';

const Handle = (props) => {
    const { className } = props;

    return (
        <div className={ className }>

        </div>
    );
};

export default styled(Handle)`
    position: absolute;
    height: 4.8rem;
    width: 100%;
    background: rgba(255, 0, 0, 0.1);
    top: -3.3rem;

    &:after {
        content: '';
        background: ${props => props.theme.colourBackground};
        border-radius: 1rem;
        height: 0.6rem;
        left: 0;
        margin: 0 auto;
        position: absolute;
        right: 0;
        top: 2.1rem;
        width: 3.1rem;
    }
`;
