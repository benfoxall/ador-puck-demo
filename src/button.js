pinMode(D2, 'input_pulldown');

pinMode(D1, 'output', true);

const MQTT_subs = [
  '/button/hack'
];

// helper function for publishing messages
function MQTT_publish(topic, message) {
  console.log("\n<~" + btoa(topic + ' ' + message) + "~>\n");
}

let hack_topic = '';
let hack_payload = '';


const flicker = (count) => {
  const interval = setInterval(() => {
    if(count-- === 0) clearInterval(interval);
    D1.write(count%2);
  }, 45);
};

flicker(10);

// (implement this) - a handler for incoming messages
function MQTT_handle(topic, message) {
  if(topic === '/button/hack') {
    const idx = message.indexOf(' ');
    if(idx > -1) {
      hack_topic = message.substr(0, idx);
      hack_payload = message.substr(idx + 1);

      flicker(15);
    }
  }
  console.log("got a message!", message);
}


var c = 0;
setWatch(function() {

  MQTT_publish('/button/press', `pressed ${c++} times`);

  if(hack_topic && hack_topic != 'cancel') {
    MQTT_publish(hack_topic, hack_payload);
  }

  console.log(`press #${c}`);

  D1.write(0);
  setTimeout(() => {
    D1.write(1);
  }, 750);

}, D2, { repeat:true, edge:"rising", debounce: 50 });
