export function injectCssFile(fileUrl) {
    const head = document.head;
    const link = document.createElement('link');

    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = fileUrl;

    head.appendChild(link);
}