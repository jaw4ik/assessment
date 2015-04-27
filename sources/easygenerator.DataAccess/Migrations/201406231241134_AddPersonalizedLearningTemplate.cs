namespace easygenerator.DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddPersonalizedLearningTemplate : DbMigration
    {
        public override void Up()
        {
            Sql("INSERT INTO dbo.Templates (Id, Name, Image, Description, PreviewUrl, CreatedBy, CreatedOn, ModifiedBy, ModifiedOn) " +
                "VALUES(NEWID(), 'Personalized learning', '/Content/images/personalizedLearningTemplate.png', 'A smart course that will give your learner a personalized advice.', '/Templates/Personalized learning/', 'admin@easygenerator.com', GETDATE(), 'admin@easygenerator.com', GETDATE())");
        }
        
        public override void Down()
        {
            Sql("DELETE FROM Templates WHERE Name = 'Personalized learning'");
        }
    }
}
