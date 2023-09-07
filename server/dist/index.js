import express from 'express';
import cors from 'cors';
import formidable from "express-formidable";
import { AppDataSource } from "./data-source.js";
import { Images } from "./entity/Images.js";
import { backUpImg, removeImg } from "./backUpImg.js";
import { pressimg } from "./pressimg.js";
import { uploaddb } from "./uploaddb.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use(formidable());
app.use(cors());
app.use(express.static("public"));
function createImgConfig(path) {
    return {
        path: path,
        picExt: '',
        quality: 1.0,
        backUpOrg: false,
        backUpOrgPath: 'backUpOrg',
        createThumbnail: false,
        thumbnailPath: 'thumbnail', //default is thumbnail
    };
}
// [post route goes here]
// upload image
app.post("/compressImage", async (req, res) => {
    try {
        let config = [];
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        // load all info to Image
        //req.files => image object array
        for (const key in req.files) {
            // Identify and verified the image file -sync
            // 
            if (req.files[key].size > 0) {
                if (isPic(req.files[key].type)) {
                    const temp = createImgConfig(req.files[key].path);
                    temp.picExt = req.files[key].type.replace('image/', '');
                    let backuped = await backUpImg(req.files[key], temp);
                    // compressimg-async function
                    let compressed = await pressimg(backuped);
                    //upload DB-async function
                    let uploadDB = await uploaddb(compressed);
                    //push in array-sync function
                    config.push(uploadDB);
                }
                else {
                    return res.json({ Message: "please selcet a image in correct format." });
                }
            }
            else {
                return res.json({ Message: "please select a file." });
            }
        } //end of for loop
        console.log(config);
        return res.json({ Status: "Success" });
    }
    catch (err) {
        console.log(err);
        if (err)
            return res.json("Error");
    }
}); // end of app.post("/compressImage")
// [get route goes here]
app.get("/", async (req, res) => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const images = await AppDataSource.manager.find(Images);
    return res.json(images);
});
app.delete('/clear-images', async (req, res) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const images = await AppDataSource.manager.find(Images);
        for (const key in images) {
            const result = await removeImg(images[key]);
            console.log(result);
        }
        await AppDataSource.dropDatabase();
        await AppDataSource.synchronize();
        return res.status(200).json({ message: 'Images cleared successfully.' });
    }
    catch (error) {
        console.error('Error clearing images:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});
app.delete('/delete-image/:imageId', async (req, res) => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const imageId = Number(req.params.imageId);
        const imgToBeDelete = await AppDataSource.manager.findOneBy(Images, {
            id: imageId,
        });
        const result = await removeImg(imgToBeDelete);
        console.log(result);
        await AppDataSource.manager.remove(imgToBeDelete);
        res.status(200).json({ message: 'Image deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.listen(port, () => {
    console.log("Server started running at port: " + port);
});
function isPic(image) {
    const ext = image.toLowerCase();
    return (ext == 'image/jpg' || ext == 'image/png' || ext == 'image/svg' || ext == 'image/git' || ext == 'image/jpeg');
}
