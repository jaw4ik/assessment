import ImageLibrary from './imageLibrary';
import app from 'durandal/app';
import constants from 'constants';

let viewModel = new ImageLibrary();
app.on(constants.messages.library.defaultActivate, viewModel.activate.bind(viewModel));

export default viewModel;