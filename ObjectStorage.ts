class ObjectStorageConfig {
    accept: string;
    multiple: boolean;
}

class ObjectStorage {

    constructor( config: ObjectStorageConfig ) {

    }

	private createUi( parent: Node ) {
		let ui = {
            "input" : {
                "type" : "file"
            }
        }
        DocComposer.compose( ui, parent );
    }
    public render() {
        //this.saveToFile( { "test": 123 } );
        let ui = this.createUi( document.body );
    }
    public saveToFile( obj: Object ) {
        let json = JSON.stringify( obj );
        const file: File = new File( [ json ], "temp", null );
        let input = document.createElement( "input" );
        input.type = "file";
        input.click();
    }
}

var objectStorage = new ObjectStorage( null );