import Parser from "../Parser";
import properties from "../../properties";
import Component from "../../Classes/Component";
import Utilities from "../../Utilities";

class AppModuleParser extends Parser { 
    constructor() { 
        super();
        this.componentCount = 0;
    }

    parse(tokenList) { 
        this.init(tokenList);
        this.importStatements();

        return this.componentCount;
    }

    importStatements() { 
        console.log('Import Statements');
        try { 
            for(;;) {
                this.check('import');
                this.check('{');
                this.next();
                this.check("}");
                this.check("from");
                this.next();
                this.check(";");
            }
        } catch(e) {
            this.NGModule();
        }
    }

    NGModule() { 
        console.log('NgModule');
        this.check('@');
        this.check('NgModule');
        this.check('(');
        this.check('{');
        this.declarations();
        this.imports();
        this.providers();
        this.bootstrap();
        this.check('}');
        this.check(')');
        this.exportStatement();
        console.log("finish");
    }

    declarations() {
        console.log('Declarations');
        this.check('declarations');
        this.check(':');
        this.check("[");
        let found = false; 
        for(;;) { 
            // Iterate over every component 
            let newComponent = new Component(Utilities.removeComponent(this.sym));
            if(newComponent.name === 'App') 
                found = true;
            this.componentCount++;
            properties.components.push(newComponent);
            this.next();
            if(this.sym === ']')
                break;
            else 
                this.check(',');
        }
        if(!found) { 
            throw new Error('AppComponent was not found in declarations');
        }
        this.check(']');
        this.check(',');
    }

    imports() {
        console.log('Imports');
        const { imports } = properties;
        this.check('imports');
        this.check(':');
        this.check('[');
        console.log('a');
        for(;;) {
            // Iterate over all imports 
            if(this.sym === ']')
                break;
            imports.push(this.sym);
            this.next();
            if(this.sym === ',')
                this.next();
        }
        console.log('b');
        this.check(']');
        this.check(',');
    }

    providers() { 
        const { providers } = properties;
        console.log('Providers');
        this.check('providers');
        this.check(':');
        this.check('[');
        for(;;) {
            if(this.sym === ']') 
                break;
            providers.push(this.sym);
            this.next();
            if(this.sym === ',')
                this.next();
        }
        this.check(']');
        this.check(',');
    }

    bootstrap() {
        console.log('Bootstrap');
        this.check('bootstrap');
        this.check(':');
        this.check('[');
        this.check('AppComponent');
        this.check(']');
    }

    exportStatement() { 
        console.log('Export Default');
        this.check('export');
        this.check('class');
        this.check('AppModule')
        this.check('{');
        this.check('}');
    }
}

export default AppModuleParser;