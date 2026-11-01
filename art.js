(()=>{
'use strict';
const px=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const rect=(c,x,y,w,h,col)=>px(c,x,y,w,h,col);
const palettes={
eden:{ground:'#527b49',dark:'#294b37',light:'#88a75b',path:'#b7a17a',water:'#579eaa'},
noah:{ground:'#70503a',dark:'#382b25',light:'#b28a5b',path:'#9a7550',water:'#4d7882'},
moses:{ground:'#c3ad7f',dark:'#806f52',light:'#ead9ad',path:'#e4d4a9',water:'#326b88'},
jesus:{ground:'#8b986c',dark:'#4d6748',light:'#b8ad7c',path:'#c3a778',water:'#779e9a'},
jacob:{ground:'#4d5260',dark:'#252d40',light:'#9b927e',path:'#877d6c',water:'#456d7b'},
bread:{ground:'#a78c5e',dark:'#66513a',light:'#d4b87d',path:'#c4a477',water:'#71938c'},
david:{ground:'#9a8a68',dark:'#514b40',light:'#c2ad83',path:'#b8a27b',water:'#668a8c'}
};
function tree(c,x,y,s=1){px(c,x-10*s,y-18*s,20*s,22*s,'#674a31');px(c,x-23*s,y-42*s,46*s,30*s,'#315b3d');px(c,x-17*s,y-53*s,34*s,18*s,'#477744');px(c,x-10*s,y-61*s,20*s,12*s,'#70904b');px(c,x-16*s,y-39*s,6*s,7*s,'#8da85a');}
function bush(c,x,y,col='#365d3b'){px(c,x-12,y-6,24,12,col);px(c,x-8,y-12,16,7,'#64894b');}
function rock(c,x,y,w=24,h=14){px(c,x-w/2,y-h,w,h,'#77776b');px(c,x-w/2+4,y-h-3,w-8,4,'#a49c84');}
function building(c,x,y,w,h,wall='#b99a70'){px(c,x,y,w,h,wall);px(c,x-4,y-5,w+8,8,'#69513e');px(c,x+w*.38,y+h*.52,w*.24,h*.48,'#5a4636');px(c,x+5,y+8,7,8,'#6f8a8b');}
function scene(c,id,t){
 const p=palettes[id]||palettes.eden;
 px(c,0,0,512,288,p.ground);
 // Distant skyline and distinct chapter geography
 if(id==='eden'){
  px(c,0,0,512,100,'#9cb99c');px(c,0,85,512,25,'#769b72');
  for(let i=0;i<8;i++)tree(c,28+i*68,120+(i%3)*5,.8+(i%2)*.15);
  px(c,0,190,512,46,p.water);for(let i=0;i<15;i++){px(c,i*37,198+(i%3)*8,22,2,'#a4d1c3');px(c,i*37+9,218+(i%2)*7,12,2,'#d1e4bd');}
  px(c,0,236,512,52,'#456b43');px(c,0,242,512,3,'#729451');
  tree(c,250,143,1.55);tree(c,410,155,1.2);for(let i=0;i<20;i++)bush(c,(i*47)%512,160+(i%3)*22);
  for(let i=0;i<12;i++){let x=(i*41)%500,y=180+(i%4)*19;px(c,x,y,3,3,'#e6d38a');}
 }else if(id==='noah'){
  px(c,0,0,512,288,'#4a382e');px(c,0,24,512,220,'#72543c');
  for(let y=30;y<250;y+=32){px(c,0,y,512,4,'#b08a5c');for(let x=8;x<512;x+=48)px(c,x,y+4,3,26,'#49372c');}
  px(c,0,0,512,28,'#302822');px(c,0,250,512,38,'#382a23');
  // pens, feed troughs and stacked supplies
  for(let i=0;i<5;i++){let x=22+i*98;px(c,x,70,3,145,'#4a3427');px(c,x+48,70,3,145,'#4a3427');px(c,x,70,51,3,'#c09762');px(c,x,212,51,3,'#c09762');}
  for(let i=0;i<6;i++){let x=32+i*82;px(c,x,100+(i%2)*52,26,14,'#9d7549');px(c,x+3,96+(i%2)*52,20,5,'#d2ae78');}
  // Animal pairs in their own stalls: distinct silhouettes make this chapter readable at a glance
  const pairs=[['#b98555','#d6b47c'],['#8b8170','#c7b99d'],['#a9784d','#d1a36e']];
  for(let i=0;i<3;i++){
   const x=45+i*164, y=154+(i%2)*5, colors=pairs[i];
   for(let j=0;j<2;j++){
    const ox=x+j*23;
    // compact four-legged animal silhouette with head, ears and tail
    px(c,ox,y,15,9,colors[j]);px(c,ox+10,y-5,8,8,colors[j]);
    px(c,ox+11,y-8,3,4,colors[j]);px(c,ox+16,y-7,3,3,'#302820');
    px(c,ox+2,y+8,3,7,'#49372b');px(c,ox+11,y+8,3,7,'#49372b');
    px(c,ox-3,y+2,4,2,colors[j]);
   }
  }
  // Narrow portholes reveal the approaching rain outside the ark
  for(let i=0;i<5;i++){
   const x=32+i*96;px(c,x,34,27,22,'#3a3028');px(c,x+3,37,21,16,'#5f8790');
   px(c,x+12,37,3,16,'#a58a61');px(c,x+3,44,21,3,'#a58a61');
  }
  for(let i=0;i<18;i++){
   const x=(i*31+t*24)%512,y=5+(i*17)%26;
   px(c,x,y,2,7,'#9bb8b5');
  }
  px(c,0,232,512,12,'#3b2c25');
 }else if(id==='moses'){
  px(c,0,0,512,288,'#223d57');px(c,0,0,512,70,'#314c61');
  // towering parted waters, banks and walkable dry path
  px(c,0,55,144,233,'#285c7a');px(c,368,55,144,233,'#285c7a');
  for(let y=60;y<280;y+=13){for(let x=0;x<142;x+=22)px(c,x+(y%3)*3,y,18,3,'#79b1bd');for(let x=370;x<512;x+=22)px(c,x,y,18,3,'#79b1bd');}
  px(c,144,58,12,225,'#a5c7c5');px(c,356,58,12,225,'#a5c7c5');
  px(c,156,70,200,218,'#c8b58a');px(c,166,72,180,216,'#e1d1a7');
  for(let i=0;i<24;i++)rock(c,170+(i*53)%175,90+(i*31)%180,12,9);
  for(let i=0;i<15;i++){px(c,5+i*33,60+(i%4)*42,20,2,'#b4d8d7');}
 }else if(id==='jesus'){
  px(c,0,0,512,288,'#9da77e');px(c,0,0,512,96,'#b8b88e');
  for(let i=0;i<6;i++)building(c,15+i*88,65+(i%2)*7,58,67,'#b99b72');
  px(c,0,157,512,22,'#6e8c68');px(c,0,179,512,109,'#8a9569');
  // village square and olive trees
  px(c,0,206,512,40,'#b99c70');for(let i=0;i<7;i++)tree(c,40+i*76,175,.55);
  for(let i=0;i<5;i++)bush(c,20+i*118,252,'#4b6a45');
 }else if(id==='jacob'){
  px(c,0,0,512,288,'#20283d');for(let i=0;i<100;i++){let x=(i*67)%512,y=(i*37)%170;px(c,x,y,2,2,'#e9dfb9');}
  px(c,0,172,512,116,'#4d5360');px(c,0,188,512,35,'#456b78');px(c,0,195,512,4,'#91b3b1');
  for(let i=0;i<8;i++)rock(c,i*73,234+(i%2)*18,30,18);
  for(let i=0;i<4;i++){px(c,45+i*125,100,20,60,'#2e3540');px(c,36+i*125,92,38,14,'#41464d');}
  px(c,0,260,512,28,'#353c4b');
 }else if(id==='bread'){
  px(c,0,0,512,288,'#b9a06d');px(c,0,0,512,90,'#c9b27e');
  for(let i=0;i<7;i++){let x=25+i*72;px(c,x,90+(i%2)*15,35,20,'#7c684c');px(c,x+4,85+(i%2)*15,27,7,'#d5bd8a');}
  px(c,0,180,512,108,'#8f7954');px(c,0,180,512,8,'#c0a575');
  for(let i=0;i<9;i++){let x=15+i*58;px(c,x,208+(i%3)*13,24,16,'#9d7446');px(c,x+3,203+(i%3)*13,18,6,'#e0c28d');}
  for(let i=0;i<12;i++){let x=(i*43)%500;px(c,x,160+(i%3)*13,8,12,'#6b6250');px(c,x+1,153+(i%3)*13,6,8,'#c18c68');}
 }else{
  px(c,0,0,512,288,'#b4a27c');px(c,0,0,512,80,'#c2b18b');
  // distant hills, tents and two camps
  for(let i=0;i<5;i++){px(c,i*112,65+(i%2)*9,92,54,'#7d8269');px(c,i*112+8,74+(i%2)*9,76,45,'#a39b76');}
  for(let i=0;i<6;i++){let x=15+i*84;px(c,x,122,52,40,'#8c6749');px(c,x-5,118,62,8,'#594638');px(c,x+22,128,8,34,'#574638');}
  px(c,0,180,512,108,'#928260');px(c,0,180,512,9,'#c2a779');
  for(let i=0;i<9;i++)rock(c,i*61+20,232+(i%3)*9,24,13);
 }
 // edge frame, subtle animated ambient motes
 c.globalAlpha=.16;for(let i=0;i<22;i++){let x=(i*71+t*(id==='moses'?8:1.5))%512,y=(i*43+Math.sin(t+i)*3)%288;px(c,x,y,2,2,'#fff1c5');}c.globalAlpha=1;
}

function edenWorld(c,t){
 const W=900,H=560;
 px(c,0,0,W,H,'#527b49');
 // distant canopy and rolling garden terraces
 px(c,0,0,W,112,'#9dbb91');px(c,0,94,W,38,'#789d6d');
 for(let i=0;i<14;i++){tree(c,24+i*66,137+(i%3)*8,.8+(i%2)*.15);}
 // winding river with banks, shallows and moving highlights
 px(c,0,290,W,98,'#386f68');px(c,0,301,W,76,'#579c91');
 for(let i=0;i<30;i++){const x=(i*43+t*9)%W;px(c,x,315+Math.sin(i+t*1.5)*18,25,3,'#a8d3b4');px(c,(x+17)%W,348+Math.cos(i+t)*12,16,2,'#d4e5bc');}
 // walkable stone bridges and stepping stones
 px(c,350,286,100,110,'#bba77a');px(c,358,291,84,100,'#d1bd8d');
 for(let i=0;i<6;i++)rock(c,370+i*13,305+(i%2)*46,14,10);
 // upper terrace, paths and flowering meadow
 px(c,0,390,W,170,'#456b43');px(c,0,405,W,155,'#5c8149');
 px(c,0,448,900,36,'#b9a57b');px(c,0,455,900,20,'#d0bd91');
 for(let i=0;i<45;i++){const x=(i*97)%W,y=405+(i*29)%140;px(c,x,y,3,3,['#e7d68b','#e6b9a5','#d9d9a4'][i%3]);}
 // distinct grove of life and knowledge, with stone borders
 tree(c,215,270,1.85);tree(c,690,268,2.0);
 for(let i=0;i<10;i++){bush(c,150+i*34,326,'#315b3d');bush(c,620+i*24,326,'#315b3d');}
 // eastern locked gate and ancient stone marker
 px(c,805,380,8,80,'#71543a');px(c,845,380,8,80,'#71543a');px(c,805,380,48,7,'#c5a66e');
 px(c,820,420,18,35,'#8c8b75');px(c,824,425,10,3,'#d7cba5');
 // animal clearing
 for(let i=0;i<4;i++){const x=90+i*72,y=205+(i%2)*30;px(c,x,y,16,9,'#b68a5d');px(c,x+2,y-6,9,7,'#c99f70');px(c,x+8,y-9,5,5,'#c99f70');px(c,x+4,y+7,2,6,'#49392c');px(c,x+12,y+7,2,6,'#49392c');}
 // trees, vines, flowers and canopy details
 for(let i=0;i<26;i++){const x=(i*137+40)%W,y=170+(i*61)%210;bush(c,x,y,'#38633d');}
 // gentle light shafts
 c.globalAlpha=.08;for(let i=0;i<7;i++){c.fillStyle='#fff1b5';c.beginPath();c.moveTo(80+i*130,0);c.lineTo(130+i*130,0);c.lineTo(240+i*130,390);c.lineTo(190+i*130,390);c.fill();}c.globalAlpha=1;
}
function character(c,name,x,y,dir,frame,action,t){
 const base={
 explorer:{skin:'#b77d55',hair:'#34271f',robe:'#526e75',trim:'#d4b77b'},
 eve:{skin:'#c58c65',hair:'#493025',robe:'#78965a',trim:'#d8c28c'},
 adam:{skin:'#b77c53',hair:'#513528',robe:'#96724b',trim:'#d9bd83'},
 noah:{skin:'#bd8a63',hair:'#ddd0ae',robe:'#78604a',trim:'#e1c18b',beard:'#ddd0ae'},
 moses:{skin:'#a96e4d',hair:'#382a24',robe:'#53677d',trim:'#d9bd86',beard:'#c6b89b',staff:true},
 jacob:{skin:'#bd835b',hair:'#39271f',robe:'#78634d',trim:'#d7b980'},
 jesus:{skin:'#c18a68',hair:'#49332a',robe:'#e0d1ae',trim:'#9d7655',beard:'#49332a'},
 david:{skin:'#b97e58',hair:'#583727',robe:'#66805a',trim:'#e2c48c'},
 goliath:{skin:'#9b694e',hair:'#382c29',robe:'#766c60',trim:'#b9a27c',large:true}
 }[name]||{skin:'#b77d55',hair:'#34271f',robe:'#526e75',trim:'#d4b77b'};
 const s=base.large?1.35:1, bob=action==='talk'?Math.sin(t*10)*1.2:action==='interact'?Math.sin(t*13)*1.5:action==='special'?Math.sin(t*8)*1.4:frame%2?0.7:0;
 c.save();c.translate(Math.round(x),Math.round(y+bob));c.scale(s,1);
 c.fillStyle='#17221d99';c.beginPath();c.ellipse(0,-2,11,4,0,0,Math.PI*2);c.fill();
 const step=action==='walk'?Math.sin(t*15)*3:action==='special'?Math.sin(t*8)*2:0;
 px(c,-7,-8+step,5,7,'#44362e');px(c,2,-8-step,5,7,'#44362e');
 px(c,-8,-22,16,16,base.robe);px(c,-9,-21,18,4,base.trim);px(c,-7,-13,14,2,'#453d34');
 if(dir===1||dir===2){px(c,dir===1?-10:7,-19,4,10,base.skin);px(c,dir===1?-11:8,-10,5,3,base.skin);}
 else{px(c,-10,-20,4,10,base.skin);px(c,6,-20,4,10,base.skin);}
 px(c,-6,-34,12,12,base.skin);px(c,-7,-36,14,5,base.hair);px(c,-7,-32,3,7,base.hair);px(c,4,-32,3,7,base.hair);
 if(base.beard)px(c,-5,-25,10,5,base.beard);
 if(base.staff){px(c,11,-37,2,34,'#805c39');px(c,10,-39,4,3,'#c9a56e');}
 if(action==='talk'){px(c,dir===1?-9:6,-28,3,2,'#f4e6ca');}
 if(action==='interact'){px(c,dir===1?-13:9,-20,5,4,base.skin);}
 if(action==='special'){px(c,-12,-42,24,2,'#f0d28b');px(c,-15,-39,2,8,'#f0d28b');px(c,13,-39,2,8,'#f0d28b');}
 if(dir===0||dir===3){px(c,-3,-30,2,2,'#30251f');px(c,3,-30,2,2,'#30251f');}else px(c,dir===1?-5:3,-30,2,2,'#30251f');
 c.restore();
}
window.TLSArt={scene,character,edenWorld};
})();