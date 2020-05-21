//LCD Keypad Shild with BME280 module

var five = require("johnny-five");
var board = new five.Board();
const assert = require('assert');
// MongoDB module
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/mydb";

board.on("ready", function() {
  var lcd = new five.LCD({ 
    pins: [8, 9, 4, 5, 6, 7], 
    backlight: 10,
    rows: 2,
    cols: 16
  });

  lcd.clear();
  var backlight = new five.Pin(10); //backlight pin setting
  lcd.cursor(0, 0).print("Desktop Clock");
  lcd.cursor(1, 0).print(" &Thermometer");
  
  var multi = new five.Multi({
    controller: "BME280",
    address: 0x76, // optional
    freq: 300000, //300000 ms
  });
  
  var i = 0;
  multi.on("data", function() {
    if (i == 0){
      lcd.clear();
      lcd.cursor(0, 0).print("Celsius:" + this.thermometer.celsius);
      lcd.cursor(1, 0).print("Humidity:" + this.hygrometer.relativeHumidity);

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
  const db = client.db("mydb") 
  console.log("Connected to MongoDB")
  db.collection("test",(err, collection) => {
    // Insert Document  
    collection.insertOne({ 
        date: new Date(), 
        Celsius: this.thermometer.celsius,
        Humidity: this.hygrometer.relativeHumidity
      },(err,result) => {
        console.log("InsertOne Success") ;
        // console.dir(result);
    });

    // Find last Document
    const query = {}; //name: 'john'
    collection.find(query)
      .sort({date:-1})
      .limit(1)
      .each(function(err, docs) {
        if(docs){
        // 取得結果の検証
        assert.equal(null, err);
        // コンソールに取得結果を表示
        console.log(docs);
        }
      });
    console.log("Closed MongoDB")
    client.close();
  });
});


    i = 1;
    }else{
      console.log(new Date().toLocaleString()); //2020-4-22 22:53:53
      lcd.clear();
      lcd.cursor(0, 0).print(new Date().toDateString()); //Wed Apr 22 2020
      lcd.cursor(1, 0).print(new Date().toLocaleTimeString());  //22:53:53
      i = 0;
    }
  });

  var keypad = new five.Keypad({
    pin: "A0",
    length: 6,
    keys: ["UP", "DOWN", "LEFT", "RIGHT", "SELECT",""]
  });

  var led = new five.Led("A3");
  led.blink(200);

  keypad.on("press", function(event) {
    if (event.which) {
      console.log(event.which,Date(event.timestamp));
      lcd.clear();
      // lcd.cursor(0, 0).print(event.which);
      // lcd.cursor(1, 0).print(new Date(event.timestamp).toLocaleTimeString());
             
    }
    if (event.which == "UP") {
      console.log("LED ON!!");
      lcd.cursor(0, 0).print("LED ON!!");
      led.blink(200);
      // led.on();
      
      
    }
    if (event.which == "DOWN") {
      console.log("LED OFF");
      lcd.cursor(0, 0).print("LED OFF");
      // led.off();
      led.stop().off(); //led.blink stop command
    }
    if (event.which == "SELECT") {
      console.log("Backlight ON!!");
      lcd.cursor(0, 0).print("Backlight ON!!");
      lcd.on();
      backlight.high();
    }
    if (event.which == "LEFT") {
      console.log("Backlight OFF");
      lcd.cursor(0, 0).print("Backlight OFF");
      lcd.off();
      backlight.low();
      
    }
    
  });

});

