
const button = document.getElementById("getDetails");
const details = document.getElementById("details");
const data_panel = document.getElementById('data_panel')
// import { jsBridge } from './jsbridge-mini.js'


button.addEventListener("click", async () => {
  try {
    // navigator.bluetooth.requestDevice({
    //   filters: [{
    //   // namePrefix: 'XP-T202UA',
    //   acceptAllDevices: true,
    //   services: ['E7810A71-73AE-499D-8C15-FAA9AEF0C3F2'],
    //   }]
    //   })
    //   .then(device => {
    //   console.log('> Found ' + device.name);
    //   console.log('> Found ' + device.id);
    //   console.log('Connecting to GATT Server...');
    //   return device.gatt.connect();
    //   })
    //   .then(server => server.getPrimaryService('E7810A71-73AE-499D-8C15-FAA9AEF0C3F2'))
    //   .then(service => service.getCharacteristic('E7810A71-73AE-499D-8C15-FAA9AEF0C3F2'))
    //   .then(characteristic => {
    //   // Cache the characteristic
    //   printCharacteristic = characteristic;
    //   // console.log(printCharacteristic);
    //   sendPrinterData();
    //   }).catch(e => {
    //          console.log(e.code + ':' + e.message);
    //      });

    // Request the Bluetooth device through browser
    const device = await navigator.bluetooth.requestDevice({
      // optionalServices: ["battery_service", "device_information"],
      optionalServices: [ "device_information"],

      acceptAllDevices: true,
    });

    // Connect to the GATT server
    // We also get the name of the Bluetooth device here
    let deviceName = device.gatt.device.name;
    let deviceId = device.gatt.device.id;
    // let address = device.gatt.device.address;
    // res.json(address);
    console.log(String(deviceName));
    console.log(String(deviceId));
    //  const server = await device.gatt.connect();
    device.gatt
    .connect()
    // .then(async () => {
    //     const service = await device.gatt.getPrimaryService(
    //       'E7810A71-73AE-499D-8C15-FAA9AEF0C3F2'
    //       )
          
    //       ;
    //     console.log(service);
    // })
    .then(server => {
      // Note that we could also get all services that match a specific UUID by
      // passing it to getPrimaryServices().
      console.log('Getting Services...');
      return server.getPrimaryServices('E7810A71-73AE-499D-8C15-FAA9AEF0C3F2');
    })
    .then(services => {
      console.log('Getting Characteristics...');
      let queue = Promise.resolve();
      services.forEach(service => {
        queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
          console.log('> Service: ' + service.uuid);
          characteristics.forEach(characteristic => {
            console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
                getSupportedProperties(characteristic));
          });
        }));
      });
      return queue;
    })
    .catch(error => {
      log('Argh! ' + error);
    });



    // alert("test")
    // Getting the services we mentioned before through GATT server
    // const batteryService = await server.getPrimaryService("battery_service");
    // const infoService = await server.getPrimaryService("device_information");

    // Getting the current battery level
    // const batteryLevelCharacteristic = await batteryService.getCharacteristic(
    //   "battery_level"
    // );
    // Convert recieved buffer to number
    // const batteryLevel = await batteryLevelCharacteristic.readValue();
    // const batteryPercent = await batteryLevel.getUint8(0);

    // Getting device information
    // We will get all characteristics from device_information
    // const infoCharacteristics = await infoService.getCharacteristics();

    // console.log(infoCharacteristics);

    // let infoValues = [];

    // const promise = new Promise((resolve, reject) => {
    //   infoCharacteristics.forEach(async (characteristic, index, array) => {
    //     // Returns a buffer
    //     const value = await characteristic.readValue();
    //     console.log(new TextDecoder().decode(value));
    //     // Convert the buffer to string
    //     infoValues.push(new TextDecoder().decode(value));
    //     if (index === array.length - 1) resolve();
    //   });
    // });

    // promise.then(() => {
    //   console.log(infoValues);
    //   // Display all the information on the screen
    //   // use innerHTML
    //   details.innerHTML = `
    //   Device Name - ${deviceName}<br />
    //   Battery Level - ${batteryPercent}%<br />
    //   Device Information:
    //   <ul>
    //     ${infoValues.map((value) => `<li>${value}</li>`).join("")}
    //   </ul> 
    // `;

    //});
  } catch (err) {
    console.log(err);
    alert("An error occured while fetching device details");
  }
});

