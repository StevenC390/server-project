const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { API_VERSION } = require("./constants");
const app = express();
/*cargar rutas*/
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
/*Trabajar con la extension client-rest */
app.use(bodyParser.json());
/* Pruebas de request con postman */
app.use(bodyParser.urlencoded({extended: true}));

/* Evitar bloqueos en el navegador al trabajar con frontend y backend a la vez*/
app.use(cors());
app.use(`api/${API_VERSION}/`, authRoutes);
app.use(`api/${API_VERSION}/`, userRoutes);
module.exports = app;