import Parser from "../Parser";
import Utilities from "../../Utilities";

export default class TypeScriptParser extends Parser{ 
    constructor() { 
        super();
        this.componentName = "";
        this.styleUrls = [];
    }

    parse(tokenList) { 
        this.init(tokenList);
        this.IMPORT_STATEMENTS();
        this.COMPONENT();
        this.CLASS();
    }

    IMPORT_STATEMENTS() { 
        console.log('IMPORTS');

        for(;;) {  
            if(this.sym !== 'import')
                break;
            this.check('import');
            if(this.sym === '{') {// import  
                this.check('{');
                for(;;) {
                    this.next(); // import object
                    if(this.sym === '}') {
                        this.check('}');
                        break;
                    }
                    this.check(',');
                }
            } else { // default import 
                this.next();
            }
            this.check('from'); 
            this.next(); // location
            if(this.sym === ';') // Semicolon is optional
                this.check(';');
        }    
    }

    COMPONENT() { 
        console.log('COMPONENT');
        this.check('@');
        this.check('Component');
        this.check('(');
        this.check('{');
        this.SELECTOR();
        this.TEMPLATE_URL();
        if(this.sym === 'styleUrls') {
            this.STYLE_URLS();
        }

        this.check('}');
        this.check(')');
    }

    SELECTOR() {
        console.log('SELECTOR');
        this.check('selector');
        this.check(':');
        this.next(); // selector 
        this.check(',');
    }

    TEMPLATE_URL() {
        console.log('TEMPLATE URL');
        this.check('templateUrl');
        this.check(':');
        this.next();
        this.check(',');
    }

    STYLE_URLS() {
        console.log('STYLE URLS');
        this.check('styleUrls');
        this.check(':');
        this.check('[');
        for(;;) {
            this.styleUrls.push(Utilities.extractLocation(this.sym));
            this.next();
            if(this.sym === ']') {
                this.check(']');
                break;
            }
            this.check(',');
        }
    }

    CLASS() {
        console.log('CLASS');
        this.check('export');
        this.check('class');
        this.componentName = this.sym; // component Name
        this.next();
        this.check('{');
        this.check('}')
    }
}