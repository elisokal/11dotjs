namespace ElevenDotJs {
    export const defaultFont = "consolas";
    export enum DialogPosition {
        center = 1
    }
    export class DialogConfig {
        modal: boolean;
        parent: Node;
        title: string;
        dialogId: string;
        clientAreaId: string;
        position: DialogPosition;
        constructor( modal: boolean, parent: Node, title: string, dialogId: string, clientAreaId: string, position: DialogPosition ) {
            this.modal = modal;
            this.parent = parent;
            this.title = title;
            this.dialogId = dialogId;
            this.clientAreaId = clientAreaId;
            this.position = position;		
        }
    }
    export class Dialog {
        private dragStart = null;
        private config: DialogConfig;

        // This works around an issue with two dialogs sharing the drop area. The
        // dragover and drop event fire for all dialogs when user drags one of them.
        private static draggingDialog: Dialog;

        constructor( config: DialogConfig ) {
            this.config = config;
            this.createUi();
        }

        public createUi(): Node {
            const zIndex: number = 999;
            let ui = {
                "div": {
                    "id": this.config.dialogId,
                    "style": `position: fixed; left: 5em; top: 5em; border:0.1em solid RGB(88,88,88); border-radius: 0.5em; z-index: ${zIndex}; `
                    + "min-width: 8em; min-height: 8em; background-color: white; padding:0",
                    "table" : {
                        //"style": "width: 100%",
                        "tbody": {
                            "tr" : [
                                {
                                    "td": [
                                        {
                                            "text": this.config.title,
                                            "style": `
                                                border:0.1em solid RGB(88,88,88); 
                                                border-radius: 0.5em; 
                                                text-align: center; 
                                                font-family: ${ElevenDotJs.defaultFont}; 
                                                font-size: 1.2em;
                                                cursor: move;
                                                background-color: RGB(228,254,250)`,
                                            "draggable": true,
                                            "id" : this.config.dialogId+"-titleBar"
                                        },
                                        {
                                            "text": "\u00D7",
                                            "style": "text-align: right; width:1em; cursor: pointer; font-size:1.5em",
                                            "onclick": `ElevenDotJs.Dialog.close('${this.config.dialogId}');`,
                                            "title" : "close me",
                                            "id": this.idOfCloseIcon()
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
            let ret: Node = null;
            if( this.config.modal ) {
                // add the overlay to block user interaction with all page content
                // except for our dialog
                let overlay = {
                    "div": {
                        "id": this.config.dialogId + "_overlay",
                        "style": `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: ${zIndex-1};`
                   }
                };
                let overlayNode = DocComposer.compose( overlay, this.config.parent );
                ret = DocComposer.compose( ui, overlayNode );
            } else {
                ret = DocComposer.compose( ui, this.config.parent );
            }

            this.configureDragDrop( ret as HTMLElement, document.getElementById( this.config.dialogId+"-titleBar") );
            return ret;
        }
        public idOfCloseIcon() {
            return `${this.config.dialogId}_close_icon`;
        }
        public closeIcon() {
            return document.getElementById( this.idOfCloseIcon() );
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

        private configureDragDrop( dialog: HTMLElement, titleBar: HTMLElement ) {
            if( dialog ) {
                let dropArea = dialog.parentNode;
                if( dropArea ) {
                    titleBar.addEventListener( "dragstart", function (ev) {
                        let de: DragEvent = ev as DragEvent;
                        let me: MouseEvent = ev as MouseEvent;
                        this.dragStart = [ me.clientX, me.clientY ];
                        de.dataTransfer.setData("text/plain", "What a drag.");
                        console.log( "Drag Start for " + ( dialog as HTMLElement ).getAttribute("id") );
                        Dialog.draggingDialog = this;
                    }.bind(this));
                    // Add drop events to the dropArea (body)
                    dropArea.addEventListener( 'dragover', function (ev) {
                        ev.preventDefault(); // allow dropping
                        //console.log( "Dragging " + ( dialog as HTMLElement ).getAttribute("id") );
                    }.bind(this));				
                    dropArea.addEventListener( "drop", function (ev) {
                        if( this == Dialog.draggingDialog ) {
                            let me: MouseEvent = ev as MouseEvent;
                            let offset = [ me.clientX - this.dragStart[0], me.clientY - this.dragStart[1] ];
                            this.dragStart = [ this.dragStart[0] + offset[0], this.dragStart[1] + offset[1] ];
                            let droppedElement = dialog as HTMLElement;
                            let newCss = Dialog.applyOffset( droppedElement.style.left, droppedElement.style.top, offset[0], offset[1] );
                            droppedElement.style.left = newCss.left;
                            droppedElement.style.top = newCss.top;
                            console.log( "Drop " + ( dialog as HTMLElement ).getAttribute("id") );
                        } else {
                            console.log( "Ignore drop of " + titleBar.id );
                        }
                    }.bind(this));
                }
            }
        }

        public static close( dialogId: string ) {
            NodeUtil.detachElement( dialogId );
            NodeUtil.detachElement( dialogId + "_overlay" );
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

}