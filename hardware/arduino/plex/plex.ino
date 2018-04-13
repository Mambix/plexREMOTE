#include <Keyboard.h>

//Status LED
int ledPin = 9;
int BT_EN = 14;
int BT_STATE = 15;

void setup() {
  //define LED as Output
  pinMode(ledPin, OUTPUT); 
  pinMode(BT_EN, OUTPUT);
  pinMode(BT_STATE, INPUT);

  digitalWrite(BT_EN, HIGH);
  
  //Init software serial with 9600baud rate
  //HC-05 works at 9600baud in data mode
  //HC-05 works at 38400 in AT mode  
  Serial1.begin(9600);
//  mySerial.write("AT+NAMEPLX");
}

void loop() {
  if (Serial1.available()) {
    Keyboard.write( Serial1.read() );
  }
}
