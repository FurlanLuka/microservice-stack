resource "aws_ecr_repository" "container_repository" {
  name = "${var.environment_name}_container_repository"

  image_tag_mutability = "IMMUTABLE"
}

resource "aws_ecr_lifecycle_policy" "container_repository_lifecycle_policy" {
  repository = aws_ecr_repository.container_repository.name

  policy = jsonencode({
    rules : [
      {
        rulePriority : 1,
        description : "Lifecycle policy",
        selection : {
          tagStatus : "any",
          countType : "sinceImagePushed",
          countUnit : "days",
          countNumber : 14
        },
        action : {
          type : "expire"
        }
      }
    ]
  })
}
