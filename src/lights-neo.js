function NeoPixels(pin, length) {
  this.pin = pin;
  this.n = length;
  this.data = new Uint8ClampedArray(length * 3);
  this.sweeps = [];
  this.interval = null;
}

NeoPixels.prototype.write = function() {
  E.neopixelWrite(this.pin, this.data);
};

NeoPixels.prototype.set = function(i, c) {
  if(i < this.n && i > 0) {
    var r = (c >> 16) & 0xff;
    var g = (c >> 8) & 0xff;
    var b = c & 0xff;

    this.data[i * 3]     = r;
    this.data[i * 3 + 1] = g;
    this.data[i * 3 + 2] = b;

    this.write();
  }
};

NeoPixels.prototype.sweep = function(c, delay) {
  delay = (delay || 0) / 1000;

  var r = (c >> 16) & 0xff;
  var g = (c >> 8) & 0xff;
  var b = c & 0xff;

  this.sweeps.unshift([getTime() + delay, r, g, b]);

  this.sweeps.sort((a,b) => a[0] < b[0] ? 1 : -1);

  // kick off animation
  if(!this.interval){
    this.interval = setInterval(
      this.animate.bind(this), 40
    );
  }
};

NeoPixels.prototype.animate = function(){
  if(!this.sweeps.length) {
    clearInterval(this.interval);
    return (this.interval = null);
  }

  const now = getTime();
  const duration = 3;

  // sweep index
  var si = 0;

  // set the progress of each sweep
  // (and update si if this has already passed) ugly
  for (var i = 0; i < this.sweeps.length; i++)
    if((this.sweeps[i][4] = (now - this.sweeps[i][0]) / duration) < 0)
      si = i+1;

  // nothing to animate yet
  if(si > this.sweeps.length -1) return;

  var progress;
  for (i = 0; i < this.n; i++) {
    progress = i/this.n;

    // if we've gone past, step si
    if(progress > this.sweeps[si][4]) {
      si++;
      if(si > this.sweeps.length -1) break;
    }

    this.data[i*3    ] = this.sweeps[si][1];
    this.data[i*3 + 1] = this.sweeps[si][2];
    this.data[i*3 + 2] = this.sweeps[si][3];

  }

  // remove finished sweeps
  for (i = this.sweeps.length-1; i >= 0; i--) {
    if(this.sweeps[i][4] > 1) {
      this.sweeps.splice(i,1);
    }
  }

  this.write();
};


var neopix = new NeoPixels(D1, 64);

function animate(c){

  if(c === undefined) c = 0xffffff;

  var t = 0;

  neopix.sweep(0xFF0000, t+=100);
  neopix.sweep(0xFF7F00, t+=100);
  neopix.sweep(0xFFFF00, t+=100);
  neopix.sweep(0x96bf33, t+=100);
  neopix.sweep(0x0000FF, t+=100);

  neopix.sweep(c, t+=100);

  neopix.sweep(0x000000, t+=2500);
  neopix.sweep(0xFF0000, t+=100);
  neopix.sweep(0xFFFF00, t+=100);
  neopix.sweep(0x0000FF, t+=100);
  neopix.sweep(0x000000, t+=100);

}


const root_topic = '/lights/';

// a list of topics to subscribe to
const MQTT_subs = [
  root_topic + '#'
];


// (implement this) - a handler for incoming messages
function MQTT_handle(topic, payload) {
  if(topic.indexOf(root_topic) === 0) {
    var rest = topic.substr(root_topic.length);
    var addr = parseInt(rest, 10);
    var colr = parseInt((payload+'').replace('#',''), 16);

    if(!isNaN(addr))  neopix.set(addr, colr);
    if(rest == 'all') animate(colr);
  }
}




animate(0x0088ff);
