const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('./db/connect')

app.use(express.json())

const newsRoutes = require('./routes/news')
app.use(newsRoutes)

const reporterRoutes = require('./routes/reporter')
app.use(reporterRoutes)

app.get('/', (req,res) => res.send("Welcome to News API"))
app.listen(port, ()=> console.log(`Server Running Now On http://localhost:${port}`))
