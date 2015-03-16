using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Newsletter
{
    public interface INewsletterSubscriptionManager
    {
        bool UpsertSubscription(string userEmail, string firstname, string lastname, string userRole, AccessType accessType);
    }
}
