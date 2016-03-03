using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Newsletter.Intercom
{
    public interface IIntercomSubscriptionManager
    {
        bool UpdateSubscription(string email, AccessType accesType);
    }
}