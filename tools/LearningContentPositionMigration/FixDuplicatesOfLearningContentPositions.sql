update dbo.LearningContents
set Position = Position.NewPosition - 1
FROM (SELECT lc.Id,
lc.Question_Id,
lc.Position AS OldPosition,
ROW_NUMBER() OVER(PARTITION BY lc.Question_Id ORDER BY lc.Position ASC) AS NewPosition
FROM LearningContents lc) Position
WHERE dbo.LearningContents.Id = Position.Id