namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FillTemplatesACLForDefaultTemplates : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO TemplateAccessControlListEntries SELECT NEWID(), '*', Id FROM Templates WHERE IsCustom = 0");
        }

        public override void Down()
        {
            Sql("DELETE FROM TemplateAccessControlListEntries WHERE UserIdentity = '*'");
        }
    }
}
