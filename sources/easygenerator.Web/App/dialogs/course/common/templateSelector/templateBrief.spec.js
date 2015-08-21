define(['dialogs/course/common/templateSelector/templateBrief'], function (TemplateBrief) {
	"use strict";

	var template = {
		id: 'id',
		name: 'name',
		thumbnail: 'thumb',
		previewImages: [{}],
		shortDescription: 'description',
		order: 0
	},
		viewModel;

	describe('dialog course common templateSelector [templateBrief]', function () {

		beforeEach(function () {
			viewModel = new TemplateBrief(template);
		});

	    describe('id:', function() {
	        it('should be set', function() {
	            expect(viewModel.id).toBe(template.id);
	        });
	    });

	    describe('name:', function () {
	    	it('should be set', function () {
	    		expect(viewModel.name).toBe(template.name);
	    	});
	    });

	    describe('thumbnail:', function () {
	    	it('should be set', function () {
	    		expect(viewModel.thumbnail).toBe(template.thumbnail);
	    	});
	    });

	    describe('description:', function () {
	    	it('should be set', function () {
	    		expect(viewModel.description).toBe(template.shortDescription);
	    	});
	    });

	    describe('order:', function () {
	    	it('should be set', function () {
	    		expect(viewModel.order).toBe(template.order);
	    	});
	    });

	    describe('previewImages:', function () {
	    	it('should be set', function () {
	    		expect(viewModel.previewImages).toBe(template.previewImages);
	    	});
	    });
	});

});
