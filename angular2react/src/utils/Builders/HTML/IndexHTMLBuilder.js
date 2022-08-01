import Builder from "../Builder";
import TagBuilder from "./Auxiliary/TagBuilder";

class IndexHTMLBuilder extends Builder {
  constructor(folders) {
    super('index.html', folders);
    this.tagBuilder = new TagBuilder();
    this.location = this.folders.public;
    this.addDoctype()
      .addHead()
      .addBody();
    this.text = this.tagBuilder.getText();
    super.createFile();
  }

  addDoctype() {
    this.tagBuilder.addTag({ isDoctype: true });
    return this;
  }

  addHead() {
    // Add language
    this.tagBuilder
      .addTag({ name: "html" })
      .addTag({ name: "head", tabs: 1 })
      .addTag({
        name: "meta",
        properties: {
          charset: "utf-8",
        },
        tabs: 2,
        selfEnclosing: true,
      })
      .addTag({
        name: "link",
        properties: {
          rel: "icon",
          href: "favicon.ico",
        },
        tabs: 2,
        selfEnclosing: true,
      })
      .addTag({
        name: "meta",
        properties: {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        tabs: 2,
        selfEnclosing: true,
      })
      .addTag({
        name: "meta",
        properties: {
          name: "description",
          content: "Website create unsing create-react-app",
        },
        tabs: 2,
        selfEnclosing: true,
      })
      .addTag({
        name: "title",
        noEndline: true,
        tabs: 2,
      })
      .addCustomText("React App")
      .addTag({ name: "title", isClosed: true })
      .addTag({
        name: 'head',
        isClosed: true,
        tabs: 1
      });
     return this;
  }

  addBody() {
    this.tagBuilder
    .addTag({
      name: 'body',
      tabs: 1        
    })
    .addTag({
      name: 'noscript',
      noEndline: true,
      tabs: 2
    })
    .addCustomText('You need to enable Javascript to run this app.')
    .addTag({
        name: 'noscript',
        isClosed: true
    })
    .addTag({
        name: 'div',
        properties: {
            id: 'root'
        },
        noEndline: true,
        tabs: 2
    })
    .addTag({
        name: 'div',
        isClosed: true
    })
    .addComment({
        tabs: 2,
        isMultiLine: true,
        content: `This HTML file is a template.
If you open it directly in the browser, you will see an empty page.
  
You can add webfonts, meta tags, or analytics to this file.
The build step will place the bundled scripts into the <body> tag.
  
To begin the development, run \`npm start\` or \`yarn start\`.
To create a production bundle, use \`npm run build\` or \`yarn build\`. `
    })
    .addTag({
        name: 'body',
        tabs: 1,
        isClosed: true
    })
    .addTag({
        name: 'html',
        isClosed: true, 
    })
    return this;
  }
}

export default IndexHTMLBuilder;
