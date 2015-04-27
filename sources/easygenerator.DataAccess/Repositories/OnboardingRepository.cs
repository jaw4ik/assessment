using System.Linq;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;

namespace easygenerator.DataAccess.Repositories
{
    public class OnboardingRepository : Repository<Onboarding>, IOnboardingRepository
    {
        public OnboardingRepository(IDataContext dataContext) : base(dataContext)
        {
        }

        public Onboarding GetByUserEmail(string email)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(email, "email");
            return _dataContext.GetSet<Onboarding>().SingleOrDefault(onboarding => onboarding.UserEmail == email);
        }
    }
}