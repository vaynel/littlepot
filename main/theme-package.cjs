// Shared, bounded data-only package reader. No archive entries are written to disk.
const { inflateRawSync, inflateSync } = require('node:zlib');
const { createHash } = require('node:crypto');
const MAX_PACKAGE = 5 * 1024 * 1024;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
function check(ok) { if (!ok) throw Error('테마 형식이 올바르지 않아요. v1 PNG 아틀라스 패키지를 확인해 주세요.'); }
const table = Array.from({length:256}, (_,n) => {for(let k=0;k<8;k++) n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(bytes) {let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
function strictJson(text) {
  let i=0;
  const ws=()=>{while(/\s/.test(text[i]||'!'))i++;};
  function string(){const start=i++;while(i<text.length){if(text[i]==='\\'){i+=2;continue;}if(text[i++]==='"')return JSON.parse(text.slice(start,i));}throw Error('JSON');}
  function value(depth=0){check(depth<25);ws();const c=text[i];
    if(c==='"')return string();
    if(c==='{'||c==='['){i++;const object=c==='{', result=object?Object.create(null):[],keys=new Set();ws();const end=object?'}':']';if(text[i]===end){i++;return result;}
      while(i<text.length){ws();let key;if(object){check(text[i]==='"');key=string();check(!keys.has(key));keys.add(key);ws();check(text[i++]===':');}const v=value(depth+1);if(object)result[key]=v;else result.push(v);ws();if(text[i]===end){i++;return result;}check(text[i++]===',');}throw Error('JSON');}
    const m=/^(?:true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(text.slice(i));check(m);i+=m[0].length;return JSON.parse(m[0]);}
  const result=value();ws();check(i===text.length);return result;
}
function keys(obj, required, optional=[]) {check(obj&&typeof obj==='object'&&!Array.isArray(obj));check(required.every(k=>Object.hasOwn(obj,k)));check(Object.keys(obj).every(k=>[...required,...optional].includes(k)));}
function label(v,max){check(typeof v==='string'&&v.trim().length>0&&v.length<=max&&!/[\x00-\x1f\x7f]/.test(v));}
function validateFont(f, bytes, license) {
  keys(f,['path','sha256','family','licenseId','licensePath']);label(f.family,60);label(f.licenseId,80);check(f.licensePath==='licenses/font.txt'&&license&&license.length<=32768);const text=new TextDecoder('utf8',{fatal:true}).decode(license);check(text.trim().length>0&&!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text));
  check(/^assets\/font\.(ttf|otf|woff|woff2)$/.test(f.path)&&bytes&&bytes.length>=48&&bytes.length<=2*1024*1024&&hash(bytes)===f.sha256);
  const ext=f.path.split('.').pop(),magic=bytes.toString('ascii',0,4);
  if(ext==='woff'||ext==='woff2'){check(magic===(ext==='woff'?'wOFF':'wOF2')&&bytes.readUInt32BE(8)===bytes.length&&bytes.readUInt16BE(12)>0&&bytes.readUInt16BE(12)<=256&&bytes.readUInt32BE(16)<=20*1024*1024);}
  else {check(ext==='otf'?magic==='OTTO':bytes.readUInt32BE(0)===0x00010000);const n=bytes.readUInt16BE(4);check(n>0&&n<=256&&12+n*16<=bytes.length);for(let i=0;i<n;i++){const p=12+i*16,offset=bytes.readUInt32BE(p+8),size=bytes.readUInt32BE(p+12);check(offset>=12+n*16&&offset+size<=bytes.length);}}
}
function validateUi(ui) {
  keys(ui,['background','panel','sidebar','text','muted','border','accent','accentText']);
  for(const v of Object.values(ui))check(typeof v==='string'&&/^#[\da-f]{6}$/i.test(v));
  const lum=c=>{const a=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
  const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  for(const bg of ['background','panel','sidebar'])for(const fg of ['text','muted'])check(contrast(ui[bg],ui[fg])>=4.5);
  check(contrast(ui.accent,ui.accentText)>=4.5);
}
function validateManifest(m, png, files) {
  keys(m,['formatVersion','themeId','version','title','creatorLabel','licenseId','compatibility','palette','layout','assets','plants','shelf','motion'],m.formatVersion===2?['ui']:[]);
  check([1,2].includes(m.formatVersion));if(m.ui)validateUi(m.ui);label(m.themeId,100);check(/^\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(m.version));label(m.title,60);label(m.creatorLabel,40);label(m.licenseId,80);
  keys(m.compatibility,['rendererApi','minAppVersion','supportedOS']);check(m.compatibility.rendererApi===1);check(/^\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(m.compatibility.minAppVersion));check(Array.isArray(m.compatibility.supportedOS)&&m.compatibility.supportedOS.length>0&&m.compatibility.supportedOS.length<=3&&new Set(m.compatibility.supportedOS).size===m.compatibility.supportedOS.length&&m.compatibility.supportedOS.every(x=>['win32','darwin','linux'].includes(x)));
  keys(m.palette,[],['surface','surfaceAlt','accent']);for(const v of Object.values(m.palette))check(typeof v==='string'&&/^#[\da-f]{6}$/i.test(v));
  keys(m.layout,['preset']);check(m.layout.preset==='windowsill-v1');keys(m.assets,['atlas'],m.formatVersion===2?['font']:[]);if(m.assets.font)validateFont(m.assets.font,files[m.assets.font.path],files[m.assets.font.licensePath]);check(Object.keys(files).length===(m.assets.font?4:2));const a=m.assets.atlas;keys(a,['path','sha256','width','height']);check(a.path==='assets/atlas.png'&&a.sha256===hash(png));
  check(png.length>33&&png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
  let pos=8, idats=[], ended=false, seenIDAT=false, width=0,height=0;
  while(pos<png.length){check(pos+12<=png.length);const n=png.readUInt32BE(pos),type=png.toString('ascii',pos+4,pos+8);check(n<=MAX_PACKAGE&&pos+n+12<=png.length);const data=png.subarray(pos+8,pos+8+n);check(crc(png.subarray(pos+4,pos+8+n))===png.readUInt32BE(pos+8+n));
    if(pos===8){check(type==='IHDR'&&n===13);width=data.readUInt32BE(0);height=data.readUInt32BE(4);check(width>0&&height>0&&width<=1024&&height<=1024&&data.subarray(8).equals(Buffer.from([8,6,0,0,0])));}
    else if(type==='IDAT'){check(!ended);seenIDAT=true;idats.push(data);}
    else if(type==='IEND'){check(n===0&&seenIDAT&&pos+n+12===png.length);ended=true;}
    else { // Allow bounded, harmless editor metadata; APNG and unknown chunks are rejected.
      check(['sRGB','gAMA','pHYs','tEXt'].includes(type)&&n<=4096&&!seenIDAT);
    }
    pos+=n+12;
  }
  check(ended&&a.width===width&&a.height===height);
  const scan=inflateSync(Buffer.concat(idats),{maxOutputLength:(width*4+1)*height});check(scan.length===(width*4+1)*height);for(let y=0;y<height;y++)check(scan[y*(width*4+1)]<=4);
  const rect=(r,w,h)=>{check(Array.isArray(r)&&r.length===2&&r.every(Number.isInteger));check(r[0]>=0&&r[1]>=0&&r[0]+w<=width&&r[1]+h<=height);};
  check(Array.isArray(m.plants)&&m.plants.length===3);for(const p of m.plants){keys(p,['asset','size','anchor','stages']);check(p.asset==='atlas'&&JSON.stringify(p.size)==='[64,112]'&&JSON.stringify(p.anchor)==='[32,112]');check(Array.isArray(p.stages)&&p.stages.length===4);p.stages.forEach(r=>rect(r,64,112));}
  keys(m.shelf,['asset','left','repeat','right']);check(m.shelf.asset==='atlas');for(const k of ['left','repeat','right']){const r=m.shelf[k];check(Array.isArray(r)&&r.length===4&&r[2]===16&&r[3]===26);rect(r.slice(0,2),16,26);}
  keys(m.motion,['preset','amplitudePx','periodMs']);check(['none','sway'].includes(m.motion.preset)&&Number.isInteger(m.motion.amplitudePx)&&m.motion.amplitudePx>=0&&m.motion.amplitudePx<=2&&Number.isInteger(m.motion.periodMs)&&m.motion.periodMs>=2000&&m.motion.periodMs<=10000);
  return m;
}
function validatePackage(input) {
  try {
    const b=Buffer.from(input);check(b.length>=22&&b.length<=MAX_PACKAGE);
    const e=b.length-22,count=b.readUInt16LE(e+8);check([2,4].includes(count));check(b.readUInt32LE(e)===0x06054b50&&b.readUInt16LE(e+4)===0&&b.readUInt16LE(e+6)===0&&b.readUInt16LE(e+10)===count&&b.readUInt16LE(e+20)===0);
    let p=b.readUInt32LE(e+16),start=p,localEnd=0;check(p+b.readUInt32LE(e+12)===e);const files={};
    for(let i=0;i<count;i++){
      check(p+46<=e&&b.readUInt32LE(p)===0x02014b50);const flags=b.readUInt16LE(p+8),method=b.readUInt16LE(p+10),sum=b.readUInt32LE(p+16),compressed=b.readUInt32LE(p+20),size=b.readUInt32LE(p+24),nl=b.readUInt16LE(p+28),xl=b.readUInt16LE(p+30),cl=b.readUInt16LE(p+32),offset=b.readUInt32LE(p+42),mode=b.readUInt32LE(p+38)>>>16;
      check(p+46+nl+xl+cl<=e&&[0,2048].includes(flags)&&[0,8].includes(method)&&b.readUInt16LE(p+34)===0&&[0,0x8000].includes(mode&0xf000));const name=b.toString('utf8',p+46,p+46+nl);check(['manifest.json','assets/atlas.png','assets/font.ttf','assets/font.otf','assets/font.woff','assets/font.woff2','licenses/font.txt'].includes(name)&&!files[name]);check(size>0&&size<=(name==='manifest.json'?65536:name==='licenses/font.txt'?32768:name==='assets/atlas.png'?MAX_PACKAGE:2*1024*1024));
      check(offset===localEnd&&offset+30<=start&&b.readUInt32LE(offset)===0x04034b50&&b.readUInt16LE(offset+6)===flags&&b.readUInt16LE(offset+8)===method&&b.readUInt32LE(offset+14)===sum&&b.readUInt32LE(offset+18)===compressed&&b.readUInt32LE(offset+22)===size);
      const ln=b.readUInt16LE(offset+26),lx=b.readUInt16LE(offset+28),data=offset+30+ln+lx;check(ln===nl&&b.toString('utf8',offset+30,offset+30+ln)===name&&data+compressed<=start);const raw=b.subarray(data,data+compressed);const bytes=method===0?raw:inflateRawSync(raw,{maxOutputLength:size});check(bytes.length===size&&crc(bytes)===sum);files[name]=bytes;localEnd=data+compressed;p+=46+nl+xl+cl;
    }
    check(p===e&&localEnd===start);const png=files['assets/atlas.png'];const manifest=validateManifest(strictJson(new TextDecoder('utf8',{fatal:true}).decode(files['manifest.json'])),png,files);
    return {manifest,png,font:manifest.assets.font?files[manifest.assets.font.path]:null,digest:hash(b),bytes:b};
  } catch {throw Error('테마 패키지를 확인해 주세요. 5MB 이하 v1/v2 ZIP, manifest.json, RGBA PNG, 선택 폰트(2MB 이하), 색상 대비와 파일 해시를 확인해 주세요.');}
}
module.exports={validatePackage,MAX_PACKAGE,hash,crc,strictJson};
