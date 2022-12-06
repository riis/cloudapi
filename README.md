# DJI Cloud API Demo

Demo to showcase connecting a drone to the Cloud API and viewing its real-time location on a map.

## Setup
1. Follow the DJI Docker guide for setting up the backend / front end. However, the front-end will not be used.
    > In my case, the `dji-cloud-api` itself does not work on docker, therefore, download the `Java` backend seperately and run it. In addition, the `emqx` version specified in the `dockerfile` may not work on M1 Macs, therefore, change the version to `latest`

2. Update all environment variables in the backend configuration. By default, the MQTT username is `admin` and the password is `public`. 
    > Note: OSS will not be used, therefore, leave it all commented out.

3. Create a new file called `.env`, copy and past the existing text from `.env.example` into it. Then place a `Mapbox` public key, DJI `app id`, DJI `app key`, and DJI `app license` inside it.
3. Run the containers (besides the `cloud-api-backend`) and run this application with `npm run start`

4. On the controller, go to the `third-party cloud services` and enter in `http://<your_machines_ip>:3000/pilot`, then click `connect`.

5. On the site, click the refresh button to reload the device list. Then, click the `aircrafts` card to be taken to the drone's position on the map.