const PNGReader = require('png.js');
const puppeteer = require('puppeteer');

function isWhite(pixel) {
  if(pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255) {
    return true;
  } else {
    return false;
  }
}

function isInRange(x,y) {
    if(y <= 120) {
      return true;
    }
    if(y >= 220) {
      return true;
    }
    if(x <= 180) {
      return true;
    }
    return false;
}

async function fuzzBrowser(writeStream, page, chr1, chr2) {
  if(typeof chr2 !== 'undefined') {
    await page.goto('http://localhost/visualfuzzer/index.php?'+chr1+','+chr2);
  } else {
    await page.goto('http://localhost/visualfuzzer/index.php?'+chr1);
  }
  await page.screenshot({clip:{x:0,y:0,width: 400,height: 300}}).then((buf)=>{
    var reader = new PNGReader(buf);
    reader.parse(function(err, png){
      if(err) throw err;
      outerLoop:for(let x=0;x<400;x++) {
        for(let y=0;y<300;y++) {
          if(!isWhite(png.getPixel(x,y)) && isInRange(x,y)) {
            if(typeof chr2 !== 'undefined') {
              writeStream.write(chr1+','+chr2+'\n');
              console.log('Interesting chars: '+chr1+','+chr2);
            } else {
              writeStream.write(chr1+'\n');
              console.log('Interesting char: '+chr1);
            }
            break outerLoop;
          }
        }
      }
    });
  });
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const singleChars = {834:1,1425:1,1427:1,1430:1,1434:1,1435:1,1442:1,1443:1,1444:1,1445:1,1446:1,1447:1,
                      1450:1,1453:1,1557:1,1623:1,1626:1,3633:1,3636:1,3637:1,3638:1,3639:1,3640:1,3641:1,
                      3642:1,3655:1,3656:1,3657:1,3658:1,3659:1,3660:1,3661:1,3662:1};
  const fs = require('fs');
  let writeStream = fs.createWriteStream('logs.txt', {flags: 'a'});
/*
  for(let i=0;i<=0xffff;i++) {
      process.stdout.write("Fuzzing chars "+i+"\r");
      await fuzzBrowser(writeStream, page, i,).catch(err=>{
        console.log("Failed fuzzing browser:"+err);
      });
  }
  */
  for(let i=768;i<=879;i++) {
    for(let j=768;j<=879;j++) {
        if(singleChars[i] || singleChars[j]) {
          continue;
        }
        process.stdout.write("Fuzzing chars "+i+","+j+" \r");
        await fuzzBrowser(writeStream, page, i, j).catch(err=>{
          console.log("Failed fuzzing browser:"+err);
        });
    }
  }
  await browser.close();
  await writeStream.end();
})();
