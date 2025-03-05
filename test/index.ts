
import { GoogleAuth, GoogleDrive, type CacheToken } from "../dist";

const storage = new Map<'t',CacheToken>

const auth = new GoogleAuth({
    credential: {
        "project_id": process.env['project_id'] as string,
        "private_key": process.env['private_key'] as string,
        "client_email": process.env['client_email'] as string
    },
    cache: {
        onGet: () => storage.get('t'),
        onSet: ( token ) => storage.set('t',token)
    }
});

const drive = new GoogleDrive( auth, [''] );

const files = await drive.findAll();

console.log( files, storage )
