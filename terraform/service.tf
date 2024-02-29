resource "aws_ecr_repository" "aha_ecr_service" {
  name = "aha-service"
}

resource "aws_ecs_cluster" "aha_cluster" {
  name = "aha-cluster"
}

resource "aws_ecs_task_definition" "aha_task" {
  family                   = "aha-service-task" # Name your task
  container_definitions    = <<DEFINITION
  [
    {
      "name": "aha-service-task",
      "image": "${aws_ecr_repository.aha_ecr_service.repository_url}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3001,
          "hostPort": 3001
        }
      ],
      "memory": 512,
      "cpu": 256
    }
  ]
  DEFINITION
  requires_compatibilities = ["FARGATE"] # use Fargate as the launch type
  network_mode             = "awsvpc"    # add the AWS VPN network mode as this is required for Fargate
  memory                   = 512         # Specify the memory the container requires
  cpu                      = 256         # Specify the CPU the container requires
  execution_role_arn       = aws_iam_role.ecsTaskExecutionRole.arn

  # if you use X86_64, you will be trapped in "Exit code: 1" hell
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
}

resource "aws_iam_role" "ecsTaskExecutionRole" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecsTaskExecutionRole_policy" {
  role       = aws_iam_role.ecsTaskExecutionRole.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "aha_service" {
  name            = "aha-service"                        # Name the service
  cluster         = aws_ecs_cluster.aha_cluster.id       # Reference the created Cluster
  task_definition = aws_ecs_task_definition.aha_task.arn # Reference the task that the service will spin up
  launch_type     = "FARGATE"
  desired_count   = 3 # Set up the number of containers to 3

  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn # Reference the target group
    container_name   = aws_ecs_task_definition.aha_task.family
    container_port   = 3001 # Specify the container port
  }

  network_configuration {
    subnets          = ["${aws_default_subnet.default_subnet_a.id}", "${aws_default_subnet.default_subnet_c.id}"]
    assign_public_ip = true                                                # Provide the containers with public IPs
    security_groups  = ["${aws_security_group.service_security_group.id}"] # Set up the security group
  }
}

#Log the load balancer app URL
output "aha_service_url" {
  value = aws_alb.aha_load_balancer.dns_name
}
