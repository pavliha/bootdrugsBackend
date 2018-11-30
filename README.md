# OneBenefactor-API 

Backend for OneBenefactor

**Express─Mongoose─MongoDb**

## Application Structure

```
.
├── README.md            # Contains project information
├── api/                 # Contains all api scripts
├──── controllers/          # Contains middlewares сlassified by entity
├──── docs/                 # Contains swagger.json OpenApi Docs
├──── handlers/             # Contains middlewares for handling errors or cors
├──── helpers/              # Contains helper functions 
├──── joi/                  # Contains Joi validations
├──── mailTemplates/        # Contains mail templates
├──── models/               # Contains objection models
├──── repositories/         # Contains ODM queries
├──── routes/               # Contains api routes 
├── config/              # Contains all config files
├── test/                # Contains test scripts
├── index.js             # Contains main sript, which run server on port
├── env_file.env         # Contains example of env params
├── package.json         # Contains project all dependencies
├── package-lock.json    # Contains auto generating dependencies locks 
```

## Global Requirements

- `Mongo 4.0.1`
- `Node ~8`
- `pm2`
 
## Usage

#### Run on local machine

##### 1. Copy and fill all required environment variables in `.env` file
For Linux :
```
$ npm run cp:env
```
Or for Windows: 
```
$ npm run xcp:env
```
##### 2. Install required libraries
```
$ npm install
```

##### 3. Run api
Via pm2 ( prefer )
```   
$ pm2 start index
```
Or npm
```   
$ npm run start
```

Or run nodemon for development
```    
$ npm run serve
```


#### Process Environment Arguments

##### Database arguments
- MONGO_DB_HOST ( `localhost` by default )
- MONGO_DB_PORT ( `27017` by default )
- MONGO_DB_NAME ( `onebenefactordb` by default )

##### Node arguments
- HTTP_SERVER_SCHEME ( `http` by default )
- HTTP_SERVER_HOST ( __required__, pass to emails. `localhost` by default )
- HTTP_SERVER_PORT ( `8080` by default )
- API_ENVIRONMENT ( string value, `development` | `production` )
- SALT_ROUNDS ( hashing salt round, `10` by default )
- SEND_GRID_API_KEY ( __required__ )
