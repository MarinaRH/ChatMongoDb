const chat = require('./models/chat');


module.exports = function(io) {

		let users= {};

		// en io estan todos los usuaro o socket conectados
		io.on('connection',  async socket => {
				console.log('nuevo usuario conectado');

				let messages =await chat.find({}).limit(8);
				socket.emit('load old messages',messages);

 
				socket.on('new user', (data, cb) => {
					if(data in users) {
								cb(false);
					}else {
								cb(true);
								socket.nickName=data;
								users[socket.nickName]=socket;
								// users.push(socket.nickName);
								updateNicknames();
						}
				});


				socket.on('send message', async (data, cb) =>{
					var msg = data.trim();
					// 3primerso caracteres
					if(msg.substr(0,3) === '/w '){
						msg=msg.substr(3);
						const index= msg.indexOf(' ');
						if(index !== -1){
							var name= msg.substr(0,index);
							var mensaje=msg.substr(index+1);
							if (name in users){
								users[name].emit('whisper',{
									msg:mensaje,
									nick:socket.nickName
								})
							}else {
								cb('error!! please enter a valid user');
							}

						}else {
							cb('error! please enter your message')
						}
					}else {

						var newMsg =new chat({
							msg,
							nick:socket.nickName
						});

						await newMsg.save();

						io.sockets.emit('new message',{
							msg,
							nick:socket.nickName
						});
					}		
				});
				
				socket.on('disconnect', data =>{
					if(!socket.nickName)return;
					delete users[socket.nickName];
						// nickNames.splice(nickNames.indexOf(socket.nickName),1);
						updateNicknames();
				});

				function updateNicknames(){
					io.sockets.emit('usernames', Object.keys(users));
				}
		});
}
