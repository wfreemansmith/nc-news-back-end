# Northcoders News API
## Background

This API is a portfolio project simulating the behaviour of a real world backend service. The project is set up like a messaging board, and data can be accessed and interacted with by developers programmatically.

A hosted version of this repo can be found here: https://backend-project-nc-news.onrender.com

## Local set-up

Before installing locally, ensure that you have as a minimum PostgreSQL v15.1 and Node v19.2.0 set up on your system. You will be interacting with PSQL using [node-postgres](https://node-postgres.com/).

To clone this repo to your local computer, navigate to the desired destination on your system and type ```git clone https://github.com/wfreemansmith/nc-news.git``` into the command line.

Once installed, input ```npm install``` to install the following dependencies:

* PG-Format
* Dotenv
* Express
* PG

The following are dev-only dependencies:

* Husky
* Jest
* Jest-Sorted
* Supertest

## Seeding the local database

In the main folder, create two files: ```.env.test``` and ```.env.development```. These provide different environmental variables for the seed.js file, allowing it to use different databases and datasets depending on whether you're setting up the database or simply running tests.

Inside each file, set the relevant PGDATABASE env variable with 'nc_news' for development and 'nc_news_test' for test - for example: ```PGDATABASE=nc_news```.

In the terminal, run the script ```npm run setup-dbs```. This creates the two databases. If a database with the same name exists this will be dropped and re-created.

From here you can seed the database. Run the script ```npm run seed```.

## Testing

To run tests, use the script ```npm test <filepath>```. Test suites can be found in the folder '\_\_tests\_\_'.

## Using the API

The database can be interacted with through the endpoints outlined below. A full breakdown of these endpoints and their options can also be obtained by making a GET request to ```/api```.

```GET /api/topics```
- Serves an array of all topics

```GET /api/articles```
- Serves an array of all articles
- Query can be customised with topic, sort_by and order

```GET /api/articles/:article_id```
- Serves up the requested article by article ID

```GET /api/articles/:article_id/comments```
- Serves an array of article comments by article ID
- Results are sorted by most recent first

```GET /api/users```
- Serves an array of all users

```GET /api/users/:userid```
- Serves up the requested user by user ID

```POST /api/articles/:article_id/comments```
- Posts a new comment to a specified article and returns comment

```PATCH /api/articles/:article_id```
- Increments or decrements the number of votes on specified article

```DELETE /api/comments/comment_id```
- Seletes comment by comment id

```PATCH /api/comments/comment_id```
- Increments or decrements the number of votes on specified comment