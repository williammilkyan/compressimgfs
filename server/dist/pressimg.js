import compressImages from "compress-images";
// compress the image
export async function pressimg(temp) {
    return new Promise((resolve, reject) => {
        const compressedFilePath = "public/compressimg/compressed";
        const compression = 60;
        compressImages(temp.backUpOrgPath, compressedFilePath, {
            compress_force: false, statistic: true,
            autoupdate: true
        }, false, { jpg: { engine: "mozjpeg", command: ["-quality", compression] } }, { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } }, { svg: { engine: "svgo", command: "--multipass" } }, { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }, async function (error, completed, statistic) {
            if (error) {
                console.error("Error:", error);
            }
            else {
                console.log("---------------------------");
                console.log(completed);
                console.log(statistic);
                console.log("----------------------------");
                temp.quality = (100 - statistic.percent) * 0.01;
                temp.thumbnailPath = statistic.path_out_new;
                temp.createThumbnail = true;
                resolve(temp);
            }
        });
    });
}
