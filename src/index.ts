
import { getAccessToken } from "./utils";

export type GoogleServiceAccount = {
    project_id: string;
    private_key: string;
    client_email: string;
    [ key: string ]: string;
};

export type initializeAuth = {
    credential: string | GoogleServiceAccount;
    cache?: CacheTokenToStorage
}

export type CacheToken = {
    token: string;
    exp: number;
};

export type CacheTokenToStorage = {
    onGet: () => string | CacheToken | undefined | Promise< string | CacheToken | undefined >;
    onSet: ( value: CacheToken ) => any | Promise< any >;
};

export class GoogleAuth {

    private serviceAccount: GoogleServiceAccount;
    private localCache = new Map<'access',CacheToken>;

    private parseJSON( value: string ) {
        try {
            return JSON.parse( value );
        } catch {
            return {}
        }
    }

    public cache: CacheTokenToStorage = {
        onGet: () => this.localCache.get('access'),
        onSet: ( token ) => this.localCache.set('access',token)
    }

    public async getRefreshToken() {

        const access = await this.cache.onGet();

        if ( typeof access == "string" ) {
            const json_parse: CacheToken = JSON.parse( access );
            if ( typeof json_parse.token == "string" && typeof json_parse.exp == "number" && json_parse.exp > Date.now() ) {
                return json_parse.token
            }
        }
        else if ( typeof access == "object" && typeof access.token == "string" && typeof access.exp == "number" ) {
            if ( access.exp > Date.now() ) {
                return access.token
            }
        }

        try {
            const token = await getAccessToken( this.serviceAccount );
            await this.cache.onSet({ token: token as string, exp: Date.now() + 3598e3 })
            return token
        } catch {
            return undefined
        }

    }
    
    constructor( initialize: initializeAuth ) {

        this.serviceAccount = typeof initialize.credential == "object" ? initialize.credential : this.parseJSON( initialize.credential );

        if ( !this.serviceAccount.client_email || !this.serviceAccount.project_id || !this.serviceAccount.private_key ) {
            throw new Error("Googleapis require { client_email, project_id, private_key }")
        }

        if ( initialize.cache && typeof initialize.cache.onGet == "function" && typeof initialize.cache.onSet == "function" ) {
            this.cache = initialize.cache
        }

    }

}

export { GoogleDrive } from "./drive";
