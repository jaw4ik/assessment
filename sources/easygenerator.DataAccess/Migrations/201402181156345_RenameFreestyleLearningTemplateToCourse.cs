namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenameFreestyleLearningTemplateToCourse : DbMigration
    {
        public override void Up()
        {
            Sql(@"UPDATE dbo.Templates
                SET Name = 'Simple course', Image = '/Content/images/simpleCourseTemplate.png', PreviewUrl = '/Templates/Simple course/'
                WHERE Name = 'Freestyle learning'");
        }
        
        public override void Down()
        {
        }
    }
}
