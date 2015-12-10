import uiLockViewer from 'widgets/uiLockViewer/viewmodel';

export default class {
    static lock() {
        uiLockViewer.lock();
    }
    static unlock() {
        uiLockViewer.unlock();
    }
};