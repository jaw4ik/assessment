using easygenerator.DomainModel.Entities;
using easygenerator.Infrastructure;
using System;
using easygenerator.DomainModel.Entities.Users;

namespace easygenerator.Web.Domain.DomainOperations
{
    public interface IUserOperations
    {
        void ApplyOrganizationSettingsSubscription(User user, UserSubscription subscription);
        void DiscardOrganizationSettingsSubscription(User user);
    }

    public class UserOperations : IUserOperations
    {
        public void ApplyOrganizationSettingsSubscription(User user, UserSubscription subscription)
        {
            if (IsUserSubscriptionActual(user, subscription))
                return;

            if (user.Settings.GetPersonalSubscription() == null)
            {
                user.Settings.UpdatePersonalSubscription(user.AccessType,
                    user.ExpirationDate ?? DateTimeWrapper.MinValue());
            }

            UpdateSubscription(user, subscription.AccessType, subscription.ExpirationDate);
        }

        public void DiscardOrganizationSettingsSubscription(User user)
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