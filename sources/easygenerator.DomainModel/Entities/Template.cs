using System;
using System.Collections.ObjectModel;
using System.Linq;
using easygenerator.DomainModel.Entities.ACL;
using easygenerator.Infrastructure;
using System.Collections.Generic;

namespace easygenerator.DomainModel.Entities
{
    public class Template : Entity
    {
        public string Name { get; private set; }
        public string PreviewUrl { get; private set; }
        public int Order { get; private set; }
        public int IsNew { get; private set; }
        public int IsDeprecated { get; private set; }

        public virtual bool IsCustom
        {
            get { return !AccessControlList.Any(_ => _.UserIdentity == AccessControlListEntry.WildcardIdentity); }
        }

        protected internal virtual ICollection<Course> Courses { get; set; }

        protected internal Template()
        {
            AccessControlList = new Collection<TemplateAccessControlListEntry>();
        }

        protected internal Template(string name, string createdBy)
            : base(createdBy)
        {
            ThrowIfNameIsInvalid(name);

            Name = name;
            AccessControlList = new Collection<TemplateAccessControlListEntry>();
        }

        protected internal Template(string name, string previewUrl, string createdBy)
            : this(name, createdBy)
        {
            PreviewUrl = previewUrl;
        }

        private void ThrowIfNameIsInvalid(string name)
        {
            ArgumentValidation.ThrowIfNullOrEmpty(name, "name");
        }

        public virtual void GrantAccessTo(params string[] userIdentities)
        {
            foreach (var userIdentity in userIdentities)
            {
                if (IsCustom && !AccessControlList.Any(_ => string.Equals(_.UserIdentity, userIdentity, StringComparison.InvariantCultureIgnoreCase)))
                {
                    AccessControlList.Add(new TemplateAccessControlListEntry(this, userIdentity));
                }    
            }
        }

        protected internal virtual ICollection<TemplateAccessControlListEntry> AccessControlList { get; set; }
    }
}
