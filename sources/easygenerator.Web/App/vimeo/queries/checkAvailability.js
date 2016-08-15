import Query from 'Query';
import getVideoSources from './getVideoSources';

export default new Query(function(obj) {
    return getVideoSources.execute(obj.vimeoId).then(function(sources) {
        return sources && sources.length > 0;
    });
});

