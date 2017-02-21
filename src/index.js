import express from 'express';
import bodyParser from 'body-parser';

const app = express();

// Connect to mongoose db
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/contact-list');

app.use(bodyParser.json());

const ContactModel = require('./models/ContactModel');

// Declare GET /contacts route
app.get('/contacts', function (request, response) {
  ContactModel.find({}).exec()
    .then(contacts => {
      return response.json(contacts);
    })
    .catch(err => {
      return console.log(err);
    });
});

app.get('/contacts/:_id', function (request, response) {
  ContactModel.findById(request.params._id).exec()
    .then(contact => {
      return response.json(contact);
    })
    .catch(err => {
      return console.log(err);
    });
});

app.delete('/contacts/:_id', function (request, response) {
  ContactModel.findByIdAndRemove(request.params._id).exec()
    .then(contact => {
      return response.json(contact);
    })
    .catch(err => {
      return console.log(err);
    });
});

app.post('/contacts', function (request, response) {
  // Create new instance of ContactModel
  // Grap attributes from request.body object (from body-parser)
  const contact = new ContactModel({
    name: request.body.name,
    occupation: request.body.occupation,
    avatar: request.body.avatar,
  });

  // Save new contactcontact.save()
  contact.save()
    // Then return the new contact
    .then(() => {
      return response.json(contact);
    })
    .catch(err => {
      return console.log(err);
    });
});

app.put('/contacts/:_id', function (request, response) {
  ContactModel.findById(request.params._id).exec()
   .then(contact => {
     // Set the attributes on the model from the request.body
     // OR if nothing is received, whatever the current value is
     contact.name = request.body.name || contact.name;
     contact.occupation = request.body.occupation || contact.occupation;
     contact.avatar = request.body.avatar || contact.avatar;

     return contact.save();
   })
   .then(contact => {
     return response.json(contact);
   })
   .catch(err => {
     return console.log(err);
   });
});

// Declare the route
app.all('/*', (request, response) => {
  return response.send(request.params['0']);
});

const PORT = 3001;

app.listen(PORT, (err) => {
  if (err) {
    return console.log('Error!', err);
  }

  return console.log('Listening on: http://localhost:' + PORT);
});
