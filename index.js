// implement your API here
const Express = require('express')
const app = Express();
const cors = require('cors')

const usersRoute = require('./routes/api/users')

app.use(Express.json())

app.use('/api/users',usersRoute)

app.use('/',(req,res)=>res.send('Welcome to my api'))

const Port = process.env.PORT || 5000

app.listen(Port,()=> console.log(`Server is running on Port: ${Port}`))