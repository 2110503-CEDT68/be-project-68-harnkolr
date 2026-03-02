const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

dotenv.config({ path: './config/config.env' });
connectDB();

const carProviders = require('./routes/carProviders');
const cars = require('./routes/cars');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');


const app = express();

const swaggerOption = {

    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers: [
            {
                url: 'http://localhost:5003/api/v1'
            }
        ],
    },

    apis: ['./routes/*.js'],

};

const swaggerDocs = swaggerJsDoc(swaggerOption);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));



app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());


 const limiter = rateLimit({
     windowMs : 10*60*1000,
     max : 100
 });
app.use(limiter);
app.use(hpp());
app.use(cors());


app.set('query parser', 'extended');


app.use('/api/v1/carproviders', carProviders);
app.use('/api/v1/cars', cars);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);

const PORT = process.env.PORT || 5003;



const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);

    server.close(() => process.exit(1));
})