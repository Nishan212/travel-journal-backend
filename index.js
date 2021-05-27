const express = require('express');

const app = express();

require('dotenv').config();
require('./start/db')();
require('./start/routes')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`server listening on port ${port}`);
});
