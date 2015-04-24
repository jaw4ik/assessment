using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.DataAccess.Repositories
{
    public class ImageFileRepository : Repository<ImageFile>, IImageFileRepository
    {
        public ImageFileRepository(IDataContext dataContext)
            : base(dataContext)
        {
        }
    }
}
