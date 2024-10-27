const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let data = []

app.get('/', (req, res) => {
  res.json({
    data: JSON.stringify(data),
  })
})

app.post('/', (req, res) => {
  data.push(req.body)
  res.json({
    message: 'Added packet',
  })
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
