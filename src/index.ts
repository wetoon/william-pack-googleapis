import { getAccessToken } from "./utils";

export type GoogleServiceAccount = {
    project_id: string;
    private_key: string;
    client_email: string;
    [key: string]: string;
};

type StorageToken = {
    token: string;
    exp: number;
};

type CacheStorage = {
    onGet: () => string | undefined;
    onSet: (token: string) => any | Promise<any>;
};

export class GoogleAuth {

    private ServiceAccount: GoogleServiceAccount;
    public cacheToken?: CacheStorage;

    public getAuth() {
        return this.ServiceAccount;
    }

    public async getRefreshToken() {
        const setCacheToken = async (token: string) => {
            if ( !this.cacheToken?.onSet ) return false;
            try {
                const storageToken: StorageToken = { token, exp: Date.now() + 3599e3 };
                await this.cacheToken.onSet( JSON.stringify( storageToken ) );
                return true;
            } catch (e) {
                console.error( "Failed to set cache token:", e );
                return false;
            }
        };

        if ( this.cacheToken?.onGet ) {
            const jsonToken = this.cacheToken.onGet();
            if ( jsonToken && jsonToken !== '{}' ) {
                try {
                    const { token, exp }: StorageToken = JSON.parse( jsonToken );
                    if ( exp > Date.now() ) {
                        return token;
                    }
                } catch (e) {
                    console.error("Failed to parse cached token:", e);
                }
            }
        }

        try {
            const token = await getAccessToken( this.getAuth() );
            await setCacheToken( token as string );
            return token;
        } catch (e) {
            console.error("Failed to get access token:", e);
            throw e;
        }
    }

    constructor( initialize: { credential: GoogleServiceAccount | string; cacheToken?: CacheStorage } ) {
        
        let service: GoogleServiceAccount;

        if ( typeof initialize.credential === "string" ) {
            try {
                service = JSON.parse( initialize.credential );
            } catch (e) {
                throw new Error("Invalid credential JSON string");
            }
        } else {
            service = initialize.credential;
        }

        if ( !service.project_id || !service.private_key || !service.client_email ) {
            throw new Error("ServiceAccount requires project_id, private_key, and client_email");
        }

        this.ServiceAccount = service;
        this.cacheToken = initialize.cacheToken;

    }
}

export { GoogleDrive } from "./drive";
