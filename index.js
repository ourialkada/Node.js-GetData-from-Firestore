
// user web server for chrome
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
var serviceAccount = require("Your Firebase json file");

	const admin = require("firebase-admin");

global.array = [];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "YOUR DB URL",

});

const db = admin.firestore();

app.get('/', (req, res) =>
{
	res.send('HelloWorld');

});


app.get('/getCollection', (req,res) => {

  var dbString = 'JsosShirts/' + req.query.type + '/AllShirts/';
console.log(dbString);

  db.collection(dbString).get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      array.push(doc.data());

    });
    res.json(array);
    array = [];

})
  .catch((err) => {
    console.log('Error getting documents', err);
  });

});

app.get('/getDocument', (req,res) => {

  let document = db.collection("JsosShirts").doc(req.query.type).collection( '/AllShirts/').doc(req.query.id);
  let getDoc = document.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        res.json(doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

});


app.listen((process.env.PORT || port), () => console.log(`Example app listening on port ${port}!`))
