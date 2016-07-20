using System;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Auth.Security.Models
{
    public class SamlIdPUserInfoSecure : ISecure<SamlIdPUserInfo>
    {
        private readonly IQuerableRepository<SamlIdentityProvider> _samlIdentityProviderRepository;
        private readonly IQuerableRepository<User> _useRepository;
        private readonly IEntityFactory _entityFactory;

        private SamlIdPUserInfo _object;

        public SamlIdPUserInfoSecure()
        {
            _samlIdentityProviderRepository = DependencyResolver.Current.GetService<IQuerableRepository<SamlIdentityProvider>>();
            _useRepository = DependencyResolver.Current.GetService<IQuerableRepository<User>>();
            _entityFactory = DependencyResolver.Current.GetService<IEntityFactory>();

            _object = null;
        }

        public SamlIdPUserInfoSecure(SamlIdPUserInfo info)
        {
            _samlIdentityProviderRepository = DependencyResolver.Current.GetService<IQuerableRepository<SamlIdentityProvider>>();
            _useRepository = DependencyResolver.Current.GetService<IQuerableRepository<User>>();
            _entityFactory = DependencyResolver.Current.GetService<IEntityFactory>();

            _object = null;

            SamlIdPId = info.SamlIdP_Id;
            UserId = info.User_Id;
        }

        public Guid SamlIdPId;
        public Guid UserId;

        public SamlIdPUserInfo GetObject() =>
            _object ??
                (_object = _entityFactory.SamlIdPUserInfo(_samlIdentityProviderRepository.Get(SamlIdPId), _useRepository.Get(UserId)));
    }
}