using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using easygenerator.Infrastructure;

namespace easygenerator.DomainModel.Entities
{
    public class UserSettings : Entity
    {
        public UserSettings()
        {
        }

        public UserSettings(string createdBy, string lastReadReleaseNote, bool isCreatedThroughLti, bool isCreatedThroughSamlIdP, bool? newEditor, bool isNewEditorByDefault, bool includeMediaToPackage)
        :base(createdBy)
        {
            LastReadReleaseNote = lastReadReleaseNote;
            IsCreatedThroughLti = isCreatedThroughLti;
            IsCreatedThroughSamlIdP = isCreatedThroughSamlIdP;
            NewEditor = newEditor;
            IsNewEditorByDefault = isNewEditorByDefault;
            IncludeMediaToPackage = includeMediaToPackage;
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
    }
}
