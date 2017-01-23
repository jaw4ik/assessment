export default function(url) {
    let element = document.createElement('a');
    element.href = (url.indexOf('://') !== -1) ? url : `http://${url}`;
    return { 
        href: element.href, 
        protocol: element.protocol,
        hostname: element.hostname,
        port: element.port,
        pathname: element.pathname.replace('/', ''),
        search: element.search,
        hash: element.hash
    }  
}