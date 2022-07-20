import Builder from "./Builder";

class PackageBuilder extends Builder {
  constructor(folders) {
    super('package.json', folders);
    this.text = `
{
    "name": "react-complete-guide",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
        "@testing-library/jest-dom": "^5.11.6",
        "@testing-library/react": "^11.2.2",
        "@testing-library/user-event": "^12.5.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0",
        "react-scripts": "4.0.1",
        "web-vitals": "^0.2.4"
    },
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    },
    "eslintConfig": {
        "extends": [
            "react-app",
            "react-app/jest"
            ]
        },
    "browserslist": {
        "production": [
            ">0.2%",
            "not dead",
            "not op_mini all"
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
        ]
    }
}`;

    super.createFile();
  }
}

export default PackageBuilder;
