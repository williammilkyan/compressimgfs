import { AppDataSource } from "./data-source.js";
import { Images } from "./entity/Images.js";
// upload to mysql 
export async function uploaddb(temp) {
    return new Promise(async (resolve, reject) => {
        console.log("Inserting a new Images into the database...");
        const image = new Images();
        image.Original_image = temp.backUpOrgPath.replace('public/', '');
        image.Compressed_image = temp.thumbnailPath.replace('public/', '');
        await AppDataSource.manager.save(image);
        console.log("Saved a new user with id: " + image.id);
        resolve(temp);
    });
}
