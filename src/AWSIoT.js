var awsIot = require('aws-iot-device-sdk');

var app = {}

app.TOPIC_LOG = "MagicMirror:new-log"

app.setup = function() {
  app.device = awsIot.device({
    keyPath: __dirname + "/certs/MagicMirrorWillSeeYouNow.private.key",
    certPath: __dirname + "/certs/MagicMirrorWillSeeYouNow.cert.pem",
    caPath: __dirname + "/certs/root-CA.crt",
    clientId: "MagicMirror" + (new Date().getTime()),
    region: "us-east-1",
  });

  app.device.on('connect', function() {
    console.log('connect');
  });

  app.device.on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });
}

// Method that will accept an array of images and publish to AWS IoT
app.newLog = function(text, callback) {
  var update = {
    "log": text
  };

  app.device.publish(app.TOPIC_LOG, JSON.stringify(update), function() {
    console.log("Published: \nTopic => " + app.TOPIC_LOG + "Data => " + JSON.stringify(update));
    callback()
  });
}

module.exports = app