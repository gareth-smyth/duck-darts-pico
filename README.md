## Duck Darts Pico
Soft-tip dart board software to run on Kaluma on a Raspberry Pi Pico W. It reads the board to work out which
sector has been hit, and sends the resulting value using the WebSocket protocol.

## Status
Currently just opens a websocket and does nothing else.

## Requirements
A Raspberry Pi Pico W
A Soft-tip dartboard that uses a double membrane keyboard type mechanism
A way to connect the output from the soft tip dart board to the GPIO pins of the Pico W.

[NodeJS](https://nodejs.org/en)

[Kaluma CLI](https://github.com/kaluma-project/kaluma-cli)

## Set up the Pico
After you've set up Kaluma on your Pico W according to the instructions you need to do the following

Run 

`kaluma shell`

then in the interactive terminal set the following values

```js
storage.setItem('WIFI_SSID', '<YOUR_SSID>');
storage.setItem('WIFI_PASSWORD', '<YOUR_PASSWORD');
storage.setItem('WIFI_SECURITY', 'WPA2_WPA_PSK');
```

now exit the Kaluma shell with Ctrl-Z.

## Load the software
Run
```shell
npm i
npm run load
```
This will bundle the code, and flash it onto the connected Pico.

## Test the web service
Your Pico should now be up and running and serving pages. If you can hit 
[http://<your_pi_ip_address>:8124/](http://<your_pi_ip_address>:8124/) in your browser and get a 200 response
everything should be up and running.
