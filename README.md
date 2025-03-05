# GoogleAPI Library

## Features

- Google Drive API v3 support
- Google Realtime Database support
- Uses `fetch` for HTTP requests
- Supports caching access tokens

## Installation

Install via npm:

```sh
npm install @william-pack/googleapis
```

or using bun:

```sh
bun add @william-pack/googleapis
```

## Usage

### Import the Library

ESM
```ts
import { GoogleAuth } from "@william-pack/googleapis";
```
CommonJS
```js
const { GoogleAuth } = require("@william-pack/googleapis");
```

### Initialize API
Support Google Service Account only
```ts
const auth = new GoogleAuth({
    credential: {
        project_id: "your_project_id",
        private_key: "your_private_key",
        client_email: "your_client_email"
    }
});
```

## Google Drive API
```ts
import { GoogleDrive } from "@william-pack/googleapis";
const drive = new GoogleDrive( auth, ['your_google_drive_folder_id'] );
```

### Create a File
```ts
const file = new File(["Hello World"], "hello.txt", { type: "text/plain" });
await drive.create( file );
// return id: string
```

### Remove a File
```ts
await drive.remove("your_file_id");
// return file is removed: true | false
```

### Find All Files
```ts
await drive.findAll();
// return files: { id:string, name: string }[]
```

## Google Realtime Database API
```ts
import { GoogleDatabase } from "@william-pack/googleapis";
const database = new GoogleDatabase( auth, "your_database_url" );
```

### Create Data
```ts
await database.create("/path/to/data", { key: "value" });
// return your data
```
type save data
```ts
await database.create<{ key: type }>("/path/to/data", { username:"..." })
```

### Remove Data
```ts
await database.remove("/path/to/data");
// return data is removed: true | false
```

### Find All Data
```ts
await database.findAll("/path/to/data");
// reurn data
```
type save response
```ts
await database.findAll<{ key: type }>("/path/to/data");
```

### Query Data
```ts
await database.query("/path/to/data", {
    orderBy: "your_data_key",
    equalTo: "your_data_value"
});
// return data
```
type save response
```ts
await database.query<{ key: type }>("/path/to/data", {
    orderBy: "your_data_key",
    equalTo: "your_data_value"
});
```

### Transaction
```ts
await database.transaction("/path/to/data", ( currentData ) => {
    return { ...currentData, updatedKey: "newValue" };
});
// return data
```
type save data
```ts
await database.transaction<{ key: type }>("/path/to/data", ( currentData ) => {
    return { ...currentData, updatedKey: "newValue" };
});
```

## Repository

[GitHub Repository](https://github.com/wetoon/william-pack-googleapis)

## License

This project is licensed under the [MIT License](LICENSE).
