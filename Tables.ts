namespace ElevenDotJs {
    export class Tables {
        public static generate( rowCount, columnCount, cellData: Object, cellStyle?: string ): Object {
            const ret = { "table": {} };
            for( let row = 0; row < rowCount; row++ ) {
                if( !ret.table[ "tr" ] ) {
                    ret.table [ "tr" ] = [];
                }
                ret.table [ "tr" ].push( [] );
                for( let col = 0; col < columnCount; col++ ) {
                    if( !ret.table[ "tr" ][ row ].td ) {
                        ret.table[ "tr" ][ row ].td = [];
                    }
                    ret.table[ "tr" ][ row ].td.push( {} );
                    if( cellData ) {
                        ret.table[ "tr" ][ row ].td[ col ] = cellData;
                    }
                    if( cellStyle ) {
                        ret.table[ "tr" ][ row ].td[ col ].style = cellStyle;
                    }
                }
            }
            return ret;
        }

        public static demo() {
            //const ui = Tables.generate( 4, 3, { "text": "demo" } );
            const ui = Tables.generate( 
                10, 
                8, 
                { "img": { "src": "http://www.shmetaverse.org/images/close.png" } },
                "padding: 24px; background-color: gray;"
            );
            DocComposer.compose( ui, document.body );
        }
    }
}
