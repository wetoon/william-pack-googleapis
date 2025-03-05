
import { GoogleAuth, GoogleDrive, type CacheToken } from "../src";

const storage = new Map<'t',CacheToken>

const auth = new GoogleAuth({
    credential: {
        "type": "service_account",
        "project_id": "",
        "private_key_id": "",
        "private_key": "-----BEGIN PRIVATE KEY-----\n[KEY]\n-----END PRIVATE KEY-----\n",
        "client_email": "",
        "client_id": "",
        "auth_uri": "",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509",
        "universe_domain": "googleapis.com"
    },
    cache: {
        onGet: () => storage.get('t'),
        onSet: ( token ) => storage.set('t',token)
    }
});

const drive = new GoogleDrive( auth, [''] );

const files = await drive.findAll();

console.log( files, storage )
