namespace _11dotjs {
    export class Demo {
        static componentId = "11dotjsDemo";
        static taCode: HTMLTextAreaElement;
        static downloadFileName = 'DocComposerDemo.json';
        static rgbOkIndicator = "RGB(11,121,11)";
        static rgbErrorIndicator = "RGB(176,11,11)";
        static lastValidJson: string;
        //
        // This is a Demonstration of using 11dotjs to make a demonstration of 11dotjs!
        //
        public static demo() {
            Config.uponLoad();
            LocalStorage.registerInstance();
            const body = document.body;
            body.style.fontFamily = "Inter";
            // Create a dark mood
            body.style.backgroundColor = "black";


            if( !Demo.checkChannel () ) {
                Demo.composerDemo();
            }

            Demo.renderMainIndicators( Demo.channel(), LocalStorage.getTabCount() );
        }

        public static composerDemo() {
            
            // Get the code of this demo to show in the center pane.
            const body = document.body;
            DocComposer.compose( Demo.layoutTable(), body );

            // Reconfigure the top row
            let td00: any = Tables.getCellElement( Demo.componentId, 0, 0 );
            td00.colSpan = 2;
            td00.nextSibling.remove();
            DocComposer.compose( 
                {
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
                                    "text" : "Author => JSON.parse => DocComposer => Document"
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
            tdCode.style.width = "40%";
            DocComposer.compose( { 
                "textarea" : {
                    "id": Demo.idOfTextArea(),
                    "style": `margin-top: 0.5em; color: RGB(180, 180, 180); background-color: RGB(11,11,11);overflow-x: auto; 
                    white-space: nowrap; font-family: Roboto Mono; font-size: small; width:auto`,
                    "rows": 30,
                    "cols": 96,
                    "spellcheck": false,
                    "text": Demo.defaultGuiJson(),
                    "oninput": "_11dotjs.Demo.renderPreview( event )"
                },
                "br": null,
                "div": {
                    "style": "margin-top: 0.5em",
                    "label": {
                        "input": {
                            "id": Demo.idOfShowHtmlCheckBox(),
                            "type": "checkbox",
                            "onchange": "_11dotjs.Demo.onChangeShowHtml( event )"
                        },
                        "text": "Show the HTML"
                    },
                    "span": {
                        "style": "margin-left: 1.5em",
                        "text": "JSON.parse",
                        "id": Demo.idOfParseIndicator(),
                    },
                    "span_2": {
                        "style": "margin-left: 1.5em",
                        "text": "DocComposer",
                        "id": Demo.idOfComposerIndicator(),
                    },

                    "a": {
                        "text": "Download this JSON",
                        "style": "margin-left: 1.5em",
                        "href": "#",
                        "onclick": `_11dotjs.ObjectStorage.downloadJson(
                            _11dotjs.Demo.textArea().value, 
                            '${Demo.downloadFileName}'
                        );`
                    }
                }
            }, tdCode );
            
            Demo.taCode = Demo.textArea();
            Demo.configureTextAreaForTabInsertion( Demo.taCode );

            Demo.renderPreview( null );

            // Center the layout table
            let table = NodeUtil.firstParent( td00, "TABLE" );
            if( table ) {
                let tEl = table as HTMLElement;
                tEl.style.margin = "auto";
                tEl.style.width = "96%";
            }
        }
        static idOfParseIndicator() {
            return Demo.componentId + "_parseIndicator";
        }
        static idOfComposerIndicator(): string {
            return Demo.componentId + "_composerIndicator";
        }
        static parseIndicator(): HTMLSpanElement {
            return document.getElementById( Demo.idOfParseIndicator() );
        }
        static composerIndicator() {
            return document.getElementById( Demo.idOfComposerIndicator() );
        }        

        static idOfShowHtmlCheckBox(): string {
            return Demo.componentId + "_cbHtml";
        }
       
        static showHtmlCheckBox(): HTMLInputElement {
            return document.getElementById( Demo.idOfShowHtmlCheckBox() ) as HTMLInputElement;
        }

        private static textArea(): HTMLTextAreaElement {
            let ret = document.getElementById( Demo.idOfTextArea() ) as HTMLTextAreaElement;
            return ret;
        }
        public static idOfTextArea(): string {
            let ret = `${Demo.componentId}_textArea`;
            return ret; 
        }
        
        public static renderPreview( event ) {
            // Preview the GUI in the right-hand panel

            let json: string = ( event ) ? event.target.value : Demo.taCode.value;
            if( json == Demo.lastValidJson ) {
                // OPTIMIZATION
                Demo.showParseError( false, null );
                return;
            }

            let o = null;
            try {
                o = JSON.parse( json );
            } catch( msg ) {
                Demo.showParseError( true, msg.toString() );
                return;
            }
            Demo.showParseError( false, null );

            let n: Node = null;
            try {
                n = DocComposer.compose( o, null );
            } catch( msg ) {
                Demo.showDocComposerError( true, msg );
                return;
            }
            let tdPv: any = Demo.previewElement();
            tdPv.innerHTML = null;
            tdPv.appendChild( n );
            Demo.showDocComposerError( false, null );
            Demo.lastValidJson = json;
        }
        public static previewElement(): HTMLElement {
            return Tables.getCellElement( Demo.componentId, 1, 1 );
        }

        static showDocComposerError( composeFailure: boolean, msg: string ) {
            let span =  Demo.composerIndicator();
            if( composeFailure ) {
                span.style.color = Demo.rgbErrorIndicator;
                span.innerHTML = `DocComposer: ${msg}`;
            } else {
                span.style.color = Demo.rgbOkIndicator;
                span.innerHTML = `DocComposer`;
            }
        }

        static showParseError( parseFailure: boolean, msg: any ) {
            let span =  Demo.parseIndicator();
            if( parseFailure ) {
                span.style.color = Demo.rgbErrorIndicator;
                span.innerHTML = `JSON.parse: ${msg}`;
                // This makes it impossible to type in there
                //Demo.highlightJsonError( Demo.textArea(), msg );
            } else {
                span.style.color = Demo.rgbOkIndicator;
                span.innerHTML = `JSON.parse`;
            }            
            span.style.color = ( parseFailure ) ? Demo.rgbErrorIndicator : Demo.rgbOkIndicator;
        }

        // gpt but fixed by me. GPT had an off-by-one error, lol, and the scroll piece did not work
        static highlightJsonError( textarea, msg ) {
            const jsonText = textarea.value;
            const match = msg.match(/position (\d+)/);
            if (match) {
                const position = parseInt(match[1], 10);
                
                // Convert position to line and column
                const lines = jsonText.substring(0, position).split("\n");
                const lineNumber = lines.length;
                const columnNumber = lines[lines.length - 1].length + 1;
    
                // Move cursor to the error position
                textarea.focus();
                textarea.setSelectionRange(position, position+1);
            }
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
                    "text": html,
                    "id": this.componentId + "_divHtml"
                },
                "button": {
                    "style": "margin-top: 0.5em; float: right",
                    "text": "Select All",
                    "onclick": `_11dotjs.Demo.selectText( '${this.componentId}_divHtml' );`
                }
            }, parent);
            dialog.setPosition();

