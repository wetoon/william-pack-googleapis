
import { GoogleAuth } from "."

export class GoogleDatabase {

    private google: GoogleAuth;
    private endpoint: string;
    
    constructor( google: GoogleAuth, databaseURL: string ) {

        this.google = google;

        if ( !/^https:\/\/[a-zA-Z0-9\-]+\.firebaseio\.com\/$/.test( databaseURL ) ) {
            throw new Error("Invalid firebase realtime database url")
        }

        this.endpoint = new URL( databaseURL ).origin;

    }

    public async findAll< ResponseType = any >( path: `/${ string }` ): Promise< ResponseType | null > {
        const token = await this.google.getRefreshToken();
        const response = await fetch(`${ this.endpoint }${ path }.json`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok ? await response.json() : null;
    }

    public async create< DataType = any >( path: `/${ string }`, data: DataType ) {
        const token = await this.google.getRefreshToken();
        const response = await fetch(`${ this.endpoint }${ path }.json`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.ok ? data : null;
    }

    public async remove( path: `/${ string }` ) {
        const token = await this.google.getRefreshToken();
        const response = await fetch(`${ this.endpoint }${ path }.json`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok;
    }

    public async query< ResponseType = any >( path: `/${ string }`, queryParams: Record< "orderBy" | "equalTo", any > ): Promise< ResponseType | null > {
        const token = await this.google.getRefreshToken();
        const queryString = new URLSearchParams( queryParams ).toString();
        const response = await fetch(`${ this.endpoint }${ path }.json?${ queryString }`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.ok ? await response.json() : null;
    }

    async transaction< DataType = any >( path: `/${ string }`, updateFn: ( currentData: DataType ) => DataType ): Promise< DataType | null > {
        try {
            const token = await this.google.getRefreshToken();
            const url = `${ this.endpoint }${ path }.json`;
            const response = await fetch( url, {
                method: "GET", headers: { Authorization: `Bearer ${token}` },
            });
            if ( !response.ok ) throw new Error(`Error fetching data: ${ response.statusText }`);
            const currentData = await response.json();
            const newData = updateFn( currentData );
            const updateResponse = await fetch( url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });
            if ( !updateResponse.ok ) throw new Error(`Error updating data: ${ updateResponse.statusText }`);
            return await updateResponse.json();
        } catch ( error ) {
            console.error("Transaction failed:", error);
            return null;
        }
    }

}
