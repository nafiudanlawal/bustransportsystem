const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const config = require('./config/config');

// MIDDLEWARES 
app.use(express.json());
app.use(cors());

// CONNECT TO DB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB CONNECTED!'))
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`)
})

app.get('/', (req, res) => {
        //res.status(200).send("Simple bus transport API");
        res.status(200).send({code: 200, message: "Simple bus transport API"});
});

app.use("/api", routes);

app.listen(process.env.PORT || 5000);