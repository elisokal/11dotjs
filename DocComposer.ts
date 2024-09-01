//
// 2024-06-16
// This class created by Eli Sokal
//
// DocComposer converts a JavaScript object graph to a browser document, 
// allowing web-page composition without HTML.
//

//
// Return value: If a parent node is passed in, we return the first child
// node that we appended to it. Otherwise, we return the whole wrapperNode.
//
namespace _11dotjs {
    export class DocComposer {
        private static docRoot: Node;
        public static compose( source: Object, parent: Node ): Node {
            // A wrapper is necessary because the source may not be rooted (IOW, it might be >1 object)
            const wrapperTag = "span";
            const wrapper = { source }; // Source must be rooted on a single-property object
            DocComposer.docRoot = document.createElement( wrapperTag );
            DocComposer.composer( source, wrapperTag, DocComposer.docRoot, 0 );
            let ret: Node = DocComposer.docRoot;
            if( parent ) {
                // Now we can drop the wrapper node and just copy its children to the parent
                ret = null;
                while( DocComposer.docRoot.childNodes.length > 0 ) {
                    let node = DocComposer.docRoot.childNodes[0];
                    if( !ret ) {
                        ret = node;
                    }
                    parent.appendChild( node );
                }
            }
            return ret;
        }

        private static composer( source: Object, parentKey: string, doc: Node, level: number ) {
            if( source ) {
                let t1 = DocComposer.docTrace( doc );
                let t2 = null;
                for( let [key, value] of Object.entries( source ) ) {
                    key = DocComposer.fixTagName( key );
                    switch( typeof value ) {
                    case "object":
                        if( !Array.isArray( value ) ) {
                            value = [ value ]; // promote to array so we can treat objects and arrays the same below
                        }
                        // RECURSE
                        for( let value2 of value ) {
                            let newNode = document.createElement( key );
                            if( newNode instanceof HTMLUnknownElement) {
                                throw `Unknown HTML tag '${key}'`;
                            }
                            doc.appendChild( newNode );
                            t2 = DocComposer.docTrace( newNode );
                            DocComposer.composer( value2, key, newNode, level+1 );
                        }
                        break;
                    case "string":
                        if( key == 'text' ) {
                            let textNode = document.createTextNode( value );
                            doc.appendChild( textNode );
                            t2 = DocComposer.docTrace( textNode );
                        } else {
                            // set an attribute of the current document node
                            ( doc as Element ).setAttribute( key, String( value ) );
                        }
                        break;
                    case "number":
                    case "boolean":
                    case "function":
                            // set an attribute of the current document node
                        doc[ key ] = value;
                        break;
                    }
                    let stop = 1;
                }
            }
        }

        //
        // The use of JS object in place of html occasionally necessitates a little
        // hack. HTML tags may repeat, for example, <input><input> is valid in HTML
        // but the corresponding JSON { "input":null, "input":null } is invalid. As 
        // a simple work-around, DocComposer removes any suffix beginning with the 
        // underscore character. This lets page developers declare the likes of
        //
        // { "input":null, "input_abc":null } 
        //                        ^
        static fixTagName( tagName: string ): string {
            let pos = tagName.indexOf( '_' );
            if( pos >= 0 ) {
                return tagName.substring( 0, pos );
            } else {
                return tagName;
            }
        }

        private static firstKeyOf( object: Object ) {
            const [firstKey, firstValue] = Object.entries( object )[0];
            return firstKey;
        }
        private static docTrace( node: Node ): string {
            let ret = "";
            do {
                switch (node.nodeType) {
                case Node.ELEMENT_NODE: //1
                    ret = ( node as Element ).tagName + " < " + ret;
                    break;
                case Node.ATTRIBUTE_NODE: //2
                    ret = ( node as Attr ).name + " < " + ret;
                    break;
                case Node.TEXT_NODE: //3
                    ret = ( node as Text ).textContent + " < " + ret;
                    break;
                case Node.CDATA_SECTION_NODE: //4
                case Node.PROCESSING_INSTRUCTION_NODE: //7
                case Node.COMMENT_NODE: //8
                case Node.DOCUMENT_NODE: //9
                case Node.DOCUMENT_TYPE_NODE: //10
                case Node.DOCUMENT_FRAGMENT_NODE: //11
                    ret = String( node.nodeType ) + " < " + ret;
                    break;
                }
                node = node.parentNode;
            } while( node );
            return ret;

        }

        public static htmlBodyToJsml( html: string ) {
            const parser = new DOMParser();
            const doc = parser.parseFromString( html, 'text/html');
            const ret = DocComposer.docToJsml( doc.body );
            return ret;
        }

