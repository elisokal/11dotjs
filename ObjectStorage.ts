namespace ElevenDotJs {
    export enum ObjectStorageOperation {
        readFile=1,
        readFiles,
        writeFile
    }

    export class ObjectStorageConfig {
        operation: ObjectStorageOperation;
        parent: Node;
        accept: string;
        multiple: boolean;
        label: string;
        tooltip: string;
    }

    export class ObjectStorage {

        constructor( config: ObjectStorageConfig ) {
            this.createUi( config );
        }

        private createUi( config: ObjectStorageConfig ) {
            let ui = {
                "input" : {
                    "type" : "file",
                    "onclick": ""
                }
            }
            switch( config.operation ) {
            case ObjectStorageOperation.readFile:
                break;
            case ObjectStorageOperation.readFiles:
                break;
            case ObjectStorageOperation.writeFile:
                break;
            }
            DocComposer.compose( ui, config.parent );
        }

        public saveToFile( obj: Object ) {
            let json = JSON.stringify( obj );
            const file: File = new File( [ json ], "temp", null );
            let input = document.createElement( "input" );
            input.type = "file";
            input.click();
        }
    }

    export var objectStorage = new ObjectStorage( null );
}    