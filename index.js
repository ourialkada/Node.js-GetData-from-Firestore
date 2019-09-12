
// user web server for chrome
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
var serviceAccount = require("./assets/firebase.json");

	const admin = require("firebase-admin");

global.array = [];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jsos-apparel.firebaseio.com/",

});

const db = admin.firestore();

app.get('/', (req, res) =>
{
	res.send('HelloWorld');

});


app.get('/getCollection', (req,res) => {
	if (req.query.token != null)
	{
	admin.auth().verifyIdToken(req.query.token)
		.then(function(decodedToken) {
			let uid = decodedToken.uid;
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
}).catch(function(error) {
 res.json("Token Unverified");
});
}
else {
	{
		res.json("Missing Token");
	}
}
});

app.get('/getDocument', (req,res) => {
	if (req.query.token != null)
	{
	admin.auth().verifyIdToken(req.query.token)
	  .then(function(decodedToken) {
	    let uid = decodedToken.uid;
	    // ...
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

			res.json("No Document Found");
    });

	}).catch(function(error) {
	 res.json("Token Unverified");
});
}
else {
	res.json("Missing Token");
}
});


app.listen((process.env.PORT || port), () => console.log(`Example app listening on port ${port}!`))
