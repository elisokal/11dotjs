# 11dotjs is HTML5 without HTML
11dotjs (pronounced like "eleven.js") is an open-source TypeScript / JavaScript project. It’s **not** a framework, or API, and it’s **not** opinionated. 11dotjs **is** independent of all web-authoring frameworks, so you can use it with or without any of them. Its only dependency is the TypeScript compiler and your browser.
## Goals
- Share free, lightweight, ready-to-use web components with the masses. 
- Promote a web-authoring model based on Objects instead of HTML.
## Turn your code up to eleven with 11dotjs.
With the **11dotjs** web-authoring model, you can 
- Code your UI in intuitive JSON.
- Call **11dotjs** generators to add structures like tables to your graph.
- Write your own generators.
- Invoke the **11dotjs Composer** to convert your UI object graph directly to the browser’s DOM document.
## Typical JSON for static UI
```
  public createUi(): Node {
    let ui = {
      "div": {
        "id": this.config.dialogId,
        "style": "position: fixed; left: 40px; top: 40px; border:2px solid gray; border-radius: 8px; z-index: 99; "
        + "min-width: 256px; min-height: 256px; background-color: white; padding:0",
        "table" : {
          //"style": "width: 100%",
          "tbody": {
            "tr" : [
              {
                "td": [
                  {
                    "text": this.config.title,
                    "style": "text-align: center; font-family: consolas; font-size: 1.2em; cursor: move",
                    "draggable": true,
                    "id" : this.config.dialogId+"-titleBar"
                  },
                  {
                    "text": "\u00D7",
                    "style": "text-align: right; width:1em; cursor: pointer; font-size:1.5em",
                    "onclick": `Dialog.detachElement('${this.config.dialogId}');`,
                    "title" : "close me"
                  }
                ]
              },
              {
                "td": {
                  "id" : this.config.clientAreaId,
                  "colspan": 2
                }                  
              }
            ]
          }
        }
      }
    };
    const ret: Node = DocComposer.compose( ui, this.config.parent );
    this.configureDragDrop( ret, document.getElementById( this.config.dialogId+"-titleBar") );
    return ret;
  }
```
## See a Demo
Intuitive Color Palette, the first **11dotjs** component, contains neither static nor generated HTML. There’s a demo at http://elisokal.com/11dotjs/colorPaletteDemo2.html. 
## Learn More
Write to elisokal@gmail.com to discuss integration, customization, and collaboration.



