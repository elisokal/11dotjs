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

        private config: ObjectStorageConfig;

        constructor( config: ObjectStorageConfig ) {
            this.config = config;
            this.createUi();
        }

        private createUi() {
            let ui = {
                "label": {
                    "text": this.config.label,
                    "input": {
                        "type" : "file",
                        "title": this.config.tooltip,
                        "accept": this.config.accept,
                        "multiple": this.config.multiple,
                    }
                }
            }
            const el = DocComposer.compose( ui, this.config.parent );
            el.addEventListener( "input", this.inputHandler() );
        }

        private inputHandler(): EventListener {
            switch( this.config.operation ) {
            case ObjectStorageOperation.readFile:
                return function( ev: Event ) { alert( "readFile " + ev.target )};
                break;
            case ObjectStorageOperation.readFiles:
                return function( ev: Event ) { alert( "readFiles " + ev.target )};
                break;
            case ObjectStorageOperation.writeFile:
                return function( ev: Event ) { alert( "writeFile " + ev.target )};
                break;
            }
        }

        public saveToFile( obj: Object ) {
            let json = JSON.stringify( obj );
            const file: File = new File( [ json ], "temp", null );
            let input = document.createElement( "input" );
            input.type = "file";
            input.click();
        }
    }

    //export var objectStorage = new ObjectStorage( null );
}    