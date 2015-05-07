namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddExtraDataColumnToCourseTemplateSettings : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CourseTemplateSettings", "ExtraData", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.CourseTemplateSettings", "ExtraData");
        }
    }
}
