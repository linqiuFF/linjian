// 逐帧渲染页面并合成 MP4:  node record.mjs <音频文件> [输出.mp4] [并行数] [页面,默认 index.html]
// 页面若定义 window.RANGE=[开始,结束],只录这一段
import {createRequire} from 'module';
import {spawn,execFileSync} from 'child_process';
import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const req=createRequire(import.meta.url);
let pw;for(const p of ['playwright','/opt/node22/lib/node_modules/playwright','/node-tools/node_modules/playwright']){try{pw=req(p);break;}catch{}}
const dir=path.dirname(fileURLToPath(import.meta.url));
const audio=process.argv[2]||path.join(dir,'song.mp3'),out=process.argv[3]||path.join(dir,'lyric-mv.mp4'),N=+process.argv[4]||4;
const PAGE=process.argv[5]||'index.html',SRC=fs.readFileSync(path.join(dir,PAGE),'utf8');
const RG=(SRC.match(/START=([\d.]+),END=([\d.]+)/)||[]).slice(1).map(Number);
const T0=RG.length?RG[0]:0,DUR=RG.length?RG[1]-RG[0]:+SRC.match(/DUR=([\d.]+)/)[1];
const FPS=30,TOTAL=Math.ceil(DUR*FPS),tmp=fs.mkdtempSync(path.join(path.dirname(out),'.seg-'));
const per=Math.ceil(TOTAL/N);
const browser=await pw.chromium.launch();
let done=0;
async function work(k){
  const a=k*per,b=Math.min(TOTAL,a+per);if(a>=b)return null;
  const file=path.join(tmp,`seg${k}.mp4`);
  const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p',file],{stdio:['pipe','inherit','inherit']});
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto('file://'+path.join(dir,PAGE)+'?record=1');await page.evaluate(()=>window.ready);
  for(let f=a;f<b;f++){
    const d=await page.evaluate(t=>{window.renderAt(t);return document.getElementById('c').toDataURL('image/jpeg',0.95);},T0+f/FPS);
    if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));
    if(++done%300===0)console.log(`${done}/${TOTAL}`);
  }
  ff.stdin.end();await new Promise(r=>ff.on('close',r));await page.close();return file;
}
const segs=(await Promise.all([...Array(N).keys()].map(work))).filter(Boolean);
await browser.close();
fs.writeFileSync(path.join(tmp,'list.txt'),segs.map(s=>`file '${s}'`).join('\n'));
execFileSync('ffmpeg',['-v','error','-y','-f','concat','-safe','0','-i',path.join(tmp,'list.txt'),'-ss',String(T0),'-i',audio,'-map','0:v','-map','1:a','-c:v','copy','-af',(T0?`afade=t=in:d=0.4,`:'')+`afade=t=out:st=${(DUR-(DUR<40?0.6:2)).toFixed(2)}:d=${DUR<40?0.6:2}`,'-c:a','aac','-b:a','256k','-t',String(DUR),'-movflags','+faststart',out]);
fs.rmSync(tmp,{recursive:true,force:true});
console.log('done',out);
