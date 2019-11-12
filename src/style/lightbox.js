import { css } from 'styled-components';
import { IconButton } from '@components/Button';
import Media from '@style/media';

export default css`

    /* Hide the default close button in favour of our component */
    .ril__close {
        display: none;
    }

    .lightbox-close {
        position: absolute;
        left: 1.5rem;
        bottom: 1.5rem;
        width: 4.8rem;
        margin: 0;

        ${Media.tablet`
            left: 3rem;
            bottom: 3rem;
        `}
    }

    @keyframes closeWindow {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    
    .ril__outer {
        background: ${props => props.theme.colourBackground};
        outline: none;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        width: 100%;
        height: 100%;
        -ms-content-zooming: none;
        -ms-user-select: none;
        -ms-touch-select: none;
        -ms-touch-action: none;
            touch-action: none;
    }
    
    .ril__outerClosing {
        opacity: 0;
    }
    
    .ril__inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    
    .ril__image {
        bottom: 7.8rem;
        height: calc(100% - 15.6rem);
        left: 0;
        object-fit: contain;
        right: 0;
        top: 7.8rem;
        transform: none !important;
        width: 100%;

        ${Media.tablet`
            bottom: 9.3rem;
            height: calc(100% - 18.6rem);
            top: 9.3rem;
        `}
    }

    .ril__image,
    .ril__imagePrev,
    .ril__imageNext {
        position: absolute;
        top: 7.8rem;
        right: 0;
        bottom: 7.8rem;
        left: 0;
        margin: auto;
        max-width: none;
        -ms-content-zooming: none;
        -ms-user-select: none;
        -ms-touch-select: none;
        -ms-touch-action: none;
            touch-action: none;
    }
    
    .ril__imageDiscourager {
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    
    .ril__navButtons {
        border: none;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 20px;
        height: 34px;
        padding: 40px 30px;
        margin: auto;
        cursor: pointer;
        opacity: 0.7;
    }
    .ril__navButtons:hover {
        opacity: 1;
    }
    .ril__navButtons:active {
        opacity: 0.7;
    }
    
    .ril__navButtonPrev {
        left: 0;
        background: rgba(0, 0, 0, 0.2)
        url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjM0Ij48cGF0aCBkPSJtIDE5LDMgLTIsLTIgLTE2LDE2IDE2LDE2IDEsLTEgLTE1LC0xNSAxNSwtMTUgeiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==')
        no-repeat center;
    }
    
    .ril__navButtonNext {
        right: 0;
        background: rgba(0, 0, 0, 0.2)
        url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjM0Ij48cGF0aCBkPSJtIDEsMyAyLC0yIDE2LDE2IC0xNiwxNiAtMSwtMSAxNSwtMTUgLTE1LC0xNSB6IiBmaWxsPSIjRkZGIi8+PC9zdmc+')
        no-repeat center;
    }
    
    .ril__downloadBlocker {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        background-size: cover;
    }
    
    .ril__caption,
    .ril__toolbar {
        background: transparent;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
    }
    
    .ril__caption {
        bottom: 0;
        max-height: 150px;
        overflow: auto;
    }
    
    .ril__captionContent {
        padding: 10px 20px;
        color: #fff;
    }
    
    .ril__toolbar {
        bottom: 0;
        height: 4.8rem;
    }
    
    .ril__toolbarSide {
        height: 4.8rem;
        margin: 0;
    }
    
    .ril__toolbarLeftSide {
        padding-left: 20px;
        padding-right: 0;
        -webkit-box-flex: 0;
            -ms-flex: 0 1 auto;
                flex: 0 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .ril__toolbarRightSide {
        padding-left: 0;
        -webkit-box-flex: 0;
            -ms-flex: 0 0 auto;
                flex: 0 0 auto;
    }
    
    .ril__toolbarItem {
        display: inline-block;
        line-height: 50px;
        padding: 0;
        color: #fff;
        font-size: 120%;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .ril__toolbarItemChild {
        vertical-align: middle;
    }
    
    .ril__builtinButton {
        width: 40px;
        height: 35px;
        cursor: pointer;
        border: none;
        opacity: 0.7;
    }
    .ril__builtinButton:hover {
        opacity: 1;
    }
    .ril__builtinButton:active {
        outline: none;
    }
    
    .ril__builtinButtonDisabled {
        cursor: default;
        opacity: 0.5;
    }
    .ril__builtinButtonDisabled:hover {
        opacity: 0.5;
    }
    
    .ril__closeButton {
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIj48cGF0aCBkPSJtIDEsMyAxLjI1LC0xLjI1IDcuNSw3LjUgNy41LC03LjUgMS4yNSwxLjI1IC03LjUsNy41IDcuNSw3LjUgLTEuMjUsMS4yNSAtNy41LC03LjUgLTcuNSw3LjUgLTEuMjUsLTEuMjUgNy41LC03LjUgLTcuNSwtNy41IHoiIGZpbGw9IiNGRkYiLz48L3N2Zz4=')
        no-repeat center;
    }
    
    .ril__zoomInButton {
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTEgMTlsNi02Ii8+PHBhdGggZD0iTTkgOGg2Ii8+PHBhdGggZD0iTTEyIDV2NiIvPjwvZz48Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+')
        no-repeat center;
    }
    
    .ril__zoomOutButton {
        background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTEgMTlsNi02Ii8+PHBhdGggZD0iTTkgOGg2Ii8+PC9nPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')
        no-repeat center;
    }
    
    .ril__outerAnimating {
        -webkit-animation-name: closeWindow;
                animation-name: closeWindow;
    }
    
    @-webkit-keyframes pointFade {
        0%,
        19.999%,
        100% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
    }
    
    @keyframes pointFade {
        0%,
        19.999%,
        100% {
        opacity: 0;
        }
        20% {
        opacity: 1;
        }
    }
    
    .ril__loadingCircle {
        display: none;
    }
    
    .ril__loadingCirclePoint {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .ril__loadingCirclePoint::before {
        content: '';
        display: block;
        margin: 0 auto;
        width: 11%;
        height: 30%;
        background-color: #fff;
        border-radius: 30%;
        -webkit-animation: pointFade 800ms infinite ease-in-out both;
                animation: pointFade 800ms infinite ease-in-out both;
    }
    .ril__loadingCirclePoint:nth-of-type(1) {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
    }
    .ril__loadingCirclePoint:nth-of-type(7) {
        -webkit-transform: rotate(180deg);
                transform: rotate(180deg);
    }
    .ril__loadingCirclePoint:nth-of-type(1)::before,
    .ril__loadingCirclePoint:nth-of-type(7)::before {
        -webkit-animation-delay: -800ms;
                animation-delay: -800ms;
    }
    .ril__loadingCirclePoint:nth-of-type(2) {
        -webkit-transform: rotate(30deg);
                transform: rotate(30deg);
    }
    .ril__loadingCirclePoint:nth-of-type(8) {
        -webkit-transform: rotate(210deg);
                transform: rotate(210deg);
    }
    .ril__loadingCirclePoint:nth-of-type(2)::before,
    .ril__loadingCirclePoint:nth-of-type(8)::before {
        -webkit-animation-delay: -666ms;
                animation-delay: -666ms;
    }
    .ril__loadingCirclePoint:nth-of-type(3) {
        -webkit-transform: rotate(60deg);
                transform: rotate(60deg);
    }
    .ril__loadingCirclePoint:nth-of-type(9) {
        -webkit-transform: rotate(240deg);
                transform: rotate(240deg);
    }
    .ril__loadingCirclePoint:nth-of-type(3)::before,
    .ril__loadingCirclePoint:nth-of-type(9)::before {
        -webkit-animation-delay: -533ms;
                animation-delay: -533ms;
    }
    .ril__loadingCirclePoint:nth-of-type(4) {
        -webkit-transform: rotate(90deg);
                transform: rotate(90deg);
    }
    .ril__loadingCirclePoint:nth-of-type(10) {
        -webkit-transform: rotate(270deg);
                transform: rotate(270deg);
    }
    .ril__loadingCirclePoint:nth-of-type(4)::before,
    .ril__loadingCirclePoint:nth-of-type(10)::before {
        -webkit-animation-delay: -400ms;
                animation-delay: -400ms;
    }
    .ril__loadingCirclePoint:nth-of-type(5) {
        -webkit-transform: rotate(120deg);
                transform: rotate(120deg);
    }
    .ril__loadingCirclePoint:nth-of-type(11) {
        -webkit-transform: rotate(300deg);
                transform: rotate(300deg);
    }
    .ril__loadingCirclePoint:nth-of-type(5)::before,
    .ril__loadingCirclePoint:nth-of-type(11)::before {
        -webkit-animation-delay: -266ms;
                animation-delay: -266ms;
    }
    .ril__loadingCirclePoint:nth-of-type(6) {
        -webkit-transform: rotate(150deg);
                transform: rotate(150deg);
    }
    .ril__loadingCirclePoint:nth-of-type(12) {
        -webkit-transform: rotate(330deg);
                transform: rotate(330deg);
    }
    .ril__loadingCirclePoint:nth-of-type(6)::before,
    .ril__loadingCirclePoint:nth-of-type(12)::before {
        -webkit-animation-delay: -133ms;
                animation-delay: -133ms;
    }
    .ril__loadingCirclePoint:nth-of-type(7) {
        -webkit-transform: rotate(180deg);
                transform: rotate(180deg);
    }
    .ril__loadingCirclePoint:nth-of-type(13) {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
    }
    .ril__loadingCirclePoint:nth-of-type(7)::before,
    .ril__loadingCirclePoint:nth-of-type(13)::before {
        -webkit-animation-delay: 0ms;
                animation-delay: 0ms;
    }
    
    .ril__loadingContainer {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    .ril__imagePrev .ril__loadingContainer,
    .ril__imageNext .ril__loadingContainer {
        display: none;
    }
    
    .ril__errorContainer {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        color: #fff;
    }
    .ril__imagePrev .ril__errorContainer,
    .ril__imageNext .ril__errorContainer {
        display: none;
    }
    
    .ril__loadingContainer__icon {
        color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
    }
`;
