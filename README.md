Website And Server Api Learning



http://localhost:5000
http://127.0.0.1:5000


# create directories
mkdir controller
mkdir users


# create files touch command
touch src/controllers/userController.js


# all together touch command
touch .env \
src/app.js \
src/server.js \
src/routes/userRoutes.js \
src/controllers/userController.js \
src/models/User.js \
src/config/database.js


# search running server and kill PID 
lsof -nP -iTCP:5000 -sTCP:LISTEN

# kill server
kill 86508


# User Api end point 
http://localhost:5003/api/users
