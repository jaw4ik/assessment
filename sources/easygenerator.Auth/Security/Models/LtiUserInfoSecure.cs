using System;
using System.Web.Mvc;
using easygenerator.DomainModel;
using easygenerator.DomainModel.Entities;
using easygenerator.DomainModel.Repositories;

namespace easygenerator.Auth.Security.Models
{
    public class LtiUserInfoSecure : ISecure<LtiUserInfo>
    {
        private readonly IQuerableRepository<ConsumerTool> _consumerToolRepository;
        private readonly IQuerableRepository<User> _useRepository;
        private readonly IEntityFactory _entityFactory;

        private LtiUserInfo _object;

        public LtiUserInfoSecure()
        {
            _consumerToolRepository = DependencyResolver.Current.GetService<IQuerableRepository<ConsumerTool>>();
            _useRepository = DependencyResolver.Current.GetService<IQuerableRepository<User>>();
            _entityFactory = DependencyResolver.Current.GetService<IEntityFactory>();

            _object = null;
        }

        public LtiUserInfoSecure(LtiUserInfo info)
        {
            _consumerToolRepository = DependencyResolver.Current.GetService<IQuerableRepository<ConsumerTool>>();
            _useRepository = DependencyResolver.Current.GetService<IQuerableRepository<User>>();
            _entityFactory = DependencyResolver.Current.GetService<IEntityFactory>();

            _object = null;

            LtiUserId = info.LtiUserId;
            UserId = info.User_Id;
            ConsumerToolId = info.ConsumerTool_Id;
        }

        public string LtiUserId;
        public Guid UserId;
        public Guid ConsumerToolId;

        public LtiUserInfo GetObject() =>
            _object ??
                (_object = _entityFactory.LtiUserInfo(LtiUserId, _consumerToolRepository.Get(ConsumerToolId), _useRepository.Get(UserId)));
    }
}