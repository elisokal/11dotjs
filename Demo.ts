namespace ElevenDotJs {
    export class Demo {
        static componentId = "11dotjsDemo" ;
        public static demo() {
            const ui = Demo.ui();  
            const body = document.body;
            DocComposer.compose( ui, body );

            let td00: any = Tables.getCellElement( Demo.componentId, 0, 0 );
            td00.colSpan = 3;
            td00.nextSibling.remove();
            td00.nextSibling.remove();

            let td20: any = Tables.getCellElement( Demo.componentId, 2, 0 );
            td20.colSpan = 3;
            td20.nextSibling.remove();
            td20.nextSibling.remove();

            let tdCode: any = Tables.getCellElement( Demo.componentId, 1, 1 );
            tdCode.style.border = null;
            tdCode.innerHTML = null;
            // Add a div child be best UX scrolling
            DocComposer.compose( { 
                "div" : {
                    "style": "overflow: scroll; height: 40em; width: 80em;"
                }
            }, tdCode );
            let divCode = tdCode.firstChild;
            divCode.style.whiteSpace = "pre";
            divCode.innerHTML = Demo.toString();

            let table = NodeUtil.firstParent( td00, "TABLE" );
            if( table ) {
                let tEl = table as HTMLElement;
                tEl.style.margin = "auto";
            }

            body.style.backgroundColor = "black";
        }

        static ui(): Object {
            
            const ret = Tables.generate( {
                "componentId": Demo.componentId,
                "hasHeader": false,
                "rowCount": 3, 
                "columnCount": 3, 
                "cellContent": [ [ { "text": "test" } ] ],
                "cellStyle": [ [ "padding: 2em; background-color: RGB(11,11,11); border: 1em solid RGB(0,80,0); border-radius: 2em; color: RGB(180, 180, 180); font: 0.9em consolas;"  ] ]
            } );

            return ret;
        }
    }
}