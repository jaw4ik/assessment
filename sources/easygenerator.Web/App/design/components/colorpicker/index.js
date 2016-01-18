import Colorpicker from './viewModel.js';
import view from './view.html!text'

ko.components.register('colorpicker', {
    viewModel: Colorpicker,
    template: view
});