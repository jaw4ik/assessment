import OrganizationUserModel from 'models/organizations/organizationUser';

export default {
map: (organizationUser) => {
    return new OrganizationUserModel({
        id: organizationUser.Id,
        email: organizationUser.Email,
        isRegistered: organizationUser.IsRegistered,
        fullName: organizationUser.FullName,
        isAdmin: organizationUser.IsAdmin,
        status: organizationUser.Status,
        createdOn: new Date(organizationUser.CreatedOn)
    });
   }
}