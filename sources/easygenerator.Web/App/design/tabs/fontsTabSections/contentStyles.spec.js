import ContentStyles from './ContentStyles';

import userContext from 'userContext';

import {ContentElement} from './generalStyles';

let describe = window.describe;
let it = window.it;
let expect = window.expect;
let beforeEach = window.beforeEach;
let spyOn = window.spyOn;

describe('Content styles design section', () => {
    
    it('should create content styles fonts section', ()=>{
        
        let contentStyles = new ContentStyles();
        expect(contentStyles.title).toBeDefined();

    });

    describe('expanded:', () => {

        it('should be observable', () => {
            let contentStyles = new ContentStyles();
            expect(contentStyles.expanded).toBeObservable();
        });

    });

    describe('toggleExpanded:', () => {

        it('should change expanded state', () => {
            let contentStyles = new ContentStyles();
            contentStyles.expanded(false);

            contentStyles.toggleExpanded();

            expect(contentStyles.expanded()).toBeTruthy();
        });

    });
    describe('elements:', () => {
    
        it('should be an observable array', () => {
            let contentStyles = new ContentStyles();
            expect(contentStyles.elements).toBeObservableArray();
        });

    });
    
    describe('activate:', () => {
            
        describe('when user has Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
            });

            it('should set available true', () =>{

                let settings = {
                    fonts: [
                        {
                            key: 'main-font',
                            fontFamily: 'fontFamily',
                        }
                    ],
                    branding:{
                        colors:[
                            {
                                key:  "@text-color",
                                value:'color'
                            },
                            {
                                key:  "@secondary-color",
                                value:'color2'
                            },
                            {
                                key:  "@content-body-color",
                                value:'color3'
                            }
                        ]
                    }
                };
                let defaults = {
                    fonts: [
                        {
                            key: 'main-font',
                            fontFamily: 'fontFamily',
                        }
                    ],
                    branding:{
                        colors:[
                            {
                                key:  "@text-color",
                                value:'color'
                            },
                            {
                                key:  "@secondary-color",
                                value:'color2'
                            },
                            {
                                key:  "@content-body-color",
                                value:'color3'
                            }
                        ]
                    }
                };


                let contentStyles = new ContentStyles();
                contentStyles.activate(settings, defaults);

                expect(contentStyles.available).toBeTruthy();
        
            })
        
        })

        describe('when user doesn`t have  Plus plan', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
            });

            it('should set available false', () =>{
                let settings = {
                    fonts: [
                        {
                            key: 'main-font',
                            fontFamily: 'fontFamily',
                        }
                    ],
                    branding:{
                        colors:[
                            {
                                key:  "@text-color",
                                value:'color'
                            },
                            {
                                key:  "@secondary-color",
                                value:'color2'
                            },
                            {
                                key:  "@content-body-color",
                                value:'color3'
                            }
                        ]
                    }
                };
                let defaults = {
                    fonts: [
                        {
                            key: 'main-font',
                            fontFamily: 'fontFamily',
                        }
                    ],
                    branding:{
                        colors:[
                            {
                                key:  "@text-color",
                                value:'color'
                            },
                            {
                                key:  "@secondary-color",
                                value:'color2'
                            },
                            {
                                key:  "@content-body-color",
                                value:'color3'
                            }
                        ]
                    }
                };

                let contentStyles = new ContentStyles();
                contentStyles.activate(settings, defaults);

                expect(contentStyles.available).toBeFalsy();
        
            });
        
        });

    });

});

