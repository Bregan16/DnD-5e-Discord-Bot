import path from "node:path";
import fs from "node:fs";
import {pathToFileURL} from "node:url";

const fileList: string[] = [];

export default async function LoadFiles(rootPath: string, startFolders: string) {
    const folderList: string[] = [];
    const __dirname = path.dirname(rootPath);
    const foldersPath = path.join(__dirname, startFolders);
    const commandFolders = fs.readdirSync(foldersPath, {withFileTypes: true});
    for (const item of commandFolders) {
        if(item.isFile()){
            fileList.push(pathToFileURL(path.join(item.parentPath, item.name)).href);
        }
        if(item.isDirectory()){
            folderList.push(pathToFileURL(path.join(item.parentPath, item.name)).pathname);
        }
        if(folderList.length !== 0){
            getNextFiles(folderList);
        }
    }
    return fileList;
}

const getNextFiles = (folders:string[]) => {
    const newFolderList: string[] = []
    do {
        const folder = folders.shift() as string;
        const files = fs.readdirSync(folder, {withFileTypes: true});
        for (const file of files) {
            // add file.endsWith('.js') || file.endsWith('.ts')
            if (file.isFile()) {
                fileList.push(pathToFileURL(path.join(file.parentPath, file.name)).href);
            }
            if (file.isDirectory()) {
                newFolderList.push(pathToFileURL(path.join(file.parentPath, file.name)).pathname);
            }
        }
    } while (folders.length !== 0);
    if(newFolderList.length !== 0){
        getNextFiles(newFolderList);
    }
}