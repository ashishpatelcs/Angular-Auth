const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const apiRoutes = require('./routes/api');
const config = require('./environments/env');
const PORT = config.ENV.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.get('', (req, res) => {
    res.send('hello world');
});


app.listen(PORT, () => { console.log('Server running on localhost:' + PORT); })
