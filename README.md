#$ npm install
#$ npm start
#Start app at http://localhost:3000/

Routes:
#POST /register : Register a user 
{
	"name": "oe",
	"email": "oe@ex.io",
	"username": "oe",
	"password": "my123456",
	"password2": "my123456"
}
#POST /login 
{
	"username": "oe",
	"password": "my123456"
}
#GET /logout 
#GET /user 
#GET /auth/facebook

news
#GET /news
#GET /news/{5c575767c1f92c1f54e783c2}-example id
#POST /news
{
    "news": {
    "news": "hello news1",
        "title": "news title"
}
}
#PUT /news/id
{
    "news": {
    "news": "hello news1",
        "title": "news title"
}
}
#DELETE /news/id