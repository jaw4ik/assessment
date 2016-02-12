import Comment from 'models/comment';

class Mapper{
    map(comment) {
        return new Comment({
            id: comment.Id,
            text: comment.Text,
            email: comment.CreatedBy,
            name: comment.CreatedByName,
            createdOn: new Date(comment.CreatedOn),
            context: comment.Context ? JSON.parse(comment.Context) : null
        });
    }
}

export default new Mapper();