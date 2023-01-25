# Overview
### [Read the documentation here](https://docs.microservice-stack.com)

![](https://github.com/FurlanLuka/microservice-stack/actions/workflows/publish.yml/badge.svg) ![](https://github.com/FurlanLuka/microservice-stack/actions/workflows/check.yml/badge.svg)

The "Microservice Stack" was designed to streamline the development process for applications utilizing microservice architecture. It provides a comprehensive set of tools and resources that make it easier to build, test, deploy and manage microservices, allowing developers to focus on creating business logic rather than worrying about infrastructure and operational complexities. This simplification of the development process not only saves time and effort, but also makes it more accessible for developers of all skill levels to work with microservices.

## Motivation

Many developers are hesitant to adopt microservice architecture when initiating a project or startup, as it can present a significant number of complexities. As a result, they often opt for monolithic or serverless structures, despite the likelihood that they will eventually have to migrate to microservices as the project grows and scaling becomes a priority.

This project aims to assist developers in addressing the complexities associated with microservice architecture, including deployment, continuous integration and delivery, service configurations, and patterns. By providing solutions to these challenges, developers can confidently choose microservice architecture from the start and avoid the need for costly and time-consuming rewrites.

## The stack

The microservice stack is composed of&#x20;

* NestJS ([https://nestjs.com/](https://nestjs.com/))&#x20;
* NX Monorepo ([https://nx.dev/](https://nx.dev/))
  * A build system that offers support for monorepo, allowing developers to manage all services within a single repository, streamlining code sharing, development workflow and deployment. With this build system, developers can create reusable libraries with ease, and utilize code generators to automatically generate boilerplate code and configurations, saving time and effort. The monorepo support also enables developers to easily manage dependencies, and maintain a consistent development workflow across all the services, making it easier to scale and maintain complex projects. Additionally, this build system gives more visibility and control over the entire codebase.
* Docker ([https://www.docker.com/](https://www.docker.com/))
* Kubernetes ([https://kubernetes.io/](https://kubernetes.io/))
  * A container orchestration system for automating software deployment, scaling, and management. Used for hosting services, Redis and RabbitMQ.
* Helm ([https://helm.sh/](https://helm.sh/))
  * A tool that streamlines installing and managing Kubernetes applications. It will be used to install all Kubernetes applications as well as to set up automatic service deployment from Github.
* PostgreSQL ([https://www.postgresql.org/](https://www.postgresql.org/))
* RabbitMQ ([https://www.rabbitmq.com/](https://www.rabbitmq.com/))
* Redis ([https://redis.io/](https://redis.io/))
* AWS ([https://aws.amazon.com/](https://aws.amazon.com/))
  * AWS will be used as a default cloud provider. When generating deployment configurations, a Terraform configuration will be generated, describing the AWS infrastructure.