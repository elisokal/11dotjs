namespace _11dotjs {

    export class TableConfig {
        rowCount: number;
        columnCount: number;
        componentId?: string;
        cellContent?: any[][];
        cellStyle?: any[][];
        columnStyle?: any[];
        rowStyle?: any[];
        hasHeader?: boolean = true;
    }
    export class Tables {
        public static defaultComponentId = "_11dotjs.Tables";
        public static generate( config: TableConfig ): Object {
            const componentId = ( config.componentId ) ? config.componentId : Tables.defaultComponentId;
            const tbody = {};
            const ret:any = { "table": { "id": componentId, "tbody": tbody } };
            let thead = null;
            if( config.hasHeader ) {
                thead = {};
                ret.table.thead = thead;
            }

            for( let row = 0; row < config.rowCount; row++ ) {
                let target = ( row == 0 && config.hasHeader ) ? thead : tbody;
                if( !target.tr ) {
                    target.tr = [];
                }
                target.tr.push( [] );
                for( let col = 0; col < config.columnCount; col++ ) {
                    if( !target.tr[ row ].td ) {
                        target.tr[ row ].td = [];
                        target.tr[ row ].id = Tables.getRowElementId( componentId, row );
                    }
                    target.tr[ row ].td.push( {} );
                    target.tr[ row ].td[ col ] = Tables.lenient( config.cellContent, row, col );
                    target.tr[ row ].td[ col ].style = Tables.lenient( config.cellStyle, row, col );
                    target.tr[ row ].td[ col ].id = Tables.getCellElementId( componentId, row, col );
                }
            }
            return ret;
        }

        public static getRowElement( componentId: string, row: number ) {
            return document.getElementById( Tables.getRowElementId( componentId, row ) );
        }
        public static getRowElementId( componentId: string, row: number ) {
            return componentId + `_tr${row}`;
        }
        public static getCellElement( componentId: string, row: number, col: number ) {
            return document.getElementById( Tables.getCellElementId( componentId, row, col ) );
        }
        public static getCellElementId( componentId: string, row: number, col: number ) {
            return componentId + `_td${row}-${col}`;
        }

        // Lenient array access. Return what's there, or null
        private static lenient( cellContent: any[][], row: number, col: number ) {
            let ret = {};
            if( cellContent && cellContent.length > 0 ) {
                let rowCount = cellContent.length;
                let rowIndex = Math.min( rowCount-1, row );
                let columnCount = cellContent[ rowIndex ].length;
                let columnIndex = Math.min( columnCount-1, col );
                // If we do not clone here, table cells might share content inappropriately
                ret = structuredClone( cellContent[ rowIndex ][ columnIndex ] );
            }
            return ret;
        }

        public static demo( parent: HTMLElement, rowCount?: number, colCount?: number ) {
            
            parent.style.backgroundColor = "black";
            
            const componentId = "tables_demo";
            const ui = Tables.generate( {
                "componentId": componentId,
                "hasHeader": false,
                "rowCount": ( rowCount ) ? rowCount: 10, 
                "columnCount": ( colCount ) ? colCount : 12, 
                "cellContent": [ [ { "img": { "src": "http://elisokal.com/imageLib/11dotjs/ball.png", "style": "width: 64px" } } ] ],
                //"cellStyle": [ [ "padding: 24px; background-color: RGB(242,251,50);" ] ]
                "cellStyle": [ [ "padding: 24px; background-color: RGB(0,0,0);" ] ]
            } );
            DocComposer.compose( ui, parent );

            // Retrieve a cell
            let el = Tables.getCellElement( componentId, 0, 0 ) as HTMLElement;
            //el.style.setProperty("background-color", "red" );
            // now manipulate the table itself
            let table = NodeUtil.firstParent( el, "TABLE" );
            if( table ) {
                let tEl = table as HTMLElement;
                tEl.style.margin = "auto";
                let angle = 45;
                let increment = 1;
                let css = `rotate(${angle}deg)`;
                tEl.style.transform = css;
                let stop = 1;
                if( true ) {
                    Animation.byDuration( ( timestamp: DOMHighResTimeStamp )=>{
                        angle += increment;
                        css = `rotate3d(1,1,1,${angle}deg)`;
                        tEl.style.transform = css;
                    }, 30000, 60 );
                }
                if( false ) {
                    Animation.byIterations( ( timestamp: DOMHighResTimeStamp )=>{
                        angle += increment;
                        css = `rotate(${angle}deg)`;
                        tEl.style.transform = css;
                    }, 150, 30 );
                }
            }
        }
    }
}
