import { GoogleAuth, GoogleDrive } from "../src";
import fs from "fs";

const storage = {
    access_token: fs.readFileSync( __dirname + '/cache.json', 'utf8' ),
    service: fs.readFileSync( __dirname + '/service.json', 'utf8' )
};

const auth = new GoogleAuth({
    credential: storage.service,
    cacheToken: {
        onGet: () => storage.access_token,
        onSet: ( token ) => {
            storage.access_token = token;
            fs.writeFileSync( __dirname + '/cache.json',storage.access_token,{ encoding:'utf8' })
        }
    }
})
