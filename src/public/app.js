// import { emit } from "cluster";

$(function(){
    const socket= io();

    // obteniendo los elementos del dom desde la interfaz
    const $messageForm=$('#message-form');
    const $messageBox=$('#message');
    const $chat=$('#chat');

    const $nickForm=$('#nickForm');
    const $nickError=$('#nickError');
    const $nickName=$('#nickName');
    const $user=$('#userNames');

   $nickForm.submit(e => {
       e.preventDefault();
       socket.emit('new user', $nickName.val(), data =>{
           if(data) {
               $('#nickWrap').hide();
               $('#contentWrap').show();

           }else {
               $nickError.html(`
               <div class="alert alert-danger">That username already exits</div>
               `);
           }
           $nickName.val('');
       });
   });


    // eventos
    $messageForm.submit(e =>{
      e.preventDefault();
      socket.emit('send message', $messageBox.val(), data =>{
        $chat.append(`<p class="error">${data}</p>`)
      });
      $messageBox.val('');
    });

    socket.on('new message', data =>{
        $chat.append('<b>' + data.nick + '</b>: '+ data.msg + '</br>');
    })

    socket.on('usernames', data =>{
        let htmlUser='';
        for(let i=0; i<data.length; i++){
            htmlUser +=`<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $user.html(htmlUser);
    });
    socket.on('whisper',data =>{
        $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p> `)
      });
})


