import LrsOption from './lrsOption.js';

describe('[lrsOption]', function () {
    let viewModel;

    it('should define name', () => {
        viewModel = new LrsOption('name', true);
        expect(viewModel.name).toBe('name');
    });

    it('should define isSelected', () => {
        viewModel = new LrsOption('name', true);
        expect(viewModel.isSelected()).toBe(true);
    });
});