        static dbgRet = null;
        static dbgSource = null;

        public static docToJsml( node: Node, ui?: Object, history?: Map< Node, Object >, 
            array?: [Object] ): Object {

            let ret = null;
            if( node ) {
                if( !ui ) {
                    ui = {};
                    ret = ui;
                    DocComposer.dbgRet = ret;
                }
                if( !history ) {
                    history = new Map();
                }

                if( history.has( node ) ) {
                    return null;
                } else {
                    history.set( node, null );
                }

                let tagName = DocComposer.tagName( node );
                //console.log( tagName );
                let uiNext = DocComposer.newJsmlNode( node );
                let newArray = null;
                if( Array.isArray( uiNext ) ) {
                    newArray = uiNext;
                    if( newArray != null && array != null ) {
                        let error = 1;
                    }
                    array = newArray;
                    uiNext = newArray[ 0 ];
                }
                
                // Copy attributes
                if( node instanceof Element ) {
                    let el = node as HTMLElement;
                    for( const attrName of el.getAttributeNames() ) {
                        let val = el.getAttribute( attrName );
                        uiNext[ attrName ] = val;
                    }
                }

                if( array == null ) {
                    // Force tag name to be unique
                    let counter = 2;
                    let tn2 = tagName;
                    while( ui [ tn2 ] ) {
                        tn2 = `${tagName}_${counter++}`;
                    }
                    tagName = tn2;
                    ui [ tagName ] = uiNext;
                } else {
                    if( newArray != null ) {
                        ui [ tagName ] = newArray;
                    } else {
                        array.push( uiNext );
                    }
                }

                var children = node.childNodes;
                if( children ) {
                    for ( let i = 0; i < children.length; i++ ) {
                        DocComposer.docToJsml( children[ i ], uiNext, history, null );
                    }
                }
                
                // Now the siblings.
                DocComposer.docToJsml( node.nextSibling, ui, history, array );
            }
            return ret;
        }
        
        private static newJsmlNode( node: Node ) {
            let ret = {};
            let startArray = DocComposer.sameTag( node, node.nextSibling ) && !DocComposer.sameTag( node, node.previousSibling );
            if( startArray ) {
                ret = [{}];
            }
            return ret;
        }

        private static sameTag( node1: Node, node2: Node ): boolean {
            if( ( node1 == null ) != ( node2 == null ) ) {
                return false;
            } else if( node1 == null ) {
                return false;
            } else {
                return( node1 as HTMLElement ).tagName == ( node2 as HTMLElement ).tagName;
            }
        }

        private static tagName( node: Node ): string {
            if( node ) {
                let el = node as HTMLElement; 
                if( !el.tagName ) {
                    switch( node.nodeType ) {
                    case Node.DOCUMENT_NODE:
                        return 'document';
                    case Node.TEXT_NODE:
                        return 'text';
                    }
                } else {
                    return el.tagName.toLowerCase();
                }
            }
            
            return null;
        }

        public static testToJsml() {
            let ui = Tables.demoUi( 2, 3, "testToJsml" );
            DocComposer.dbgSource = ui;
            let doc = DocComposer.compose( ui, null );
            let ui2 = DocComposer.docToJsml( doc )
            console.log( JSON.stringify( ui2, null, 4 ) );
            DocComposer.compose( ui2, document.body );
            let stop = 1;
        }
        public static testToJsml2() {
            //let doc = DocComposer.fetchFromUrl( 'http://www.nytimes.com' );
            let ui = DocComposer.htmlBodyToJsml( `<body><span>span 1</span><span>span 2</span><br/><span>span 3</span></body>`);
            console.log( JSON.stringify( ui, null, 4 ) );
            DocComposer.compose( ui, document.body );
            let stop = 1;
        }

        static testRef() {
            let o1 = {};
            let o2 = { "ref01": null };
            o2.ref01 = o1;
            let test = o2.ref01 == o1;
            let stop = true;
        }

        public static fetchFromUrl( url ): Document {
            let ret: Document = null;
            DocComposer.fetchDocumentUsingFetch( url ).then( ( doc ) => { ret = doc; } );
            return ret;
        }
 
        // Function to fetch and read a document using Fetch API
        private static async fetchDocumentUsingFetch( url ): Promise< Document > {
            try {
                const response = await fetch (url );
            
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html'); // Parse as HTML Document
            
                console.log('Document fetched successfully:', doc);
            
                // Return the parsed document
                return doc;
            } catch (error) {
                console.error('Failed to fetch the document:', error);
                return null; // Return null in case of error
            }
        }
   }
}