            let closeIcon = dialog.closeIcon();
            if( closeIcon ) {
                closeIcon.addEventListener( "click", ()=>{ this.showHtmlCheckBox().checked = false; } );
            }
        }
        static selectText( id: string ) {
            let div = document.getElementById( id );
            if( div ) {
                // Create a Range object
                const range = document.createRange();
                // Select the text inside the <div>
                range.selectNodeContents(div);
                // Clear any existing selections
                const selection = window.getSelection();
                selection.removeAllRanges();
                // Add the newly created range to the selection
                selection.addRange(range);
            }
        }
        static idOfHtmlDialog(): string {
            return this.componentId + "_theHtml";
        }
        private static htmlDialog(): HTMLElement {
            return document.getElementById( Demo.idOfHtmlDialog() ) as HTMLElement;
        }
        private static defaultGuiJson(): string {
            let ret = `{
    "div": {
        "style": "width: 40em; font-family: Inter; ",
        "p": {
            "text": "Welcome. You are looking at a demonstration of the 11dotjs DocComposer class. It provides a web-authoring model based on JavaScript objects in place of HTML. When you edit the code in the left-hand panel, this preview will update."
        },
        "iframe": {
            "src": "https://www.youtube.com/embed/ZrcVIwgysBE",
            "width": 374,
            "height": 210,
            "title": "YouTube video player",
            "frameborder": 0,
            "allow": "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            "referrerpolicy": "strict-origin-when-cross-origin",
            "allowfullscreen": true
        },
        "br": null, "br_": null,
        "text": "more demos: ",
        "a": {
            "text": "Intuitive Color Palette",
            "href": "#",
            "onclick": "_11dotjs.Demo.colorPaletteDemo();"
        },
        "span": { "text": " . " },
        "a_2": {
            "text": "Tables",
            "href": "#",
            "onclick": "_11dotjs.Demo.tablesDemo();"
        },
        "span_2": { "text": " . " },
        "a_3": {
            "text": "Modal Dialog",
            "href": "#",
            "onclick": "_11dotjs.Demo.modalDialogDemo();"
        },
        "span_3": { "text": " . " },
        "a_4": {
            "text": "WebGL",
            "href": "#",
            "onclick": "_11dotjs.WebGL.demo();"
        },
        "br_2": null, "br_3": null,
        "text_2": "links: ",
        "a_9": {
            "text": "11dotjs on GitHub",
            "href": "https://github.com/elisokal/11dotjs"
        }
    }
}`
            //let ret = JSON.stringify( o, null, 4 );
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
            Demo.colorPalette( "colorPaletteDemo", false );
        }
       
