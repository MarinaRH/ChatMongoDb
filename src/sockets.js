module.exports = function(io) {

    let users= {};

    // en io estan todos los usuaro o socket conectados
    io.on('connection', socket => {
        console.log('nuevo usuario conectado');
 
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


        socket.on('send message', (data, cb) =>{
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
					  io.sockets.emit('new message',{
						  msg:data,
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
