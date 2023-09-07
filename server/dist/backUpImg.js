import fileSystem from "fs";
// back up image-async function
export async function backUpImg(file, temp) {
    return new Promise((resolve, reject) => {
        fileSystem.readFile(file.path, function (error, data) {
            if (error) {
                reject(error);
            }
            const filePath = "public/originalimg/" + (new Date().getTime()) + "-" + file.name;
            fileSystem.writeFile(filePath, data, async function (error) {
                if (error)
                    throw error;
                temp.backUpOrgPath = filePath;
                temp.backUpOrg = true;
                resolve(temp);
            });
        });
    });
}
export async function removeImg(file) {
    return new Promise((resolve, reject) => {
        fileSystem.unlink(addPub(file.Original_image), function (err) {
            if (err)
                throw err;
            fileSystem.unlink(addPub(file.Compressed_image), function (err) {
                if (err)
                    throw err;
            });
        });
        resolve("all realated files have been removed");
    });
}
function addPub(address) {
    const pub = 'public/';
    return pub.concat(address);
}
