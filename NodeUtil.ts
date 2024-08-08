namespace ElevenDotJs {
    export class NodeUtil {
        public static firstParent( node: Node, tagName: string ) {
            do {
                node = node.parentNode;
            } while( node != null && ( node as HTMLElement ).tagName != tagName );
            return node;
        }
        public static detachElement( id: string ) {
            let el = document.getElementById( id );
            if( el ) {
                el.remove();
            }
        }        
    }
}
