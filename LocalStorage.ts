namespace _11dotjs {
    export class LocalStorage {
        public static lsGlobal = "lsGlobal";
        public static read( key: string ): Object {
            let json = window.localStorage.getItem( key );
            let ret: Object = JSON.parse( json );
            return ret;
        }
        public static readGlobal(): Object {
            return this.read( LocalStorage.lsGlobal );
        }
        public static write( key: string, o: Object ) {
            let json = JSON.stringify( o );
            window.localStorage.setItem( key, json );
        }
        public static writeGlobal( o: Object ) {
            this.write( LocalStorage.lsGlobal, o );
        }
        public static registerInstance() {
            let reset = 0;
            if( reset == 1 ) { // break here and set reset to 1 clear the SharedInstanceInfo
                LocalStorage.writeGlobal( null );
            }
            let sii = LocalStorage.readGlobal() as SharedInstanceInfo;
            if( !sii ) {
                sii = new SharedInstanceInfo();
            }
            let tabId = LocalStorage.browserTabId();
            if( !sii.tabIdSet ) {
                sii[ "tabIdSet"] = {};
            }
            if( !sii.tabIdSet[ tabId ] ) {
                console.log( `Adding tab ${tabId}` );
                sii.tabIdSet[ tabId ] = {};
                LocalStorage.writeGlobal( sii );
            } else {
                console.log( `tab ${tabId} already registered` );
            }
            LocalStorage.logTabIdSet();
            window.addEventListener( 'beforeunload', ( ev ) => {
                let sii = LocalStorage.readGlobal() as SharedInstanceInfo;
                if( sii.tabIdSet[ tabId ] ) {
                    console.log( `Deleting tab ${tabId}` );
                    delete sii.tabIdSet[ tabId ];
                    LocalStorage.writeGlobal( sii );
                } else {
                    console.log( `tab ${tabId} not found` );
                }
                LocalStorage.logTabIdSet();
                //ev.preventDefault();
                //return "beforeunload";
                return null;
            } );
        }
        static logTabIdSet() {
            let sii = LocalStorage.readGlobal() as SharedInstanceInfo;
            if( sii ) {
                let ts = '';
                let delim = '';
                for( let id in sii.tabIdSet ) {
                    ts += delim + id;
                    delim = ', ';
                }
                console.log( ts );
            } else {
                console.log( 'No Shared Instance Info exists.' );
            }
        }
        public static getTabCount() {
            let sii = LocalStorage.readGlobal() as SharedInstanceInfo;
            let o = Object.keys( sii.tabIdSet );
            let ret = o.length;
            return ret;
        }

        private static browserTabId() {
            if ( !sessionStorage.getItem( 'tabId' ) ) {
                const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2, 9);
                sessionStorage.setItem( 'tabId', uniqueId );
            }
            let ret = sessionStorage.getItem( 'tabId' );
            return ret;
        }

        
    }

    //
    // Object to be shared by all 11dotjs browser tabs
    //
    export class SharedInstanceInfo {
        public tabIdSet: Object;
    }
}