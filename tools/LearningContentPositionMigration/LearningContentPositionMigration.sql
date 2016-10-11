-----------------------REMOVE SPLIT FUNCTION IF EXISTS---------------------------------
IF EXISTS (SELECT *
           FROM   sys.objects
           WHERE  object_id = OBJECT_ID(N'[dbo].[splitstring]')
                  AND type IN ( N'FN', N'IF', N'TF', N'FS', N'FT' ))
  DROP FUNCTION [dbo].[splitstring]
GO 
---------------------------------------------------------------------------------------
----------------------CREATE SPLIT FUNCTION--------------------------------------------
CREATE FUNCTION dbo.splitstring ( @stringToSplit VARCHAR(MAX) )
	RETURNS
		@returnList TABLE ([Name] [nvarchar] (500))
	AS
	BEGIN
		DECLARE @name NVARCHAR(255)
		DECLARE @pos INT

		WHILE CHARINDEX(',', @stringToSplit) > 0
		BEGIN
		SELECT @pos  = CHARINDEX(',', @stringToSplit)  
		SELECT @name = SUBSTRING(@stringToSplit, 1, @pos-1)

		INSERT INTO @returnList
		SELECT RTRIM(LTRIM(@name))

		SELECT @stringToSplit = SUBSTRING(@stringToSplit, @pos+1, LEN(@stringToSplit)-@pos)
		END

		INSERT INTO @returnList
		SELECT RTRIM(LTRIM(@stringToSplit))

		RETURN
	END
GO
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
DECLARE @questionsInProgress TABLE
(
	Id UNIQUEIDENTIFIER,
	LearningContentsOrder NVARCHAR(max)
)

WHILE EXISTS(SELECT Id FROM Questions WHERE LearningContentsOrder IS NOT NULL)
BEGIN
	INSERT INTO @questionsInProgress SELECT Id, LearningContentsOrder FROM Questions WHERE LearningContentsOrder IS NOT NULL

	UPDATE LC SET LC.Position = positions.Position
	FROM LearningContents LC 
	INNER JOIN
	(
		SELECT positions.Name AS LC_Id, CAST(positions.Position AS DECIMAL(18, 15)) AS Position
		FROM @questionsInProgress AS q
		OUTER APPLY 
			(
				SELECT *,  ROW_NUMBER() OVER (ORDER BY (SELECT 100)) as Position FROM splitstring(q.LearningContentsOrder)
			) AS positions
	) AS positions
	ON LC.Id = positions.LC_Id
	
	UPDATE Questions SET LearningContentsOrder = NULL 
	WHERE Id IN (SELECT Id FROM @questionsInProgress)

	DELETE FROM @questionsInProgress
END



