import OrganizationInviteModel from 'models/organizations/organizationInvite';

export default {
map: (invite) => {
    return new OrganizationInviteModel({
        id: invite.Id,
        organizationId: invite.OrganizationId,
        organizationAdminFirstName: invite.OrganizationAdminFirstName,
        organizationAdminLastName: invite.OrganizationAdminLastName,
        organizationTitle: invite.OrganizationTitle
    });
}
}