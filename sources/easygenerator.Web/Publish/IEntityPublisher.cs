﻿using easygenerator.DomainModel.Entities;

namespace easygenerator.Web.Publish
{
    public interface IEntityPublisher
    {
        bool Publish<T>(T entity) where T : IPublishableEntity;
    }
}