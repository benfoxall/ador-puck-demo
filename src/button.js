pinMode(D2, 'input_pulldown');

pinMode(D1, 'output', true);

D1.write(0);

setTimeout(() => {
  D1.write(1);
  console.log("of?");
}, 200);


const MQTT_subs = [
  '/foo/bar',
  '/baz/foo',
  '/fez/#'
];

// helper function for publishing messages
function MQTT_publish(topic, message) {
  console.log("\n<~" + btoa(topic + ' ' + message) + "~>\n");
}

// (implement this) - a handler for incoming messages
function MQTT_handle(topic, message) {
  console.log("got a message!", message);
}



var c = 0
setWatch(function() {
  MQTT_publish('/puck/btn', 'pressed');
  console.log("press - " + c++);
  
  
  D1.write(0);
  setTimeout(() => {
    D1.write(1);
  }, 750);
  
}, D2, { repeat:true, edge:"rising", debounce: 50 });