        public static modalDialogDemo() {
            Demo.colorPalette( "modalDialogDemo", true );
        }

        public static colorPalette( id:string, modal: boolean ) {
            new _11dotjs.ColorPalette( Demo.currentBorderColor(), ( color ) => { 
                let table: HTMLTableElement = NodeUtil.firstParent( Tables.getCellElement( Demo.componentId, 0, 0 ), "TABLE" ) as HTMLTableElement;
                for( let td of Array.from( table.querySelectorAll( "td" ) ) ) {
                    if( td.id ) {
                        td.style.border = `0.7em solid ${color.css}`
                    }
                }
            }, id, modal );
        }

        private static currentBorderColor(): RGB {
            let td = NodeUtil.firstParent( Demo.textArea(), "TD" ) as HTMLElement
            let cssBorder = td.style.border;
            let cssColor = cssBorder.substring( cssBorder.toUpperCase().indexOf( "RGB" ) );
            let ret = RGB.fromCss( cssColor );
            return ret;
        }

        public static tablesDemo() {
            //let tdPv = Demo.previewElement();
            //tdPv.innerHTML = null;
            let clientAreaId = Demo.componentId + "_tableDemoClient";
            let dialog = new Dialog( { 
                "modal": false,
                "parent": document.body,
                "title": "11dotjs Tables",
                "dialogId": this.componentId + "_tableDemoDialog",
                "clientAreaId": clientAreaId,
                "position": DialogPosition.center
            });
            let client = document.getElementById( clientAreaId );
            _11dotjs.Tables.demo( client, 7, 7 );
            dialog.setPosition();
        }

        // gpt
        private static configureTextAreaForTabInsertion( textarea: HTMLTextAreaElement ) {
            textarea.style.tabSize = "4";
            textarea.addEventListener('keydown', function(event) {
                if (event.key === 'Tab') {
                    event.preventDefault();

                    // Get the current position of the cursor
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;

                    // Set the value with the tab inserted at the cursor's position
                    textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);

                    // Move the cursor to the position right after the inserted tab
                    textarea.selectionStart = textarea.selectionEnd = start + 1;
                }
            });        
        }

        private static channel(): string {
            let ret = new URL(location.href).searchParams.get( 'channel' );
            return ret;
            //return ( ret ) ? ret : 'zero';
        }
        private static checkChannel(): boolean {
            let ch = Demo.channel();
            if( ch ) {
                Demo.openChannel( ch );
                return true;
            }
            return false;
        }
        private static openChannel( ch: string ) {
            if( ch == 'sleep' ) {
                DocComposer.compose( 
                    {
                        "audio": {
                            "controls": true,
                            "src": 'http://www.elisokal.com/audio/GOE/2024-08-24.mp3',
                            "loop": 1,
                            "style": "width:50%; transform: scale(2.0); transform-origin: 0 0",
                        }            
                    },
                    document.body
                );
            } else if ( ch == 'music' ) {
                DocComposer.compose( 
                    {
                        "audio": {
                            "controls": true,
                            "src": 'http://www.elisokal.com/audio/Desert%20Dwellers/DJmixes/Live%20at%203hr%20Rocky%20Mountain%20Set%202020.mp3',
                            "loop": 1,
                            "style": "width:50%; transform: scale(2.0); transform-origin: 0 0",
                        }            
                    },
                    document.body
                );
            } else if ( ch == 'test' ) {
                DocComposer.testToJsml2();
                //DocComposer.testRef();
            }
        }

        private static renderMainIndicators( channel: string, instanceCount: number ) {
            let layoutTableId = "renderMainIndicators";
            let layoutTable: any = Tables.generate( { 
                "rowCount": 2, 
                "columnCount": 2 , 
                "componentId": layoutTableId,
                "cellStyle": [ [ "padding: 0.25em; border: 1px solid RGB(44,44,44); border-radius: 0.5em" ] ]
            } );
            DocComposer.compose( 
                {
                    "div": {
                        "style": "position: fixed; left: 0.5em; bottom: 0.5em; color: RGB(111,11,11); font-size: large",
                        "table": layoutTable.table
                    }            
                },
                document.body
            );
            let elTable = document.getElementById( layoutTableId );
            //elTable.style.borderCollapse = "collapse";
            Tables.getCellElement( layoutTableId, 0, 0 ).innerHTML = "Channel";
            Tables.getCellElement( layoutTableId, 0, 1 ).innerHTML = channel;
            Tables.getCellElement( layoutTableId, 1, 0 ).innerHTML = "Tabs Open";
            Tables.getCellElement( layoutTableId, 1, 1 ).innerHTML = `${instanceCount}`;
        }
    }
}


