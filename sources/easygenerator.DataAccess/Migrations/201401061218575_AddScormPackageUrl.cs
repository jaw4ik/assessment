namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddScormPackageUrl : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Courses", "ScormPackageUrl", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Courses", "ScormPackageUrl");
        }
    }
}
