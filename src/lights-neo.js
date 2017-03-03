var n = 64;
var pix = new Uint8ClampedArray(n * 3);

function animate(r,g,b, callback) {
  var start = getTime()
  var duration = .5
  var last = start

  var interval = setInterval(function () {
    var now = getTime()
    var progress = (now -  start) / duration
    // progress = progress * progress
    for (var i = 0; i < n; i++) {
      if((i/n) < progress) {
        pix[i*3    ] = r
        pix[i*3 + 1] = g
        pix[i*3 + 2] = b
      }
    }
    if(progress > 1) {
      clearInterval(interval)
      console.log("cleared")
      if(callback) callback()
    }

    E.neopixelWrite(D1, pix)
  }, 10)

}

function go(){
  animate(150,0,150, () => {
    animate(255,255,0, () => {
      animate(0,0,0)
    })
  })
}

go()



// a list of topics to subscribe to
const MQTT_subs = [
  '/puck/btn'
]

// (implement this) - a handler for incoming messages
function MQTT_handle(topic, message) {
  go();
}





//
//
// // generate data for a set of neopixels
// function neoPixels(data, pixel) {
//   for (var i = 0; i < n; i++) {
//     var p = pixel(i);
//     data[i * 3 + 0] = p[0];
//     data[i * 3 + 1] = p[1];
//     data[i * 3 + 2] = p[2];
//   }
// }
//
// function rainbow(data, start) {
//   neoPixels(data, (i) => {
//     var offset = start + ((i / 16) * Math.PI * 2);
//     var r = (Math.sin(offset + 0) + 1) * 127;
//     var g = (Math.sin(offset + 2) + 1) * 127;
//     var b = (Math.sin(offset + 4) + 1) * 127;
//     return [r,g,b];
//   });
// }
//
// function brightness(data, by) {
//   for(var i = 0; i < data.length; i ++)
//     data[i] *= by;
// }
//
//
// rainbow(pix, Date.now() / 5000); brightness(pix, 0.1);
//
// //E.setClock(80);
// pinMode(D1, 'output');
//
// //neoPixels(pix, (i) => [10,0,0]);
//
// //E.neopixelWrite(D1, pix);
//
// var count = 0;
// //
// // while(count < 10) {
// //   var t0 = getTime();
// //   count++;
// //   rainbow(pix, count / 20);
// //   brightness(pix, 0.05);
// //   var t1 = getTime();
// //   E.neopixelWrite(D1, pix);
// //
// //   var t2 = getTime();
// //
// //   console.log(t1-t0, t2-t1);
// // }
// console.log("OK");
//
// neoPixels(pix, (i) => [10,0,0]);
// E.neopixelWrite(D1, pix);
//
// setInterval(() => {
//   E.neopixelWrite(D1, pix);
// }, 500);
//
// /*
// setInterval(function(){
//   if(count++ % 2) {
//     rainbow(pix, Date.now() / 5000); brightness(pix, 0.5);
//   } else {
//     E.neopixelWrite(D1, pix);
//   }
//
//
//   //count = (count + 1) % 16;
//
// //  neoPixels(pix, (i) => [0,i < count ? 0 : 30,0]);
//
//
//
// }, 10);
// */


/*setTimeout(function(){
  setInterval(function(){
    count = (count + 1) % 16;
    neoPixels(pix, (i) => [0,i < count ? 0 : 30,0]);
  }, 500);
},250);
*/


/*

var c = 0;
setWatch(function() {

  E.setClock(80);
  pinMode(D1, 'output');

  console.log("press - " + c++);
  c = c % 16;

  neoPixels(pix, (i) => [2,c > i ? 2 : 20,5]);

  E.neopixelWrite(D1, pix);


}, BTN, { repeat:true, edge:"rising", debounce: 50 });

*/
