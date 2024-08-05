namespace ElevenDotJs {
    export class Demo {
        static componentId = "11dotjsDemo" ;
        //
        // This is a Demonstration of using 11dotjs to make a demonstration of 11dotjs!
        //
        public static demo() {
            // Get the code of this demo to show in the center pane.
            const self: string = Demo.toString();
            const body = document.body;
            DocComposer.compose( Demo.layoutTable(), body );

            // Reconfigure the top row
            let td00: any = Tables.getCellElement( Demo.componentId, 0, 0 );
            td00.colSpan = 3;
            td00.nextSibling.remove();
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

            // Reconfigure the bottom row
            let td20: any = Tables.getCellElement( Demo.componentId, 2, 0 );
            td20.colSpan = 3;
            td20.nextSibling.remove();
            td20.nextSibling.remove();

            // Create the code panel
            let tdCode: any = Tables.getCellElement( Demo.componentId, 1, 1 );
            tdCode.style.border = null;
            tdCode.style.padding = null;
            tdCode.innerHTML = null;
            // Use a div for best scrolling UX
            DocComposer.compose( { 
                "div" : {
                    "style": "overflow: scroll; height: 40em; width: 80em; font: 0.9em consolas; padding: 2em;"
                }
            }, tdCode );
            let divCode = tdCode.firstChild;
            divCode.style.whiteSpace = "pre";
            divCode.innerHTML = self;
            // Insert demo description in left-hand panel
            let td10: any = Tables.getCellElement( Demo.componentId, 1, 0 );
            DocComposer.compose( { 
                "h3": {
                    "text": "11dotjs is HTML5 without HTML."
                },
                "p": {
                    "text": "11dotjs (pronounced like 'eleven.js') is an open-source TypeScript / JavaScript project. It's not a framework, or API, and it's not opinionated. 11dotjs is independent of all web-authoring frameworks, so you can use it with or without any of them. Its only dependencies are the TypeScript compiler and your browser."
                },
                "h4": {
                    "text": "Goals"
                },
                "ul": {
                    "li": [
                        { "text": "Share free, lightweight, ready-to-use web components with the masses." },
                        { "text": "Promote a web-authoring model based on Objects instead of HTML." }
                    ]
                },
                "a": {
                    "href": "https://github.com/elisokal/11dotjs",
                    "text": "See Us On GitHub"
                }
            }, td10 );


            // Insert a video into the right-hand panel
            let td12: any = Tables.getCellElement( Demo.componentId, 1, 2 );
            DocComposer.compose( { 
                "div" : { 
                    "style": "width:14em; overflow:hidden",
                    "video" : {
                        "type": "video/webm",
                        "autoplay": true,
                        "loop": true,
                        "muted": true,
                        "style": "height: 12em",
                        "source": {
                            "src": "http://shmeta.me/welcome_video.mp4",
                            "type": "video/webm"
                        },
                        "text": "Sorry! Your browser does not support the video element"
                    }
                }
            }, td12 );

            // Insert links to more demos in the bottom panel
            DocComposer.compose( { 
                "table" : { 
                    "tr": {
                        "td": [
                            { "text": "More Demos" },
                            { "a": { "text": "Intuitive Color Palette", "onclick": "ElevenDotJs.Demo.colorPaletteDemo(); return false;", "href": "#" } }
                        ]
                    }
                }
            }, td20 );            

            // Center the layout table
            let table = NodeUtil.firstParent( td00, "TABLE" );
            if( table ) {
                let tEl = table as HTMLElement;
                tEl.style.margin = "auto";
            }

            // Create a dark mood
            body.style.backgroundColor = "black";
        }

        static layoutTable(): Object {
            const ret = Tables.generate( {
                "componentId": Demo.componentId,
                "hasHeader": false,
                "rowCount": 3, 
                "columnCount": 3, 
                "cellContent": [ [ {  } ] ],
                "cellStyle": [ [ "padding: 2em; background-color: RGB(11,11,11); border: 1em solid RGB(0,80,0); border-radius: 2em; color: RGB(180, 180, 180); font-family: Inter; vertical-align: top"  ] ]
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