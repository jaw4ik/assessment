import Query from 'Query';
import getVideo from './getVideo';

export default new Query(function(obj) {
    return getVideo.execute(obj.vimeoId).then(function(video) {
        return video.status === 'available';
    });
});

