const sharp = require('sharp')

async function test_watermark(input,watermark,output){
    let img = new sharp(input)
    let wm = new sharp(watermark)
    let img_m,wm_m;
    await img.metadata().then((x)=>{img_m=x})
    await wm.metadata().then((x)=>{wm_m=x})
    console.warn(">>>",watermark,output)
    adjWm=await wm.resize({ width: img_m.width}).toBuffer()
    console.log(img_m,wm_m,watermark,output,"XXX")
    
    img
    .composite([{ input: adjWm,gravity: 'southeast',// position:'top',//gravity: 'bottom'
                  }])
    .toFile(output)
    .then(console.log)
    .catch(console.error);
    
}

test_watermark("D:\\We Run 2023\\Vaibhav\\JPEG\\S_G01783.jpg",
                "\\i\\pcmc\\werun\\we23\\medalbib\\werun23 frame v1.png",
                "c:\\temp\\a.jpg")