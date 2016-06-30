import OrganizationModel from 'models/organizations/organization';

export default {
map: (organization) => {
    return new OrganizationModel({
        id: organization.Id,
        title: organization.Title,
        grantsAdminAccess: organization.GrantsAdminAccess
    });
   }
}