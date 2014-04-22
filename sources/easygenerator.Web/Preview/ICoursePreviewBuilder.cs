using System.Threading.Tasks;
using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Preview
{
    public interface ICoursePreviewBuilder
    {
        Task<bool> Build(Course course);
    }
}
