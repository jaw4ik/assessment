using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Entities.Organizations;
using easygenerator.Infrastructure;
using System;

namespace easygenerator.Web.Domain.DomainOperations
{
    public interface IUserOperations
    {
        void ApplyOrganizationSettings(User user, OrganizationSettings settings);
        void DiscardOrganizationSettings(User user);
    }

    public class UserOperations : IUserOperations
    {
        public void ApplyOrganizationSettings(User user, OrganizationSettings settings)
        {
            var subscription = settings.GetSubscription();
            if (subscription == null)
                return;

            if (IsUserSubscriptionActual(user, subscription))
                return;


            if (user.Settings.GetPersonalSubscription() == null)
            {
                user.Settings.UpdatePersonalSubscription(user.AccessType,
                    user.ExpirationDate ?? DateTimeWrapper.MinValue());
            }

            UpdateSubscription(user, subscription.AccessType, subscription.ExpirationDate);
        }

        public void DiscardOrganizationSettings(User user)
        {
            var subscription = user.Settings.GetPersonalSubscription();
            if (subscription == null)
                return;

            UpdateSubscription(user, subscription.AccessType, subscription.ExpirationDate);
            user.Settings.ResetPersonalSubscription();
        }

        private void UpdateSubscription(User user, AccessType accessType, DateTime expirationDate)
        {
            switch (accessType)
            {
                case AccessType.Free:
                    user.DowngradePlanToFree();
                    break;
                case AccessType.Academy:
                    user.UpgradePlanToAcademy(expirationDate);
                    break;
                case AccessType.AcademyBT:
                    user.UpgradePlanToAcademyBT(expirationDate);
                    break;
                case AccessType.Plus:
                    user.UpgradePlanToPlus(expirationDate);
                    break;
                case AccessType.Starter:
                    user.UpgradePlanToStarter(expirationDate);
                    break;
                case AccessType.Trial:
                    user.UpgradePlanToTrial(expirationDate);
                    break;
                default:
                    throw new InvalidOperationException("Failed to update user subscription. Specified access type is not processed.");
            }
        }

        private bool IsUserSubscriptionActual(User user, UserSubscription subscription)
        {
            return subscription.AccessType == user.AccessType && user.ExpirationDate.HasValue &&
                   user.ExpirationDate.Value == subscription.ExpirationDate;
        }
    }
}