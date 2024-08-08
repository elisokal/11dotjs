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
            body.style.fontFamily = "Inter";
            DocComposer.compose( Demo.layoutTable(), body );

            // Reconfigure the top row
            let td00: any = Tables.getCellElement( Demo.componentId, 0, 0 );
            td00.colSpan = 2;
            td00.nextSibling.remove();
            DocComposer.compose( 
                {
                    "head": {
                        "link": [
                            {
                                "href": "https://fonts.googleapis.com/css2?family=Inter&display=swap",
                                "rel": "stylesheet"
                            },
                            {
                                "href": "https://fonts.googleapis.com/css2?family=Roboto Mono&display=swap",
                                "rel": "stylesheet"
                            }
                        ] 
                    },
                    "table": {
                        "style": "width: 100%",
                        "tr": {
                            "td": {
                                "div": {
                                    "style": "font-size: 2.5em; text-align:center;",
                                    "text" : "D E M O * 11dotjs"
                                }
                            }
                        },
                        "tr_2": {
                            "td": {
                                "div": {
                                    "style": "font-size: 1.25em; text-align:center;",
                                    "text" : "You => JSON => DocComposer => Document"
                                }
                            }
                        }
                    }
                },
                td00 
            );

            // Create the code panel
            let tdCode: any = Tables.getCellElement( Demo.componentId, 1, 0 );
            tdCode.innerHTML = null;
            // Use a div for best scrolling UX
            DocComposer.compose( { 
                "label": {
                    "text": "Show the HTML",
                    "input": {
                        "id": Demo.idOfShowHtmlCheckBox(),
                        "type": "checkbox",
                        "onchange": "ElevenDotJs.Demo.onChangeShowHtml( event )"
                    }
                },
                "br": null,
                "textarea" : {
                    "id": Demo.componentId + "_textArea",
                    "style": "margin-top: 0.5em; color: RGB(180, 180, 180); background-color: RGB(11,11,11);overflow-x: auto; white-space: nowrap; font-family: Roboto Mono; font-size: small",
                    "rows": 40,
                    "cols": 80,
                    "spellcheck": false,
                    "text": Demo.defaultGuiJson(),
                    "oninput": "ElevenDotJs.Demo.renderPreview( event )"
                }
            }, tdCode );
            
            Demo.taCode = Demo.textArea();

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
        
        static idOfShowHtmlCheckBox(): string {
            return Demo.componentId + "_cbHtml";
        }
       
        static showHtmlCheckBox(): HTMLInputElement {
            return document.getElementById( Demo.idOfShowHtmlCheckBox() ) as HTMLInputElement;
        }

        private static textArea(): HTMLInputElement {
            return document.getElementById( Demo.componentId + "_textArea" ) as HTMLInputElement;
        }
        
        public static renderPreview( event ) {
            // Preview the GUI in the right-hand panel
            let tdPv: any = Tables.getCellElement( Demo.componentId, 1, 1 );
            tdPv.innerHTML = null;

            let json: string = ( event ) ? event.target.value : Demo.taCode.innerHTML;
            let o = JSON.parse( json );

            DocComposer.compose( o, tdPv );
        }

        public static onChangeShowHtml( event ) {
            if( event.target.checked ) {
                Demo.showHtml();
            } else {
                Demo.hideHtml();
            }
        }

        static hideHtml() {
            NodeUtil.detachElement( Demo.idOfHtmlDialog() );
        }

        private static showHtml() {
            let ta = Demo.textArea();
            let json: string = ta.value;
            let o = JSON.parse(json);
            let doc = DocComposer.compose(o, null) as any;
            let html = doc.outerHTML; // not formatted )`.

            //alert(html);
            let clientAreaId = this.componentId + "_dialogClientArea";
            let dialog = new Dialog({
                "modal": false,
                "parent": document.body,
                "title": "HTML",
                "dialogId": Demo.idOfHtmlDialog(),
                "clientAreaId": clientAreaId,
                "position": DialogPosition.center
            });
            let parent = document.getElementById(clientAreaId);
            DocComposer.compose({
                "div": {
                    "style": `
                            max-width: 30em; 
                            overflow: auto; 
                            font-family: Roboto Mono; 
                            font-size: small`,
                    "text": html
                }
            }, parent);
            dialog.setPosition();

            let closeIcon = dialog.closeIcon();
            if( closeIcon ) {
                closeIcon.addEventListener( "click", ()=>{ this.showHtmlCheckBox().checked = false; } );
            }
        }
        static idOfHtmlDialog(): string {
            return this.componentId + "_theHtml";
        }
        private static htmlDialog(): HTMLElement {
            return document.getElementById( Demo.idOfHtmlDialog() ) as HTMLElement;
        }
        private static defaultGuiJson(): string {
            let o = { 
                "head": {
                    "link": [
                        {
                            "href": "https://fonts.googleapis.com/css2?family=Inter&display=swap",
                            "rel": "stylesheet"
                        },
                        {
                            "href": "https://fonts.googleapis.com/css2?family=Roboto Mono&display=swap",
                            "rel": "stylesheet"
                        }
                    ] 
                },
                "div" : {
                    "style": "width: 40em; font-family: Inter; ",
                    "p": {
                        "text": `Welcome. You are looking at a demonstration of the 11dotjs DocComposer class. It provides a web-authoring model 
                        based on JavaScript objects in place of HTML. When you edit the code in the left-hand panel, this preview will update.`
                    },
                    "iframe": {
                        "width": 640,
                        "height": 360,
                        "src": "https://www.youtube.com/embed/ZrcVIwgysBE?si=HAlOtYElcWcMyB1f",
                        "title": "YouTube video player",
                        "frameborder": 0,
                        "allow": "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                        "referrerpolicy": "strict-origin-when-cross-origin",
                        "allowfullscreen": true
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
                "cellStyle": [ [ "padding: 2em; background-color: RGB(11,11,11); border: 0.7em solid RGB(44,44,44); border-radius: 2em; color: RGB(180, 180, 180); vertical-align: top"  ] ]
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