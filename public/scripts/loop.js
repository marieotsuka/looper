$(function () {

  var socket = io();

  var track = 0;
  var index = 0;
  var key = 0;
  var sounds = ['0','1','2'];
  var tracker= 0;
  var howls = {};
  var looper=[];
  var delay = 0;

  // var sound = new Howl({
  //  src: ['/audio/sprite.mp3'],
  //  sprite: {
  //    loop0: [0, 2000, 1],
  //    loop1: [3000, 2000, 1],
  //    loop2: [6000, 4000, 1]
  //  },
  //  onplay: function(){
  //      $('.track').append('<div></div>');
  //      looper[key] = looper[key]+1;
  //      console.log("track" + sound + " count is " + looper[key]);
  //     }
  // });

  sounds.forEach(function(sound){
    howls[sound] = new Howl({
      src: ['/audio/loop' + sound + '.mp3'],
      preload: true,
      loop: true,
      volume: .5,
      onplay: function(){
       $('#layer'+sound).append('<div></div>');
       loopCount[sound] = loopCount[sound]+1;
       console.log("track" + sound + " count is " + loopCount[sound]);
      }
    });
  });
  
  socket.on('connected', function(count,timer, loopCount){
    $('#count').text(count);
    loopCount.push(0);
    socket.emit(loopCount);
    console.log(loopCount);
    looper = loopCount;

    key = count-1;
    $('body').append('<div id="layer'+key+'" class="track"></div>');
    calcDelay(timer);

    if (tracker === 0){//if new browser window 
      for(var i = 0; i<loopCount.length; i++){
        console.log(i);
        $('body').append('<div id="layer'+i+'" class="track"></div>');
        // sound.play('loop'+i);
        howls[i].play();
        // sound.seek(timer%2,'loop'+i);
        howls[i].seek(timer%2);
          for(var j=0; j<loopCount[i]; j++){
            $('#layer'+i).append('<div></div>');
          }
      }
     tracker=1;
    }else{//if existing browser window
      //load new voice with delay
      setTimeout(function() { newVoice(key); }, delay*1000);      
    }
  });

  socket.on('timer', function (data) {  
      $('#timer').text(data.timer);
      time = data.timer;
  });

  socket.on('disconnected', function(count){
      console.log('disconnected');
      // sound.stop('loop'+key);
      howls[key].stop();
      $('#count').text(count); 
  });

  function calcDelay(timer){
    delay = Math.ceil(timer/2) * 2 - timer;
    console.log(delay);
  }

  function newVoice(key){
    howls[key].play();
    $('body').append('<div id="layer'+key+'" class="track"></div>');
    // sound.play('loop'+key);
  }



});
