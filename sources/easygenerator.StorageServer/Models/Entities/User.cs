using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using easygenerator.StorageServer.Infrastructure;

namespace easygenerator.StorageServer.Models.Entities
{
    public class User : Entity
    {
        protected internal User() { }

        public string Email { get; protected set; }
        public long UsedStorageSpace { get; protected set; }

        public User(string email)
        {
            ThrowIfEmailIsNotValid(email);
            Email = email;
            UsedStorageSpace = 0;
        }

        public virtual void ConsumeStorageSpace(long consumedSize)
        {
            ArgumentValidation.ThrowIfLessThenZero(consumedSize, "consumedSize");

            UsedStorageSpace += consumedSize;
        }

        public virtual void ReleaseStorageSpace(long consumedSize)
        {
            ArgumentValidation.ThrowIfLessThenZero(consumedSize, "consumedSize");

            UsedStorageSpace = UsedStorageSpace - consumedSize > 0 ? UsedStorageSpace - consumedSize : 0;
        }

        private void ThrowIfEmailIsNotValid(string email)
        {
            ArgumentValidation.ThrowIfNotValidEmail(email, "email");
        }
    }
}