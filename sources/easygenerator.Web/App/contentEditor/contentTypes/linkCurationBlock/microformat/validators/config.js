//should be same name as validators in folder
export default {
    yandex: {
        api: {
            url : 'https://validator-api.semweb.yandex.ru/v1.1/url_parser',
            settings: {
                apikey : 'a7787324-4e88-4b2c-87a7-904f22cbf38d',
                pretty : 'true',
                id : Math.floor((Math.random() * 1023) + 1).toString(),
                lang : 'en',
                only_errors : 'false'
            }
        }     
    }, 
    facebook : {
        api: {
            access_token : '1101442909905362|YiFjI1TKD2gPv7lc99U29OM44Jo',
            scrape : 'true', 
        }
    },
    google: {
        api: {
            url : 'https://search.google.com/structured-data/testing-tool/u/0/'
        }
    }
}
//https?:\/\/(www\.)?|
//let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
//let expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
            
