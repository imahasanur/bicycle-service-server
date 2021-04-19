const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 4000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8pwx7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('I am there')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection('services');
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection('reviews');
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection('admins');
  const bookingCollection = client.db(`${process.env.DB_NAME}`).collection('bookings');

  console.log(uri);
  // to add all services in database for one time
  app.post('/addServices', (req, res) => {
    const newServices = req.body;
    serviceCollection.insertMany(newServices)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to add all reviews in database for one time
  app.post('/addReviews', (req, res)=>{
    const newReviews = req.body;
    reviewCollection.insertMany(newReviews)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to add all admin for one time
  app.post('/addAdmins', (req, res)=>{
    const newAdmins = req.body;
    adminCollection.insertMany(newAdmins)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to add a service in database by an admin
  app.post('/addService', (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to add a review in database by an user
  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to add booking in database by an user
  app.post('/addABooking', (req, res) => {
    const newBooking = req.body;
    bookingCollection.insertOne(newBooking)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to get all reviews of users
  app.get('/getReviews', (req, res) => {
    reviewCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // to get all services 
  app.get('/getServices', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // to get a chosen service from database
  app.get('/getAService/:serviceId', (req, res) => {

    serviceCollection.find({_id:ObjectId(req.params.serviceId)})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })

  // to add an admin to database by another admin
  app.post('/addAnAdmin', (req, res)=>{
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to check an email is a valid admin or not
  app.get('/checkAdmin', (req, res) => {
    adminCollection.find({ email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // to see all orders by an admin
  app.get('/showAllOrders', (req, res)=>{
    bookingCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // to see bookings of an user
  app.get('/showBookings', (req, res)=>{
    bookingCollection.find({email:req.query.email})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  // to delete a service by admin
  app.delete('/deleteService/:id', (req, res)=>{
    serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then((result)=>{
      res.send(result.deletedCount > 0);
    })
  })

  // to update a booking by an admin
  app.patch("/updateOrder/:id",(req, res)=>{
    bookingCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set:{status:req.body.status}
    }
    )
    .then(result =>{
      console.log(result);
      res.send(result.modifiedCount > 0)
    })
  })

  // client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})