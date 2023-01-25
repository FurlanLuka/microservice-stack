# Overview

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

## Monorepo

The project will be organized in a monorepo powered by NX. The generated project code will be split into three different subfolders - libs, apps, and infrastructure.

* apps folder
  * This folder will contain all apps. Each app is a separately deployable service within the project. It only contains the configuration that is required for the service to run. The actual business logic will not be located inside an application but rather in an app-specific library.
* libs folder
  * There are two types of libraries, shared libraries or utils and app-specific libraries.
  * Util libraries contain code that can be shared with and imported into multiple applications.
  * App-specific libraries contain code that can only be imported into the specific application. Importing libraries into the wrong applications will cause linter errors.
* infrastructure folder
  * This folder contains helm charts, local deployment configurations and tools, and cloud deployment configurations.

The project folder structure should look something like this:

```
repository/
├─ apps/
│  ├─ api/
│  │  ├─ customer_service/
│  │  ├─ user_service/
├─ libs/
│  ├─ api/
│  │  ├─ utils/
│  │  │  ├─ crypto/
│  │  ├─ user_service/
│  │  │  ├─ constants/
│  │  │  ├─ data_transfer_objects/
│  │  │  ├─ user/
│  │  ├─ customer_service/
│  │  │  ├─ constants/
│  │  │  ├─ data_transfer_objects/
│  │  │  ├─ customer/
├─ infrastructure/
│  ├─ local/
│  ├─ cloud/
│  ├─ charts/
```

## Event-driven architecture

EDA is a pattern for building microservices where communication between services is based on events. In EDA, services do not directly call each other but instead emit events when something of interest happens. Other services can then listen to these events and take appropriate action. This allows for greater flexibility and scalability as services can be added or removed without affecting the rest of the system.&#x20;

In this stack, RabbitMQ will be used as a message broker that will be responsible for handling sending, and receiving messages.&#x20;
