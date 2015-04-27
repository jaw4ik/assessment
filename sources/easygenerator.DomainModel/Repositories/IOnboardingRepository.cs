using easygenerator.DomainModel.Entities;

namespace easygenerator.DomainModel.Repositories
{
    public interface IOnboardingRepository: IRepository<Onboarding>
    {
        Onboarding GetByUserEmail(string email);
    }
}
