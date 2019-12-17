import { detect } from 'detect-browser';

const isMobile = () => {
    return window.innerWidth < 768;
};

const isDesktop = () => {
    return window.innerWidth >= 992;
};

const supportsAudioOnly = () => {
    const browser = detect();

    // Safari on macOS and iOS do not allow WebRTC video without camera permission
    // See https://stackoverflow.com/a/53914556
    if (['safari', 'ios'].indexOf(browser.name) >= 0) {
        return false;
    }

    return true;
};

const isCompatible = () => {
    const browser = detect();

    // Chrome and Firefox on Safari do not allow access to
    // the microphone or camera
    if (['crios', 'fxios'].indexOf(browser.name) >= 0) {
        return false;
    }

    return true;
};

export {
    isMobile,
    isDesktop,
    supportsAudioOnly,
    isCompatible
};
