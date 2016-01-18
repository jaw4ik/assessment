import $ from 'jquery';
import ko from 'knockout';
import _ from 'underscore';

export default class Colorpicker{
    constructor(params) {
        params = params || {};
        
        let currentValue;
        if (ko.isObservable(params.hex)) {
            currentValue = params.hex;
        } else {
            currentValue = ko.observable(params.hex);
        }

        if (!hexToRgb(currentValue())) {
            currentValue('#000000');
        }

        this.hex = (() => {
            return ko.computed({
                read: () => {
                    return currentValue();
                },
                write: value => {
                    let previousValue = currentValue();
                    currentValue('');
                    currentValue(value);

                    if (!hexToRgb(value)) {
                        currentValue(previousValue);
                    }
                    if (_.isFunction(params.callback)) {
                        params.callback();
                    }
                }
            });
        })();
        this.rgb = ['r', 'g', 'b'].reduce((obj, current) => {
            obj[current] = ko.computed({
                read: () => {
                    let rgb = hexToRgb(this.hex());
                    return rgb && rgb[current];
                },
                write: value => {
                    value = +value;
                    if (isNaN(value) || value < 0) {
                        value = 0;
                    } else if (value > 255) {
                        value = 255;
                    }

                    let rgb = hexToRgb(this.hex());
                    rgb[current] = value;
                    this.hex(rgbToHex(rgb));
                }
            });

            return obj;
        }, {});

        this.palette = [
            '#ffffff', '#000000', '#111111', '#222222', '#333333', '#666666', '#999999', '#aaaaaa', '#cccccc', '#eeeeee', '#fffff0', '#f5f5dc',
            '#f5deb3', '#d2b48c', '#c3b091', '#000080', '#084c9e', '#0000cd', '#007fff', '#00ffff', '#7fffd4', '#008080', '#228b22', '#808000',
            '#7fff00', '#bfff00', '#ffd700', '#daa520', '#ff7f50', '#fa8072', '#fc0fc0', '#e0b0ff', '#843179', '#4b0082', '#800000', '#dc143c'
        ];
        this.isPaletteVisible = ko.observable(params.palette || false);
    }

    select(hex) {
        this.hex(hex);
    }
}

function rgbToHex(rgb) {
    rgb = rgb.b | (rgb.g << 8) | (rgb.r << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
}

function hexToRgb(hex) {
    if (!hex || !hex.length) {
        return null;
    }

    if (hex.indexOf('#') !== 0) {
        return null;
    }

    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}