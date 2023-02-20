# Northcoders News API

## Set-up

In order for a developer to run the server once pulled to their local device, in the main folder please create the files ```.env.test``` and ```.env.development```.

These files provide different environment variables (database addresses) for the seed.js file, depending on whether it is run to set-up the database using real data or to test the database using example data. Inside each file, set the relevant PGDATABASE env variable with your chosen database names - for example: ```PGDATABASE=nc_news```