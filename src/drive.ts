
import { GoogleAuth } from "."

export class GoogleDrive {

    private google: GoogleAuth;
    private folderId: string[]

    constructor( google: GoogleAuth, folderId: string[] ) {
        this.google = google
        this.folderId = folderId
    }

    public create = async ( file: File ): Promise<string> => {
        const body = new FormData();
        body.append( "metadata", new Blob([
            JSON.stringify({
                parents: this.folderId, name: file.name || Date.now().toString(), mimeType: file.type
            })
        ], { type: "application/json" } ));
        body.append( "file", file );
        const token = await this.google.getRefreshToken();
        const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
            body, method: "POST", headers: { "Authorization": `Bearer ${ token }` }
        });
        const { id } = await response.json() as { id: string };
        return id;
    }

    public remove = async ( fileId: string ): Promise< true | false > => {
        const token = await this.google.getRefreshToken();
        try {
            await fetch( `https://www.googleapis.com/drive/v3/files/${ fileId }`, {
                method: "DELETE", headers: { "Authorization": `Bearer ${ token }` }
            });
            return true
        } catch {
            return false
        }
    }

    public findAll = async () => {
        const token = await this.google.getRefreshToken();
        try {
            const response = await fetch( `https://www.googleapis.com/drive/v3/files?q='me' in owners&fields=files(id, name)`, {
                method: "GET", headers: { "Authorization": `Bearer ${ token }` }
            });
            const data = await response.json() as { files: { id: string, name: string }[] };
            return data.files
        } catch {
            return []
        }
    }

}
