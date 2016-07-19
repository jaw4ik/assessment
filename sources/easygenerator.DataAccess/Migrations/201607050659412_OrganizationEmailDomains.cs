namespace easygenerator.DataAccess.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class OrganizationEmailDomains : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.PasswordRecoveryTickets", newName: "Tickets");
            AddColumn("dbo.Users", "IsEmailConfirmed", c => c.Boolean(nullable: false));
            AddColumn("dbo.Tickets", "Discriminator", c => c.String(nullable: false, maxLength: 128));

            Sql("update dbo.Tickets set Discriminator = 'PasswordRecoveryTicket'");

            AddColumn("dbo.Organizations", "EmailDomains", c => c.String(maxLength: 256));
        }

        public override void Down()
        {
            DropColumn("dbo.Organizations", "EmailDomains");
            DropColumn("dbo.Tickets", "Discriminator");
            DropColumn("dbo.Users", "IsEmailConfirmed");
            RenameTable(name: "dbo.Tickets", newName: "PasswordRecoveryTickets");
        }
    }
}
