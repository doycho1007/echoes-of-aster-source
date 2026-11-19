export type Zone='village'|'forest'|'ruins';
export type Point={x:number;y:number};
export const W=30,H=16,T=32;
export const locations={village:{name:'루멘 마을',sub:'LUMEN VILLAGE',hint:'별빛이 머무는 마지막 마을'},forest:{name:'속삭임의 숲',sub:'WHISPERING WOODS',hint:'나뭇잎 사이로 오래된 노래가 들려온다'},ruins:{name:'월영의 유적',sub:'MOONFALL SANCTUM',hint:'멈춰 버린 달의 심장'}};
export type Entity=Point&{id:string;kind:string;name:string};
export const entities:Record<Zone,Entity[]>={
 village:[{x:16,y:9,id:'luna',kind:'npc',name:'루나'},{x:8,y:10,id:'crystal',kind:'crystal',name:'기억의 수정'},{x:20,y:11,id:'chest',kind:'chest',name:'여행자의 상자'},{x:28,y:9,id:'east',kind:'exit',name:'속삭임의 숲'}],
 forest:[{x:2,y:9,id:'west',kind:'exit',name:'루멘 마을'},{x:11,y:9,id:'shade1',kind:'enemy',name:'그림자 정령'},{x:21,y:7,id:'shade2',kind:'enemy',name:'그림자 정령'},{x:16,y:5,id:'fragment',kind:'fragment',name:'별의 파편'},{x:28,y:9,id:'east',kind:'exit',name:'월영의 유적'}],
 ruins:[{x:2,y:11,id:'west',kind:'exit',name:'속삭임의 숲'},{x:8,y:10,id:'crystal',kind:'crystal',name:'기억의 수정'},{x:21,y:7,id:'guardian',kind:'boss',name:'월영의 수호자'}]
};
export function blocked(zone:Zone,x:number,y:number){
 if(x<1||x>28||y<2||y>14)return true;
 if(zone==='village')return (x>=23&&x<=25&&(y<8||y>10)) || ([4,11,17].some(h=>x>=h&&x<h+5&&y>=4&&y<=7));
 if(zone==='forest')return ((x>=6&&x<=8)||(x>=18&&x<=19))&&(y<7||y>11);
 return (x>=13&&x<=14&&(y<8||y>11)) || ((x===17||x===25)&&(y===4||y===12));
}
export function pathTo(zone:Zone,start:Point,end:Point):Point[]{
 if(blocked(zone,end.x,end.y))return [];
 const queue=[start],seen=new Set([`${start.x},${start.y}`]),parent=new Map<string,Point>();
 for(let i=0;i<queue.length;i++){const p=queue[i];if(p.x===end.x&&p.y===end.y){const path:Point[]=[];let cur=p;while(cur.x!==start.x||cur.y!==start.y){path.unshift(cur);cur=parent.get(`${cur.x},${cur.y}`)!;}return path;}
 for(const d of [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]){const n={x:p.x+d.x,y:p.y+d.y},k=`${n.x},${n.y}`;if(!blocked(zone,n.x,n.y)&&!seen.has(k)){seen.add(k);parent.set(k,p);queue.push(n);}}}return [];
}
function hash(x:number,y:number){return Math.abs(Math.sin(x*127.1+y*311.7)*43758.5453)%1;}
export function drawWorld(ctx:CanvasRenderingContext2D,zone:Zone,player:Point,t:number,removed:string[],target:string,battle=false){
 const c=ctx; c.imageSmoothingEnabled=false;
 const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
 c.clearRect(0,0,960,512);
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){
  const r=hash(x,y);rect(x*T,y*T,T,T,zone==='ruins'?(r>.5?'#1c3037':'#1a2d34'):(r>.5?'#223e36':'#203b33'));
  if(zone!=='ruins'){for(let j=0;j<3;j++){const px=x*T+Math.floor(hash(x+j,y+5)*28),py=y*T+Math.floor(hash(x+8,y+j)*28);rect(px,py,2,3,r>.4?'#345346':'#2b493e');}}
  else {rect(x*T,y*T,31,1,'#294049');if(r>.7)rect(x*T+4,y*T+22,12,1,'#31474d');}
 }
 // Soft worn paths, not a grid overlay.
 for(let x=0;x<30;x++)for(let y=8;y<12;y++)if(!blocked(zone,x,y)){
  if(y===8 && hash(x,y)>.55 || y===11 && hash(x,y)<.6)continue;
  rect(x*T,y*T,32,32,zone==='ruins'?'#354347':'#59604a');
  for(let j=0;j<4;j++)rect(x*T+hash(x+j,y)*28,y*T+hash(y+j,x)*28,3,2,zone==='ruins'?'#475351':'#71735a');
 }
 function tree(x:number,y:number,size=1){c.save();c.translate(x,y);c.scale(size,size);rect(-15,12,37,8,'#132923');rect(-4,-8,10,26,'#3d4133');rect(1,-5,4,21,'#615343');rect(-24,-27,48,23,'#102c29');rect(-29,-40,56,24,'#183a32');rect(-22,-57,45,23,'#20483a');rect(-15,-69,30,20,'#2a5140');rect(-7,-75,14,12,'#375c45');rect(-22,-38,15,5,'#2a5140');rect(1,-57,12,5,'#42634a');c.restore();}
 function house(x:number,y:number,variant=0){
  rect(x-8,y+82,178,14,'#142c29');rect(x,y+5,152,88,'#555846');rect(x+5,y+17,142,65,'#797359');
  for(let k=0;k<5;k++)rect(x+5,y+23+k*13,142,2,'#5a5c48');
  rect(x+67,y+46,28,47,'#273830');rect(x+71,y+48,19,42,'#3a483a');rect(x+86,y+69,3,3,'#e4bc6a');
  for(const wx of [x+19,x+112]){rect(wx-3,y+36,24,28,'#374136');rect(wx,y+39,18,20,'#d8aa58');rect(wx+8,y+39,2,20,'#625b3f');rect(wx,y+48,18,2,'#625b3f');}
  for(let row=0;row<6;row++){rect(x-12+row*5,y-37+row*9,176-row*10,10,variant?'#4e6571':'#70574e');for(let tile=0;tile<12;tile++)rect(x-10+row*5+tile*15,y-36+row*9,1,7,variant?'#65808a':'#926e5b');}
  rect(x+114,y-47,15,32,'#566052');rect(x+111,y-49,21,6,'#7c7d65');rect(x+58,y+91,47,6,'#9b9471');
 }
 if(zone==='village'){
  for(let x=23;x<=25;x++){rect(x*T,0,T,512,'#193d4b');for(let y=0;y<16;y++){const off=(t*8+y*8)%28;rect(x*T+off,y*T+11,12,2,'#38606a');rect(x*T+(27-off),y*T+25,7,2,'#2d515e');}}
  rect(23*T-4,8*T,104,96,'#776a4f');for(let y=8*T;y<11*T;y+=9)rect(23*T-4,y,104,2,'#a58b5c');rect(23*T-8,8*T,8,96,'#434e3d');rect(26*T,8*T,7,96,'#434e3d');
  house(4*T,4*T,0);house(11*T,4*T,1);house(17*T,4*T,0);
  // Flower beds and village lanterns.
  for(let i=0;i<22;i++){const x=103+hash(i,9)*580,y=403+hash(i,10)*49;rect(x,y,2,7,'#4c6a47');rect(x-2,y,5,3,i%2?'#a99ab1':'#c1a76f');}
  for(const x of [327,699]){rect(x,264,4,41,'#746748');rect(x-4,256,12,12,'#ddbc71');const glow=c.createRadialGradient(x+2,262,2,x+2,262,52);glow.addColorStop(0,'#e6ba5133');glow.addColorStop(1,'#e6ba5100');c.fillStyle=glow;c.fillRect(x-52,210,108,104);}
 }
 if(zone==='forest'){
  for(const x of [6,7,18,19])for(const y of [3,5,13,15])tree(x*T,y*T,1.25);
  for(let i=0;i<18;i++){const x=hash(i,3)*900+20,y=hash(i,4)*160+30;rect(x,y,3,3,'#92a48e');}
  rect(15*T,4*T+24,96,65,'#354a40');rect(15*T+6,4*T+20,84,5,'#71816c');
 }
 if(zone==='ruins'){
  rect(16*T,3*T,320,322,'#304047');rect(16*T+8,3*T+8,304,306,'#3d4b4e');rect(16*T+24,3*T+24,272,274,'#293e46');
  c.strokeStyle='#718372';c.lineWidth=2;c.beginPath();c.ellipse(21*T+16,8*T,98,68,0,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(21*T+16,8*T,76,47,0,0,Math.PI*2);c.stroke();
  for(const x of [17,25])for(const y of [4,12]){rect(x*T-8,y*T+8,42,13,'#596869');rect(x*T,y*T-63,26,75,'#71807c');rect(x*T+5,y*T-59,5,66,'#98a096');rect(x*T-6,y*T-67,38,12,'#90998c');}
  for(let j=0;j<4;j++)rect(12*T+j*8,8*T+j*4,16,120-j*8,'#57625d');
 }
 for(let x=0;x<30;x+=2){tree(x*T+13,49+hash(x,1)*19,1.2);if(x<22 || zone!=='village')tree(x*T+23,520+hash(x,2)*23,1.1);}
 for(let y=3;y<15;y+=3){tree(20,y*T,1.2);tree(956,y*T,1.2);}
 function sprite(x:number,y:number,color:string,hero=false){rect(x-11,y+10,25,7,'#122722');const bob=Math.sin(t*3)*1; y+=bob;rect(x-7,y-23,15,11,hero?'#c6baa0':'#b7cad0');rect(x-10,y-18,20,7,hero?'#d5c8ad':'#d4dddc');rect(x-6,y-12,13,10,'#dfbda0');rect(x+3,y-9,2,2,'#283a36');rect(x-8,y-2,18,16,color);rect(x-10,y+1,4,13,color);rect(x-5,y+14,5,7,'#242c33');rect(x+3,y+14,5,7,'#242c33');if(hero){rect(x+9,y-1,3,20,'#abbfba');rect(x+6,y+5,10,3,'#ccb976');rect(x-9,y,17,4,'#b89062');}}
 for(const e of entities[zone]){
  if(removed.includes(e.id))continue;const x=e.x*T+16,y=e.y*T+12;
  if(e.kind==='npc')sprite(x,y,'#7988ae');
  if(e.kind==='crystal'||e.kind==='fragment'){
   const pulse=.65+Math.sin(t*2)*.15; c.globalAlpha=pulse;const glow=c.createRadialGradient(x,y,2,x,y,52);glow.addColorStop(0,'#81ddc755');glow.addColorStop(1,'#81ddc700');c.fillStyle=glow;c.fillRect(x-52,y-52,104,104);c.globalAlpha=1;
   rect(x-15,y+13,30,8,'#73857a');c.fillStyle='#a7ead6';c.beginPath();c.moveTo(x,y-26);c.lineTo(x+10,y-6);c.lineTo(x,y+14);c.lineTo(x-10,y-6);c.fill();c.fillStyle='#4a9d92';c.beginPath();c.moveTo(x,y-26);c.lineTo(x+10,y-6);c.lineTo(x,y+14);c.fill();
  }
  if(e.kind==='chest'){rect(x-13,y-8,26,21,'#92724b');rect(x-13,y-9,26,5,'#c4a464');rect(x-13,y+3,26,3,'#4c4935');rect(x-2,y,5,7,'#ead28a');}
  if(e.kind==='enemy'){const b=Math.sin(t*3)*4;rect(x-14,y-9+b,28,20,'#514b74');rect(x-9,y-17+b,18,29,'#6e628b');rect(x-6,y-7+b,4,3,'#e4bfcf');rect(x+4,y-7+b,4,3,'#e4bfcf');rect(x-16,y+7+b,9,8,'#514b74');}
  if(e.kind==='boss')drawGuardian(c,x,y,t,1);
  if(e.kind==='exit'){c.fillStyle='#d7cb9e';c.font='22px serif';c.textAlign='center';c.fillText(e.id==='east'?'›':'‹',x,y+8);}
  if(e.id===target){c.fillStyle='#e8ca7f';c.beginPath();c.moveTo(x-5,y-43+Math.sin(t*3)*3);c.lineTo(x+5,y-43+Math.sin(t*3)*3);c.lineTo(x,y-37+Math.sin(t*3)*3);c.fill();}
  if(e.kind!=='enemy'&&e.kind!=='boss'){c.font='11px sans-serif';c.textAlign='center';c.fillStyle='#0c211bdd';c.fillRect(x-42,y+26,84,18);c.fillStyle=e.id===target?'#edd99d':'#bac9b6';c.fillText(e.name,x,y+39);}
 }
 if(!battle)sprite(player.x*T+16,player.y*T+12,'#6e9f92',true);
 // Fireflies, moonlight, and a subtle edge vignette.
 for(let i=0;i<35;i++){const x=hash(i,13)*960+Math.sin(t*.4+i)*7,y=hash(i,17)*512+Math.cos(t*.3+i)*5;c.globalAlpha=.2+(Math.sin(t+i)+1)*.2;rect(x,y,2,2,'#e9d794');}c.globalAlpha=1;
 const vig=c.createRadialGradient(480,260,180,480,260,560);vig.addColorStop(0,'#031c2000');vig.addColorStop(1,'#03181d99');c.fillStyle=vig;c.fillRect(0,0,960,512);
}
export function drawGuardian(c:CanvasRenderingContext2D,x:number,y:number,t:number,scale:number){c.save();c.translate(x,y+Math.sin(t*2)*4);c.scale(scale,scale);const r=(a:number,b:number,w:number,h:number,col:string)=>{c.fillStyle=col;c.fillRect(a,b,w,h);};r(-24,-37,48,49,'#657d83');r(-31,-30,15,25,'#8ba09c');r(16,-30,15,25,'#8ba09c');r(-14,-60,28,27,'#a6b9aa');r(-18,-58,36,8,'#d0c598');r(-9,-44,6,4,'#b6f6db');r(5,-44,6,4,'#b6f6db');r(-8,-20,16,19,'#9de3c7');r(-20,13,13,18,'#506970');r(8,13,13,18,'#506970');r(32,-44,6,65,'#d6d4af');r(25,-9,20,5,'#b9a96f');c.restore();}
