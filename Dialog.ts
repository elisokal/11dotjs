enum DialogPosition {
    center = 1
}
class DialogConfig {
    parent: Node;
    title: string;
    dialogId: string;
    clientAreaId: string;
    position: DialogPosition;
    constructor( parent: Node, title: string, dialogId: string, clientAreaId: string, position: DialogPosition ) {
        this.parent = parent;
        this.title = title;
        this.dialogId = dialogId;
        this.clientAreaId = clientAreaId;
        this.position = position;            
    }
}
class Dialog {
    private dragStart = null;
    private config: DialogConfig;
    constructor( config: DialogConfig ) {
        this.config = config;
        this.createUi();
    }

	public createUi(): Node {
		let ui = {
			"div": {
                "id": this.config.dialogId,
                "style": "position: fixed; left: 40px; top: 40px; border:2px solid gray; border-radius: 8px; z-index: 99; "
                + "min-width: 256px; min-height: 256px; background-color: white; padding:0",
                "table" : {
                    //"style": "width: 100%",
                    "tbody": {
                        "tr" : [
                            {
                                "td": [
                                    {
                                        "text": this.config.title,
                                        "style": "text-align: center; font-family: consolas; font-size: 1.2em; cursor: move",
                                        "draggable": true,
                                        "id" : this.config.dialogId+"-titleBar"
                                    },
                                    {
                                        "text": "\u00D7",
                                        "style": "text-align: right; width:1em; cursor: pointer; font-size:1.5em",
                                        "onclick": `Dialog.detachElement('${this.config.dialogId}');`,
                                        "title" : "close me"
                                    }
                                ]
                            },
                            {
                                "td": {
                                    "id" : this.config.clientAreaId,
                                    "colspan": 2
                                }                                    
                            }
                        ]
                    }
                }
            }
		};
		const ret: Node = DocComposer.compose( ui, this.config.parent );
        this.configureDragDrop( ret, document.getElementById( this.config.dialogId+"-titleBar") );
        return ret;
	}

    public setPosition () {
        this.setPos( this.config.position );
    }

    private setPos( position: DialogPosition ) {
        if( position ) {
            switch( position ) {
            case DialogPosition.center:
                let dialog = this.getDialogElement();
                let x = window.innerWidth / 2 - dialog.clientWidth / 2;
                let y = window.innerHeight / 2 - dialog.clientHeight / 2;
                dialog.style.left = `${x}px`;
                dialog.style.top = `${y}px`;
                let stop = 1;
                break;
            }
        }
    }

    private getDialogElement() {
        return document.getElementById( this.config.dialogId );
    }

    private configureDragDrop( dialog: Node, titleBar: Node ) {
        if( dialog ) {
            let dropArea = dialog.parentNode;
            if( dropArea ) {
                titleBar.addEventListener( "dragstart", function dropHandler(ev) {
                    let de: DragEvent = ev as DragEvent;
                    let me: MouseEvent = ev as MouseEvent;
                    this.dragStart = [ me.clientX, me.clientY ];
                    de.dataTransfer.setData("text/plain", "What a drag.");
                }.bind(this));
                // Add drop events to the dropArea (body)
                dropArea.addEventListener( 'dragover', (event) => {
                    event.preventDefault(); // allow dropping
                });                
                dropArea.addEventListener( "drop", function dropHandler(ev) {
                    let me: MouseEvent = ev as MouseEvent;
                    let offset = [ me.clientX - this.dragStart[0], me.clientY - this.dragStart[1] ];
                    this.dragStart = [ this.dragStart[0] + offset[0], this.dragStart[1] + offset[1] ];
                    let droppedElement = dialog as HTMLElement;
                    let newCss = Dialog.applyOffset( droppedElement.style.left, droppedElement.style.top, offset[0], offset[1] );
                    droppedElement.style.left = newCss.left;
                    droppedElement.style.top = newCss.top;
                    //droppedElement.style.transform = `translate(${offset[0]}px, ${offset[1]}px)`; // meta.ai!
                    //droppedElement.style.left = `${de.x}px`;
                    //droppedElement.style.top = `${de.y}px`;
                    let stop = 1;//droppedElement.style.left = "";
                }.bind(this));
            }
        }
    }

    public static detachElement( id: string ) {
        let el = document.getElementById( id );
        if( el ) {
            el.remove();
        }
    }

    // chat GPT 2024-06-22
    public static applyOffset( styleLeft, styleTop, offsetX, offsetY ) {
        // Parse the current left and top values to get the numeric values
        let currentLeft = parseInt(styleLeft, 10);
        let currentTop = parseInt(styleTop, 10);
    
        // Apply the offsets
        let newLeft = currentLeft + offsetX;
        let newTop = currentTop + offsetY;
    
        // Return the new left and top style strings
        return {
            left: `${newLeft}px`,
            top: `${newTop}px`
        };
    }
}