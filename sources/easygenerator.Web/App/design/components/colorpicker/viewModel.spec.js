import ko from 'knockout';

import Colorpicker from './viewModel';

describe('component [colorpicker]', () => {

    describe('constructor:', () => {
        describe('when params are not defined', () => {
            it('should set black color as default', () => {
                let colorpicker = new Colorpicker();
                expect(colorpicker.hex()).toEqual('#000000');
            });
        });
        describe('when params has hex param as a string', () => {
            it('should set corresponding color', () => {
                let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                expect(colorpicker.hex()).toEqual('#aabbcc');
            });
        });
        describe('when params has observable hex', () => {
            it('should set corresponding color', () => {
                let colorpicker = new Colorpicker({ hex: ko.observable('#aabbcc') });
                expect(colorpicker.hex()).toEqual('#aabbcc');
            });

            it('should notify this observable parent', () => {
                let observable = ko.observable('#aabbcc');
                let colorpicker = new Colorpicker({ hex: observable });

                colorpicker.hex('#bababa');

                expect(observable()).toEqual('#bababa');
            }); 
        });
    });

    describe('hex:', () => {
        it('should be computed', () => {
            let colorpicker = new Colorpicker({ hex: '#aabbcc' });
            expect(colorpicker.hex).toBeComputed();
            expect(colorpicker.hex()).toEqual('#aabbcc');
        });

        describe('when updated', () => {
            describe('and hex is not valid', () => {
                it('should not update current value', () => {
                    let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                    colorpicker.hex('@@');
                    expect(colorpicker.hex()).toEqual('#aabbcc');
                });
            });
            describe('and hex does not start with #', () => {
                it('should not update current value', () => {
                    let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                    colorpicker.hex('ebebeb');
                    expect(colorpicker.hex()).toEqual('#aabbcc');
                });
            });
            describe('and hex is valid', () => {
                it('should update current value', () => {
                    let colorpicker = new Colorpicker({ hex: '#bababa' });
                    colorpicker.hex('#aabbcc');
                    expect(colorpicker.hex()).toEqual('#aabbcc');
                });
                it('should trigger callback', done => {
                    let colorpicker = new Colorpicker({ hex: '#bababa', callback: done });
                    colorpicker.hex('#aabbcc');
                });
            });
        });
    });

    describe('rgb:', () => {
        describe('r:', () => {
            it('should be computed', () => {
                let colorpicker = new Colorpicker();
                expect(colorpicker.rgb.r).toBeComputed();
            });
            describe('when hex is not defined', () => {
                it('should return 0', () => {
                    let colorpicker = new Colorpicker();
                    expect(colorpicker.rgb.r()).toEqual(0);
                });
            });
            describe('when hex is not valid', () => {
                it('should return 0', () => {
                    let colorpicker = new Colorpicker({ hex: '@' });
                    expect(colorpicker.rgb.r()).toEqual(0);
                });
            });
            describe('when hex is valid', () => {
                it('should return corresponding red color value', () => {
                    let colorpicker = new Colorpicker({ hex: '#ff0000' });
                    expect(colorpicker.rgb.r()).toEqual(255);
                });
            });
            describe('when updated', () => {
                describe('and value is less then 0', () => {
                    it('it should set 0 to red', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.r(-1);
                        expect(colorpicker.rgb.r()).toEqual(0);
                        expect(colorpicker.hex()).toEqual('#00bbcc');
                    });
                });
                describe('and  value is more than 255', () => {
                    it('it should set 255 to red', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.r(1000);
                        expect(colorpicker.rgb.r()).toEqual(255);
                        expect(colorpicker.hex()).toEqual('#ffbbcc');
                    });
                });
                describe('and value is not a number', () => {
                    it('it should set 0 to red', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.r('5+');
                        expect(colorpicker.rgb.r()).toEqual(0);
                        expect(colorpicker.hex()).toEqual('#00bbcc');
                    });
                });
                describe('and value is valid', () => {
                    it('should set corresponding value of red', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.r(25);
                        expect(colorpicker.hex()).toEqual('#19bbcc');
                    });
                });
                it('should trigger callback', done => {
                    let colorpicker = new Colorpicker({ hex: '#bababa', callback: done });
                    colorpicker.rgb.r(25);
                });
            });
        });
        describe('g:', () => {
            it('should be computed', () => {
                let colorpicker = new Colorpicker();
                expect(colorpicker.rgb.g).toBeComputed();
            });
            describe('when hex is not defined', () => {
                it('should return 0', () => {
                    let colorpicker = new Colorpicker();
                    expect(colorpicker.rgb.g()).toEqual(0);
                });
            });
            describe('when hex is not valid', () => {
                it('should return 0', () => {
                    let colorpicker = new Colorpicker({ hex: '@' });
                    expect(colorpicker.rgb.g()).toEqual(0);
                });
            });
            describe('when hex is valid', () => {
                it('should return corresponding green color value', () => {
                    let colorpicker = new Colorpicker({ hex: '#00ff00' });
                    expect(colorpicker.rgb.g()).toEqual(255);
                });
            });
            describe('when updated', () => {
                describe('and value is less then 0', () => {
                    it('it should set 0 to green', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.g(-1);
                        expect(colorpicker.rgb.g()).toEqual(0);
                        expect(colorpicker.hex()).toEqual('#aa00cc');
                    });
                });
                describe('and  value is more than 255', () => {
                    it('it should set 255 to green', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.g(1000);
                        expect(colorpicker.rgb.g()).toEqual(255);
                        expect(colorpicker.hex()).toEqual('#aaffcc');
                    });
                });
                describe('and value is not a number', () => {
                    it('it should set 0 to green', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.g('5+');
                        expect(colorpicker.rgb.g()).toEqual(0);
                        expect(colorpicker.hex()).toEqual('#aa00cc');
                    });
                });
                describe('is value is a valid color value', () => {
                    it('should update hex', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.g(25);
                        expect(colorpicker.hex()).toEqual('#aa19cc');
                    });
                });
                it('should trigger callback', done => {
                    let colorpicker = new Colorpicker({ hex: '#bababa', callback: done });
                    colorpicker.rgb.g(25);
                });
            });
        });
        describe('b:', () => {
            it('should be computed', () => {
                let colorpicker = new Colorpicker();
                expect(colorpicker.rgb.b).toBeComputed();
            });
            describe('when hex is not defined', () => {
                it('should return 0', () => {
                    let colorpicker = new Colorpicker();
                    expect(colorpicker.rgb.b()).toEqual(0);
                });
            });
            describe('when hex is not valied', () => {
                it('should return 0', () => {
                    let colorpicker = new Colorpicker({ hex: '@' });
                    expect(colorpicker.rgb.b()).toEqual(0);
                });
            });
            describe('when hex is valid', () => {
                it('should return corresponding blue color value', () => {
                    let colorpicker = new Colorpicker({ hex: '#0000ff' });
                    expect(colorpicker.rgb.b()).toEqual(255);
                });
            });
            describe('when updated', () => {
                describe('and value is less then 0', () => {
                    it('it should set 0 to blue', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.b(-1);
                        expect(colorpicker.rgb.b()).toEqual(0);
                        expect(colorpicker.hex()).toEqual('#aabb00');
                    });
                });
                describe('and  value is more than 255', () => {
                    it('it should set 255 to blue', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.b(1000);
                        expect(colorpicker.rgb.b()).toEqual(255);
                        expect(colorpicker.hex()).toEqual('#aabbff');
                    });
                });
                describe('and value is not a number', () => {
                    it('it should set 0 to blue', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.b('5+');
                        expect(colorpicker.rgb.b()).toEqual(0);
                        expect(colorpicker.hex()).toEqual('#aabb00');
                    });
                });
                describe('is value is a valid color value', () => {
                    it('should update hex', () => {
                        let colorpicker = new Colorpicker({ hex: '#aabbcc' });
                        colorpicker.rgb.b(25);
                        expect(colorpicker.hex()).toEqual('#aabb19');
                    });
                });
                it('should trigger callback', done => {
                    let colorpicker = new Colorpicker({ hex: '#bababa', callback: done });
                    colorpicker.rgb.b(25);
                });
            });
        });
    });

    describe('palette:', () => {
        it('should be an array of default colors', () => {
            let colorpicker = new Colorpicker();
            expect(colorpicker.palette).toBeArray();
            expect(colorpicker.palette.length).toEqual(36);
        });
    });
    describe('isPaletteVisible:', () => {
        it('should be observable', () => {
            let colorpicker = new Colorpicker();
            expect(colorpicker.isPaletteVisible).toBeObservable();
        });
        it('should be falsy by default', () => {
            let colorpicker = new Colorpicker();
            expect(colorpicker.isPaletteVisible()).toBeFalsy();
        });
        describe('when params has palette property set to true', () => {
            it('should set isVisible to true', () => {
                let colorpicker = new Colorpicker({ hex: '#aabbcc', palette: true });
                expect(colorpicker.isPaletteVisible()).toBeTruthy();
            });
        });
    });

    describe('select:', () => {
        it('should set selected color', () => {
            let colorpicker = new Colorpicker();
            colorpicker.select('#aabbcc');
            expect(colorpicker.hex()).toEqual('#aabbcc');
        });
    });
});