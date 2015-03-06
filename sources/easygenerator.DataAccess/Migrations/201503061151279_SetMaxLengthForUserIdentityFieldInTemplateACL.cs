namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class SetMaxLengthForUserIdentityFieldInTemplateACL : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.TemplateAccessControlListEntries", "UserIdentity", c => c.String(nullable: false, maxLength: 254));
            CreateIndex("dbo.TemplateAccessControlListEntries", "UserIdentity", false, "TemplateAccessControlListEntries_UserIdentity");
        }

        public override void Down()
        {
            AlterColumn("dbo.TemplateAccessControlListEntries", "UserIdentity", c => c.String(nullable: false));
            DropIndex("dbo.TemplateAccessControlListEntries", "TemplateAccessControlListEntries_UserIdentity");
        }
    }
}
