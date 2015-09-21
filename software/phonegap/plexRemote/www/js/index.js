/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.showMainPage();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var TOUCH_START = 'touchstart';
        if (window.navigator.msPointerEnabled) { // windows phone
            TOUCH_START = 'MSPointerDown';
        }
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener(TOUCH_START, this.refreshDeviceList, false);
        deviceList.addEventListener('touchstart', this.connect, false);

        //Send keyboard modifiers to Arduino (https://www.arduino.cc/en/Reference/KeyboardModifiers)
        escapeButton.addEventListener(TOUCH_START, function(){app.sendKey(177, escapeButton);}, false);
        volumeUpButton.addEventListener(TOUCH_START, function(){app.sendKey(43, volumeUpButton);}, false);
        volumeDownButton.addEventListener(TOUCH_START, function(){app.sendKey(45, volumeDownButton);}, false);
        upButton.addEventListener(TOUCH_START, function(){app.sendKey(218, upButton);}, false);
        leftButton.addEventListener(TOUCH_START, function(){app.sendKey(216, leftButton);}, false);
        enterButton.addEventListener(TOUCH_START, function(){app.sendKey(176, enterButton);}, false);
        rightButton.addEventListener(TOUCH_START, function(){app.sendKey(215, rightButton);}, false);
        downButton.addEventListener(TOUCH_START, function(){app.sendKey(217, downButton);}, false);

        subTitleButton.addEventListener(TOUCH_START, function(){app.sendKey(76, subTitleButton);}, false);                 //L
        subTitleToggleButton.addEventListener(TOUCH_START, function(){app.sendKey(83, subTitleToggleButton);}, false);     //S
        progressButton.addEventListener(TOUCH_START, function(){app.sendKey(79, progressButton);}, false);                  //O
        infoButton.addEventListener(TOUCH_START, function(){app.sendKey(105, infoButton);}, false);                         //i
        // pauseButton.addEventListener(TOUCH_START, function(){app.sendKey(217, pauseButton);}, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        var classes = refreshButton.className
        refreshButton.className = classes + ' keyPressed';
        bluetoothSerial.list(app.onDeviceList, app.onError);
        refreshButton.className = classes + ' keyDepressed';
    },
    onDeviceList: function(devices) {
        var option;

        // remove existing devices
        deviceList.innerHTML = "";
        app.setStatus("");

        devices.forEach(function(device) {

            var listItem = document.createElement('li'),
                html = '<b>' + device.name + '</b><br/>' + device.id;

            listItem.innerHTML = html;

            if (cordova.platformId === 'windowsphone') {
              // This is a temporary hack until I get the list tap working
              var button = document.createElement('button');
              button.innerHTML = "Connect";
              button.addEventListener('click', app.connect, false);
              button.dataset = {};
              button.dataset.deviceId = device.id;
              listItem.appendChild(button);
            } else {
              listItem.dataset.deviceId = device.id;
            }
            deviceList.appendChild(listItem);

            if (device.name == 'plexREMOTE') {
                app.setStatus("Found " + device.name);
                app.connectToID(device.id);
            }
        });

        if (devices.length === 0) {

            option = document.createElement('option');
            option.innerHTML = "No Bluetooth Devices";
            deviceList.appendChild(option);

            if (cordova.platformId === "ios") { // BLE
                app.setStatus("No Bluetooth Peripherals Discovered.");
            } else { // Android or Windows Phone
                app.setStatus("Please Pair a Bluetooth Device.");
            }

        } 
        // else {
        //     app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
        // }

    },
    connectToID: function(id) {
        bluetoothSerial.connect(id, app.onConnect, app.onError);
        app.setStatus("Connecting...");
    },
    connect: function(e) {
        var deviceId = e.target.dataset.deviceId;
        if (!deviceId) { // try the parent
            deviceId = e.target.parentNode.dataset.deviceId;
        }

        app.connectToID(deviceId);
    },
    onConnect: function() {
        // subscribe for incoming data
        bluetoothSerial.subscribe('\n', app.onData, app.onError);

        // resultDiv.innerHTML = "";
        app.setStatus("Connected");
        app.showDetailPage();
    },
    onData: function(data) { // data received from Arduino
        console.log(data);
        // resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + data + "<br/>";
        // resultDiv.scrollTop = resultDiv.scrollHeight;
    },
    sendKey: function(key, button) { // send data to Arduino
        app.setStatus(key);
        var success = function() {
            console.log("success");
            // resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            // resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed writing data to Bluetooth peripheral");
        };

        bluetoothSerial.write(String.fromCharCode(key), success, failure);
    },
    disconnect: function(event) {
        bluetoothSerial.disconnect(app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.style.display = "";
        detailPage.style.display = "none";
    },
    showDetailPage: function() {
        mainPage.style.display = "none";
        detailPage.style.display = "";
    },
    setStatus: function(message) {
        console.log(message);

        window.clearTimeout(app.statusTimeout);
        statusDiv.innerHTML = message;
        statusDiv.className = 'fadein';

        // automatically clear the status with a timer
        app.statusTimeout = setTimeout(function () {
            statusDiv.className = 'fadeout';
        }, 5000);
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    }
};
