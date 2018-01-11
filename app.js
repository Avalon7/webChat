// Configure file
// global virables
const express = require('express')
const app = express()
const http = require('http')
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'))
// create route
app.get('/', (req, res)=>{
    res.sendFile(__dirname + 'index.html');
})

// start the server
server.listen(port);
// test server is working
console.log('Server is running on port ' + port + '!');

let users = [];
// socket events
io.on('connection', function(socket){
	socket.on('connUser', function(data,status){
		let userExist = users.filter(function(item) { return item.nickname === data.nickname; });
	  	if(userExist.length){ //user already logged in
	  		status({status:false});
	  	} else{
	  		socket.nickname = data.nickname;
	  		let obj = {
	  			nickname: data.nickname,
	  			socketid: socket.id,
	  			emailhash: data.emailhash
	  		};
	  		users.push(obj);
	  		status({status:true});
	  		emitusers();
	  	}
	});

	socket.on('sendmessage',function(data){
		io.to(data.receiver).emit('receivemessage', {sender:socket.id,nickname:socket.nickname,message:data.message});
	});

	socket.on('disconnect', function(){
	    users = users.filter(function(item) { return item.nickname !== socket.nickname; });
	    emitusers();
	});

	function emitusers(){
		setTimeout(function(){
			io.emit('users',users);
		}, 1000);
	}
});
