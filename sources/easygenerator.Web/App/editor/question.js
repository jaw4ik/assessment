//This file must be deleted when question popup will be added
import questionViewModel from 'viewmodels/questions/question';
import router from 'plugins/router';


questionViewModel.back = () => {
    router.navigate(`#courses/${questionViewModel.courseId}`);
}

questionViewModel.viewUrl = 'views/questions/question';

export default questionViewModel;