using easygenerator.Infrastructure;
using System;

namespace easygenerator.DomainModel.Entities
{
    public class UserSettings : Entity
    {
        public UserSettings()
        {
        }

        public UserSettings(string createdBy, string lastReadReleaseNote, string lastPassedSurveyPopup, bool isCreatedThroughLti, bool isCreatedThroughSamlIdP, bool? newEditor, bool isNewEditorByDefault, bool includeMediaToPackage, bool? isSurvicateAnswered)
        : base(createdBy)
        {
            LastReadReleaseNote = lastReadReleaseNote;
            LastPassedSurveyPopup = lastPassedSurveyPopup;
            IsCreatedThroughLti = isCreatedThroughLti;
            IsCreatedThroughSamlIdP = isCreatedThroughSamlIdP;
            NewEditor = newEditor;
            IsNewEditorByDefault = isNewEditorByDefault;
            IncludeMediaToPackage = includeMediaToPackage;
            IsSurvicateAnswered = isSurvicateAnswered;
        }

        public virtual User User { get; set; }

        public string LastReadReleaseNote { get; private set; }
        public virtual void UpdateLastReadReleaseNote(string lastReadReleaseNote, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(lastReadReleaseNote, nameof(lastReadReleaseNote));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LastReadReleaseNote = lastReadReleaseNote;
            MarkAsModified(modifiedBy);
        }

        public string LastPassedSurveyPopup { get; private set; }
        public void UpdateSurveyPopupVersion(string surveyPopupVersion, string modifiedBy)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(surveyPopupVersion, nameof(surveyPopupVersion));
            ThrowIfModifiedByIsInvalid(modifiedBy);

            LastPassedSurveyPopup = surveyPopupVersion;
            MarkAsModified(modifiedBy);
        }

        public bool? NewEditor { get; private set; }
        public virtual void SwitchEditor(string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);
            if (NewEditor.HasValue && (bool)NewEditor)
            {
                NewEditor = false;
            }
            else
            {
                NewEditor = true;
            }
            MarkAsModified(modifiedBy);
        }

        public bool? IsSurvicateAnswered { get; private set; }

        public virtual void SwitchSurvicateAnsweredStatus(string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            IsSurvicateAnswered = !(IsSurvicateAnswered ?? false);

            MarkAsModified(modifiedBy);
        }

        public bool IsCreatedThroughLti { get; private set; }
        public bool IsCreatedThroughSamlIdP { get; private set; }
        public bool IsNewEditorByDefault { get; private set; }

        public bool IncludeMediaToPackage { get; private set; }
        public void SwitchIncludeMediaToPackage(string modifiedBy)
        {
            ThrowIfModifiedByIsInvalid(modifiedBy);

            IncludeMediaToPackage = !IncludeMediaToPackage;
            MarkAsModified(modifiedBy);
        }

        #region Personal subscription

        public AccessType? PersonalAccessType { get; protected internal set; }
        public DateTime? PersonalExpirationDate { get; protected internal set; }

        public virtual UserSubscription GetPersonalSubscription()
        {
            return PersonalAccessType.HasValue && PersonalExpirationDate.HasValue
            ? new UserSubscription(PersonalAccessType.Value, PersonalExpirationDate.Value)
            : null;
        }

        public virtual void UpdatePersonalSubscription(AccessType accessType, DateTime expirationDate)
        {
            ArgumentValidation.ThrowIfDateIsInvalid(expirationDate, nameof(expirationDate));

            PersonalAccessType = accessType;
            PersonalExpirationDate = expirationDate;
        }

        public virtual void ResetPersonalSubscription()
        {
            PersonalAccessType = null;
            PersonalExpirationDate = null;
        }

        #endregion
    }
}
