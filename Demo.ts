namespace ElevenDotJs {
    export class Demo {
        static componentId = "11dotjsDemo";
        static taCode;
        //
        // This is a Demonstration of using 11dotjs to make a demonstration of 11dotjs!
        //
        public static demo() {
            // Get the code of this demo to show in the center pane.
            const body = document.body;
            DocComposer.compose( Demo.layoutTable(), body );

            // Reconfigure the top row
            let td00: any = Tables.getCellElement( Demo.componentId, 0, 0 );
            td00.colSpan = 2;
            td00.nextSibling.remove();
            DocComposer.compose( 
                {
                    "div": {
                        "style": "font-size: 2.5em; text-align:center;",
                        "text" : "11dotjs D E M O"
                    }
                },
                td00 
            );

            // Create the code panel
            let tdCode: any = Tables.getCellElement( Demo.componentId, 1, 0 );
            //tdCode.style.border = null;
            //tdCode.style.padding = null;
            tdCode.innerHTML = null;
            // Use a div for best scrolling UX
            DocComposer.compose( { 
                "textarea" : {
                    "id": Demo.componentId + "_textArea",
                    "style": "color: RGB(180, 180, 180); background-color: RGB(11,11,11);",
                    "rows": 40,
                    "cols": 80,
                    "spellcheck": false,
                    "text": Demo.defaultGuiJson(),
                    "oninput": "ElevenDotJs.Demo.renderPreview( event )"
                }
            }, tdCode );
            
            Demo.taCode = document.getElementById( Demo.componentId + "_textArea" );

            Demo.renderPreview( null );

            // Center the layout table
            let table = NodeUtil.firstParent( td00, "TABLE" );
            if( table ) {
                let tEl = table as HTMLElement;
                tEl.style.margin = "auto";
            }

            // Create a dark mood
            body.style.backgroundColor = "black";
        }
        public static renderPreview( event ) {
            // Preview the GUI in the right-hand panel
            let tdPv: any = Tables.getCellElement( Demo.componentId, 1, 1 );
            tdPv.innerHTML = null;

            let json: string = ( event ) ? event.target.value : Demo.taCode.innerHTML;
            let o = JSON.parse( json );

            DocComposer.compose( o, tdPv );
        }

        private static defaultGuiJson(): string {
            let o = { 
                "div" : { 
                    "style": "width:14em; overflow:hidden",
                    "video" : {
                        "type": "video/webm",
                        "autoplay": true,
                        "loop": true,
                        "muted": true,
                        "style": "height: 20em",
                        "source": {
                            "src": "http://shmeta.me/welcome_video.mp4",
                            "type": "video/webm"
                        },
                        "text": "Sorry! Your browser does not support the video element"
                    }
                }
            };
            let ret = JSON.stringify( o, null, 4 );
            return ret;
        }

        static layoutTable(): Object {
            const ret = Tables.generate( {
                "componentId": Demo.componentId,
                "hasHeader": false,
                "rowCount": 2, 
                "columnCount": 2, 
                "cellContent": [ [ {  } ] ],
                "cellStyle": [ [ "padding: 2em; background-color: RGB(11,11,11); border: 0.7em solid RGB(44,44,44); border-radius: 2em; color: RGB(180, 180, 180); font-family: Inter; vertical-align: top"  ] ]
            } );
            return ret;
        }

        public static colorPaletteDemo() {
            new ElevenDotJs.ColorPalette( new RGB(0,0,160), ( color ) => { 
                //document.body.style.backgroundColor = color.css;
                let table: HTMLTableElement = NodeUtil.firstParent( Tables.getCellElement( Demo.componentId, 0, 0 ), "TABLE" ) as HTMLTableElement;
                for( let td of Array.from( table.querySelectorAll( "td" ) ) ) {
                    if( td.id ) {
                        td.style.border = `1em solid ${color.css}`
                    }
                }
            }, 'colorPalette1' );
        }
    }
}