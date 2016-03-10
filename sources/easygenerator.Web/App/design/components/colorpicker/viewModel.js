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
                    currentValue(' ');
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

        
        if(params.colors){
            this.palette = params.colors;
        }
        else{
            this.palette = [
            '#43aaa3', '#2d9ec6', '#336577', '#33b3e2', '#46a24a', '#aed580', '#3d85c6', '#7596b7', '#42515f', '#63798e', '#000000', '#ffffff',
            '#faaf4a', '#f16162', '#9db2c0', '#999999', '#aeea00', '#673ab7', '#45818e', '#76a5af', '#6fa8dc', '#9fc5e8', '#cfe2f3', '#e7f0f9'
            ];
        }

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