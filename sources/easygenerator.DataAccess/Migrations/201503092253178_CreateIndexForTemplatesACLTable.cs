namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class CreateIndexForTemplatesACLTable : DbMigration
    {
        public override void Up()
        {
            CreateIndex("dbo.TemplateAccessControlListEntries", "UserIdentity", false, "TemplateAccessControlListEntries_UserIdentity");
        }

        public override void Down()
        {
            DropIndex("dbo.TemplateAccessControlListEntries", "TemplateAccessControlListEntries_UserIdentity");
        }
    }
}
