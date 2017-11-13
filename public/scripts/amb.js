$(function () {

  var socket = io();

  var loops={};
  var track = 0;
  var position = 0;


  loops[0] = new Howl({
      src: ['/audio/amb' + 0 + '.mp3'],
      preload: true,
      autoplay: false,
      loop: true,
      volume: 1,
      sprite:{
        main:[0,8000,true]
      },
      onplay: function(){
        console.log('play loop0');
        $('#layer0').append('<div></div>');
      }
  });
  loops[1] = new Howl({
      src: ['/audio/amb' + 1 + '.mp3'],
      preload: true,
      autoplay: false,
      loop: true,
      volume: 1,
      sprite:{
        main:[0,8000,true]
      },
      onplay: function(){
        console.log('play loop1');
        $('#layer1').append('<div></div>');
      }
  });
  loops[2] = new Howl({
      src: ['/audio/amb' + 2 + '.mp3'],
      preload: true,
      autoplay: false,
      loop: true,
      volume: 1,
      sprite:{
        main:[0,8000,true]
      },
      onplay: function(){
        console.log('play loop2');
        $('#layer2').append('<div></div>');
      }
  });
  loops[3] = new Howl({
      src: ['/audio/amb' + 3 + '.mp3'],
      preload: true,
      autoplay: false,
      loop: true,
      volume: 1,
      sprite:{
        main:[0,8000,true]
      },
      onplay: function(){
        console.log('play loop3');
        $('#layer3').append('<div></div>');
      }
  });

  socket.on('connected',function(count,id,timer) {
    console.log('connected user ' + id);
    console.log('user count is ' + count);
    
    $('#count').text(count); //update number of users

  });


  //new user window
  socket.on('newUser', function (count) {
     console.log('first time');
     // getPos();
     setTimeout(function(){
      for(var i = 0; i<count; i++){
         console.log('for loop play loop'+i);
         loops[i].play('main');
         // loops[i].seek(position);
         $('body').append('<div id="layer'+i+'" class="track"></div>')
       }

     },1000);
    
  });

  //get play position of initial loop
  function getPos(){
    position = loops[0].seek('main');
    console.log(position);
  }

  //update other users when user has joined
  socket.on('join',function(track) {
    console.log('timeout play loop'+track);
    getPos();
    
    loops[track].play('main');
    loops[track].seek(position);

    $('body').append('<div id="layer' + track +'" class="track"></div>')
  });

  //when user disconnects
  socket.on('disconnected',function(track){
     console.log('disconnected user' + track);
     loops[track].stop();
     $('#layer' + track).remove();
     console.log('stop loop' + track);
     $('#count').text(track); //update number of users
  });

  socket.on('timer', function (data) {  
      $('#timer').text(data.timer);
  }); 




});
