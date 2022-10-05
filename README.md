Project Atlier : Backend System
This project is an API infrastructure service for the Products module of a retail e-commerce application.

Technologies Used
Node | Express | PostgreSQL | AWS EC2 | NGINX

Description
Designed database schema for products information, products styles, products photos and products skus.
Utilized an ETL process to combine data sources into a consistent data into a PostgreSQL database.
Re-built an existing API service using Node and Express to optimize the performance, and locally stress-tested the service with K6.
Deployed server and database on AWS EC2 instances and stress-tested the service using Loader.io.
Horizontally scaled 3 AWS EC2 microservice to handle over 1500 requests per second and set up an NGINX load balancer instance to distribute requests efficiently.
Testing
Local: Jest, K6
Deployed: Loader.io, New Relic
