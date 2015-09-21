#include <SoftwareSerial.h>
//Use software serial to receive keys from BT since USB is used to emulate keyboard.
SoftwareSerial mySerial(14, 16); //RX, TX
//Status LED
int ledPin = 9;

void setup() {
  //define LED as Output
  pinMode(ledPin, OUTPUT); 
  
  //Init software serial with 9600baud rate
  //HC-05 works at 9600baud in data mode
  //HC-05 works at 38400 in AT mode  
  mySerial.begin(9600);
//  mySerial.write("AT+NAMEPLX");
}

void loop() {
//  sendText("itrollolol.com");
//  delay(25);
//  digitalWrite(ledPin, HIGH);
//  delay(25);
//  digitalWrite(ledPin, LOW);
//https://support.plex.tv/hc/en-us/articles/201670487-Keyboard-Shortcuts
//KEY_UP_ARROW	  0xDA	218
//KEY_DOWN_ARROW	0xD9	217
//KEY_LEFT_ARROW	0xD8	216
//KEY_RIGHT_ARROW	0xD7	215
//KEY_RETURN    	0xB0	176
//KEY_ESC	        0xB1	177
  
  if (mySerial.available()) {
    Keyboard.write( mySerial.read() );
  }
}
