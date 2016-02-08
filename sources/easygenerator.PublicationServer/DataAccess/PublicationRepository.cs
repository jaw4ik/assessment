using System;
using System.Collections.Generic;
using System.Linq;
using Dapper;
using easygenerator.PublicationServer.Configuration;
using easygenerator.PublicationServer.Models;

namespace easygenerator.PublicationServer.DataAccess
{
    public class PublicationRepository : BaseRepository, IPublicationRepository
    {
        public PublicationRepository(ConfigurationReader configurationReader) : base(configurationReader) { }

        public Publication Get(Guid publicationId)
        {
            return ExecuteDbAction(connection => connection.Query<Publication>(@"SELECT * FROM Publications WHERE Id = @Id", new { Id = publicationId }).SingleOrDefault());
        }

        public void Add(Publication publication)
        {
            ExecuteDbAction(
                connection => connection.Execute(
                    @"INSERT INTO Publications (Id, OwnerEmail, CreatedOn, ModifiedOn, PublicPath) VALUES (@Id, @OwnerEmail, @CreatedOn, @ModifiedOn, @PublicPath)",
                    new { publication.Id, publication.OwnerEmail, publication.CreatedOn, publication.ModifiedOn, publication.PublicPath })
            );
        }

        public void Update(Publication publication)
        {
            ExecuteDbAction(connection => connection.Execute(@"UPDATE Publications SET ModifiedOn = @ModifiedOn WHERE Id = @Id", new { publication.Id, publication.ModifiedOn }));
        }

        public int GetPublicationsCountForUsersWithAccessType(AccessType accessType, int accessTypeMinDaysPeriod)
        {
            return ExecuteDbAction(connection => connection.Query<int>(
                @"SELECT COUNT(p.Id) FROM Publications p INNER JOIN
                Users u ON p.OwnerEmail = u.Email
                WHERE u.AccessType = @AccessType
                AND DATEDIFF(DAY, u.ModifiedOn, GETDATE()) > @AccessTypeMinDaysPeriod",
                new { AccessType = accessType, AccessTypeMinDaysPeriod = accessTypeMinDaysPeriod })
            .SingleOrDefault());
        }

        public ICollection<Publication> GetPublicationsForUsersWithAccessType(AccessType accessType, int accessTypeMinDaysPeriod, int take, int skip)
        {
            return ExecuteDbAction(connection => connection.Query<Publication>(
                @"SELECT * FROM(
                    SELECT p.*, ROW_NUMBER() OVER(ORDER BY p.CreatedOn) AS RowNumber FROM Publications p INNER JOIN
                    Users u ON p.OwnerEmail = u.Email
                    WHERE u.AccessType = @AccessType
                    AND DATEDIFF(DAY, u.ModifiedOn, GETDATE()) > @AccessTypeMinDaysPeriod
                ) OrderedPublications
                WHERE OrderedPublications.RowNumber BETWEEN @Skip + 1 AND @Take",
            new { AccessType = accessType, AccessTypeMinDaysPeriod = accessTypeMinDaysPeriod, Take = take + skip, Skip = skip }).ToList());
        }

        public Publication GetByPublicPath(string publicPath)
        {
            return ExecuteDbAction(connection => connection.Query<Publication>(@"SELECT * FROM Publications WHERE PublicPath = @PublicPath", new { PublicPath = publicPath }).SingleOrDefault());
        }
    }
}
