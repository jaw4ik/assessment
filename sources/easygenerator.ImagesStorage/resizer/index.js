'use strict';

var gm = require('gm');

class ImageResizer {
    constructor(buffer) {
        this.image = gm(buffer);
    }
    getImageData(getter) {
        return new Promise((resolve, reject) => {
            if (typeof this.image[getter] !== 'function') {
                throw `${getter} is not a valid getter`;
            }
            this.image[getter]((err, value) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            });
        });
    }
    static get getters() {
        return {
            size: 'size', //returns the size (WxH) of the image
            format: 'format', //returns the image format (gif, jpeg, png, etc)
            depth: 'depth', //returns the image color depth
            color: 'color', //returns the number of colors
            res: 'res', //returns the image resolution
            filesize: 'filesize', //returns image filesize
            identify: 'identify', //returns all image data available
            orientation: 'orientation' //returns the EXIF orientation of the image
        };
    }
    resize(width, height, scaleBySmallerSide) {
        return this._resize(width, height, scaleBySmallerSide);
    }
    _resize(width, height, scaleBySmallerSide) {
        const scaleByWidth = (scaleBySmallerSide && width < height) || (!scaleBySmallerSide && width > height);
        return this.getImageData(ImageResizer.getters.size)
            .then(size => {
                return new Promise((resolve, reject) => {
                    if (scaleByWidth && size.width > width) {
                        this.image.resize(width, null).toBuffer((err, buffer) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(buffer);
                        });
                    } else if (!scaleByWidth && size.height > height) {
                        this.image.resize(null, height).toBuffer((err, buffer) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(buffer);
                        });
                    } else {
                        resolve(null);
                    }
                });
            });
    }
}

module.exports = ImageResizer;