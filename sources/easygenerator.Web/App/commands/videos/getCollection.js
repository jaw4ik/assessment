import repository from 'repositories/videoRepository';
import thumbnailLoader from 'videoUpload/handlers/thumbnails';
import { map } from 'videoUpload/mappers/videoMapper';

async function getCollection() {
    let videos = await repository.getCollection();
    await thumbnailLoader.getThumbnailUrls(videos);
    let videosCollection = _.map(videos, (video) => { return map(video); });
    return new Promise((resolve) => { resolve(videosCollection); });
}

export default getCollection;