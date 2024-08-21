namespace _11dotjs {
    export class Config {
        public static uponLoad() {
            let links = {
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
            };
            DocComposer.compose( links, document.head );
        }
    }
}
