namespace ElevenDotJs {
    export enum ObjectStorageOperation {
        read=1,
        write
    }

    export class ObjectStorageMetadata {
        // Unique data-type identifier useful to validate input files for a given use-case.
        private graphType: string;
        private writeDate: Date;
    }

    export class ObjectStorageConfig {
        operation: ObjectStorageOperation;
        parent: Node;
        accept?: string;
        multiple?: boolean; // We can read multiple files for read operations.
        label: string;
        tooltip?: string;
        callback: Function;
    }

    export class ObjectStorage {

        private config: ObjectStorageConfig;
		private componentId: string;
        private readPayload: Object = null;
        private writePayload: Object;
        
        constructor( config: ObjectStorageConfig, componentId: string, writePayload?: Object ) {
            this.writePayload = writePayload;
            this.config = config;
            this.componentId = componentId;
            this.createUi();
        }

        private createUi() {
            let ui = {
                "label": {
                    "text": this.config.label,
                    "style": `font-family: ${ElevenDotJs.defaultFont};`,
                    "input": {
                        "id": this.inputElementId(),
                        "type": "file",
                        "title": this.config.tooltip,
                        "accept": this.config.accept,
                        "multiple": this.config.multiple,
                        "style": `font-family: ${ElevenDotJs.defaultFont};`,
                    }
                }
            }
            DocComposer.compose( ui, this.config.parent );
            this.inputElement().addEventListener( "input", this.inputHandler() );
        }

        private inputElementId() {
            return this.componentId + "_input";
        }

        private inputElement() {
            return document.getElementById( this.inputElementId() );
        }

        private inputHandler(): EventListener {
            switch( this.config.operation ) {
            case ObjectStorageOperation.read:
                return function( ev: Event ) { this.readFile( ev ); }.bind( this );
                break;
            case ObjectStorageOperation.write:
                return function( ev: Event ) { this.writeFile( ev ); }.bind( this );
                break;
            }
        }

        //
        // Read zero or more files and return an array of JS objects. Also
        // save the payload(s) in this.readPayload
        // GPT 2024-07-20 gave me the use of Promise to simulate blocking read.
        private async readFile( ev ) {
            const ret = [];
            let files = ev.target.files;
        
            const readAsText = (file) => {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(reader.error);
                    reader.readAsText(file);
                });
            };
        
            const fileReaders = [];
        
            for (let i = 0; i < files.length; i++) {
                fileReaders.push(
                    readAsText(files[i]).then((text) => {
                        ret.push(JSON.parse(text as string));
                    }).catch((error) => {
                        console.error("Error reading file:", error);
                    })
                );
            }
        
            // Await the Promise.all to ensure it's blocking and then assign the resolved ret array to this.readPayload
            await Promise.all( fileReaders );
            
            // Update the instance member after reading all files
            this.readPayload = ret;
        
            // Call the callback with the result
            if (this.config.callback) {
                this.config.callback(this.readPayload);
            }
        }
        
        
        // Called after user chooses an output file path using an <input type="file"/>
        // Due to sandboxing, a download is as close as we can get to a true Save UX
        private async writeFile(ev) {
            if( this.writePayload ) {
                let json = JSON.stringify(this.writePayload);
                let file = ev.target.files[0];

                try {
                    // Create a new blob with the JSON data
                    let blob = new Blob([json], { type: 'application/json' });

                    // Create a link element
                    let link = document.createElement('a');

                    // Create a URL for the blob and set it as the href attribute
                    link.href = URL.createObjectURL(blob);

                    // Set the download attribute with the original file name
                    link.download = file.name;

                    // Append the link to the body (necessary for Firefox)
                    document.body.appendChild(link);

                    // Programmatically click the link to trigger the download
                    link.click();

                    // Clean up the URL object
                    URL.revokeObjectURL(link.href);

                    // Remove the link from the document
                    document.body.removeChild(link);

                    console.log("File written successfully");
                } catch (error) {
                    console.error("Error writing file:", error);
                }
            } else {
                console.log( "ElevenDotJs.ObjectStorage.writeFile: no payload!" );
            }
        }

        public setPayload( payload: Object ) {
            this.writePayload = payload;
        }
    }
}