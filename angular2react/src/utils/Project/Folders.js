import JSZip from 'jszip';
import { saveAs } from 'file-saver';

class Folders {
    constructor() { 
        this.root = new JSZip();
        this.src = this.root.folder('src');
        this.components = this.src.folder('components');
    }

    createArchive() { 
        this.root.generateAsync({type: 'blob'}).then(function(blob) {
            saveAs(blob, 'converted-app');
        })
    }
}

export default Folders;