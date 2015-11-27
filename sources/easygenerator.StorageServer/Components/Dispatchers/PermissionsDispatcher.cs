using System;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using easygenerator.StorageServer.Components.Authorization;
using easygenerator.StorageServer.Components.ConfigurationSections;
using easygenerator.StorageServer.Models;
using easygenerator.StorageServer.Models.Entities;

namespace easygenerator.StorageServer.Components.Dispatchers
{
    public class PermissionsDispatcher : IPermissionsDispatcher
    {
        private readonly IVimeoUploadDispatcher _vimeoUploadDispatcher;
        private readonly IAuthorizationService _authorizationService;
        private readonly Configuration _configuration;

        public PermissionsDispatcher(IVimeoUploadDispatcher vimeoUploadDispatcher, IAuthorizationService authorizationService, Configuration configuration)
        {
            _vimeoUploadDispatcher = vimeoUploadDispatcher;
            _authorizationService = authorizationService;
            _configuration = configuration;
        }

        public async Task<AccessType> GetUserAccessType(string token, string issuerName)
        {
            var issuer = _configuration.Authorization.Issuers.Cast<IssuerElement>().SingleOrDefault(_ => _.Name == issuerName);
            if (issuer == null)
            {
                throw new ArgumentException("Invalid issuer. There is no such issuer in config file.", "issuerName");
            }
            return await _authorizationService.GetUserAccessTypeAsync(token, issuer.IdentityUrl);
        }

        public bool UserCanUploadFile(User user, AccessType accessType, long size)
        {
            return GetUserAvailableStorageSpace(user, accessType) >= size;
        }

        public long GetUserAvailableStorageSpace(User user, AccessType accessType)
        {
            long uploadingQueueSize = _vimeoUploadDispatcher.GetUserUploadings(user.Id).Sum(u => u.Video.Size);
            long availableStorageSpace = GetStorageSpaceForAccessType(accessType) - user.UsedStorageSpace - uploadingQueueSize;
            return availableStorageSpace > 0 ? availableStorageSpace : 0;
        }

        public long GetStorageSpaceForAccessType(AccessType accessType)
        {
            //TODO: Move values to config if needed
            switch (accessType)
            {
                case AccessType.Free:
                    return 262144000; //250MB
                case AccessType.Starter:
                    return 1073741824; //1GB
                case AccessType.Plus:
                    return 10737418240; //10GB
                case AccessType.Academy:
                    return 10737418240; //10GB
                default:
                    return 0;
            }
        }
    }

    public interface IPermissionsDispatcher
    {
        Task<AccessType> GetUserAccessType(string token, string issuerName);
        long GetStorageSpaceForAccessType(AccessType accessType);
        long GetUserAvailableStorageSpace(User user, AccessType accessType);
        bool UserCanUploadFile(User user, AccessType accessType, long size);
    }
}