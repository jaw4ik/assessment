using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;
using easygenerator.Infrastructure;
using easygenerator.Web.Extensions;
using System;
using easygenerator.Web.BuildDocument.PackageModel;

namespace easygenerator.Web.BuildDocument
{
    public class PackageModelMapper
    {
        private readonly IUserRepository _userRepository;

        public PackageModelMapper(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public virtual DocumentPackageModel MapDocument(Document document)
        {
            if (document == null)
                throw new ArgumentNullException();

            var author = _userRepository.GetUserByEmail(document.CreatedBy);

            return new DocumentPackageModel()
            {
                Id = document.Id.ToNString(),
                Title = document.Title,
                EmbedCode = document.EmbedCode,
                DocumentType = document.DocumentType,
                CreatedBy = author?.FullName,
                CreatedOn = DateTimeWrapper.Now()
            };
        }
    }
}