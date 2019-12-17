/**
 * Renders an SVG sprite reference
 */
const svgSprite = (icon) => {
    return `<svg viewBox="${icon.default.viewBox}">
                <use xlink:href="#${icon.default.id}" />
            </svg>`;
};

export default svgSprite;
