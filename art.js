(()=>{
'use strict';
const px=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const palettes={
 eden:['#263d2c','#476b3e','#72934c','#b5b66b','#d9b77a'],
 noah:['#342b28','#60473a','#9b7250','#c69a68','#e0bd85'],
 moses:['#263b50','#426a80','#83a9b0','#d5c28f','#e8d6ad'],
 jesus:['#485d61','#8b9b87','#c5b78e','#d7b98e','#eee0c2'],
 jacob:['#292f45','#535a72','#8a7c73','#c49b76','#e3c8a2'],
 bread:['#5a4632','#8a6945','#b28a58','#d6b879','#f0dfb4'],
 david:['#354b3e','#607b56','#9d9b6b','#c7a779','#e6d4ae']
};
function scene(c,id,t){
 const p=palettes[id]||palettes.eden;
 const sky=id==='moses'?'#243c56':id==='jacob'?'#20263c':id==='david'?'#b5a17b':id==='bread'?'#c6a875':'#9eb5a0';
 px(c,0,0,512,288,sky);
 if(id==='eden'){
  px(c,0,0,512,104,'#9ab99b');px(c,0,78,512,210,'#54794c');
  for(let i=0;i<9;i++){let x=i*67-12;px(c,x,45+(i%3)*8,34,58,'#31583d');px(c,x+7,31+(i%3)*8,22,38,'#4f7c49');px(c,x+13,20+(i%3)*8,10,18,'#8aa45b');}
  px(c,0,205,512,48,'#547b72');px(c,0,216,512,15,'#81a9a0');for(let i=0;i<30;i++)px(c,(i*37)%512,220+(i%4)*5,12,2,'#b6d0b3');
  px(c,232,72,48,78,'#66472e');px(c,214,55,84,44,'#426d3c');px(c,220,40,70,38,'#6e8d45');
 }else if(id==='noah'){
  px(c,0,0,512,288,'#56483a');px(c,0,20,512,244,'#76583e');
  for(let y=32;y<260;y+=28){px(c,0,y,512,3,'#b08a5c');for(let x=12;x<512;x+=64)px(c,x,y+4,4,22,'#4c392e');}
  px(c,20,25,472,10,'#3b3029');px(c,25,250,462,12,'#3b3029');
  for(let i=0;i<7;i++){px(c,40+i*67,78+(i%2)*45,30,22,'#a77c50');px(c,44+i*67,73+(i%2)*45,22,7,'#d3ae76');}
 }else if(id==='moses'){
  px(c,0,0,512,288,'#28445b');px(c,0,0,512,50,'#25374c');
  px(c,0,60,170,228,'#315e78');px(c,342,60,170,228,'#315e78');
  for(let i=0;i<18;i++){let y=60+i*12;px(c,0,y,166,2,'#7197a0');px(c,346,y,166,2,'#7197a0');}
  px(c,168,55,176,225,'#c4b58d');px(c,180,55,152,225,'#e0d0a6');
  for(let i=0;i<18;i++)px(c,190+(i*41)%130,70+(i*29)%190,8,3,'#f2e3bd');
 }else if(id==='jesus'){
  px(c,0,0,512,288,'#a4ad87');px(c,0,154,512,134,'#8b986e');
  for(let i=0;i<8;i++){let x=i*70;px(c,x+12,76,48,70,'#a88761');px(c,x+7,68,58,12,'#705a46');px(c,x+18,90,36,56,'#d0b78b');}
  px(c,0,205,512,34,'#687d55');px(c,0,239,512,49,'#4c694a');
 }else if(id==='jacob'){
  px(c,0,0,512,288,'#252d43');px(c,0,184,512,104,'#3e4656');
  for(let i=0;i<90;i++){let x=(i*67)%512,y=(i*37)%150;px(c,x,y,2,2,'#e9d9a9');}
  px(c,0,204,512,22,'#435d68');px(c,0,210,512,5,'#78919a');px(c,0,226,512,3,'#667d89');
  px(c,340,70,24,130,'#272d39');px(c,330,62,44,22,'#363b48');
 }else if(id==='bread'){
  px(c,0,0,512,288,'#b99c68');px(c,0,176,512,112,'#8e754f');
  for(let i=0;i<18;i++){let x=(i*83)%512,y=70+(i*43)%130;px(c,x,y,28,22,'#9b7953');px(c,x+4,y-5,20,8,'#c8a779');}
  px(c,0,215,512,5,'#6e6449');for(let i=0;i<8;i++){px(c,35+i*62,190,24,20,'#9c7142');px(c,39+i*62,184,16,8,'#e2c28a');}
 }else{
  px(c,0,0,512,288,'#b4a17a');px(c,0,172,512,116,'#8d805f');
  for(let i=0;i<7;i++){let x=i*82;px(c,x+5,68,58,104,'#776b59');px(c,x,62,68,12,'#554f48');px(c,x+14,90,40,8,'#c2ad83');}
  px(c,0,220,512,18,'#70664f');px(c,0,238,512,50,'#81704f');
 }
 // atmospheric foreground, shadows and drifting motes
 c.globalAlpha=.16;for(let i=0;i<18;i++){let x=(i*71+t*(id==='moses'?5:2))%512,y=(i*43+Math.sin(t+i)*3)%288;px(c,x,y,2,2,'#fff1c5');}c.globalAlpha=1;
}
function character(c,name,x,y,dir,frame,action,t){
 const base={
 explorer:{skin:'#b77d55',hair:'#34271f',robe:'#526e75',trim:'#d4b77b',cape:'#31464d'},
 eve:{skin:'#c58c65',hair:'#493025',robe:'#78965a',trim:'#d8c28c'},
 adam:{skin:'#b77c53',hair:'#513528',robe:'#96724b',trim:'#d9bd83'},
 noah:{skin:'#bd8a63',hair:'#ddd0ae',robe:'#78604a',trim:'#e1c18b',beard:'#ddd0ae'},
 moses:{skin:'#a96e4d',hair:'#382a24',robe:'#53677d',trim:'#d9bd86',beard:'#c6b89b',staff:true},
 jacob:{skin:'#bd835b',hair:'#39271f',robe:'#78634d',trim:'#d7b980'},
 jesus:{skin:'#c18a68',hair:'#49332a',robe:'#e0d1ae',trim:'#9d7655',beard:'#49332a'},
 david:{skin:'#b97e58',hair:'#583727',robe:'#66805a',trim:'#e2c48c'},
 goliath:{skin:'#9b694e',hair:'#382c29',robe:'#766c60',trim:'#b9a27c',large:true}
 }[name]||{skin:'#b77d55',hair:'#34271f',robe:'#526e75',trim:'#d4b77b'};
 const s=base.large?1.28:1, bob=action==='talk'?Math.sin(t*10)*1.5:action==='interact'?Math.sin(t*13)*2:frame%2?1:0;
 c.save();c.translate(Math.round(x),Math.round(y+bob));c.scale(s,1);
 // cast shadow, feet and tunic, direction changes body profile
 c.fillStyle='#17221dcc';c.beginPath();c.ellipse(0,-2,11,4,0,0,Math.PI*2);c.fill();
 const step=action==='walk'?Math.sin(t*15)*3:action==='special'?Math.sin(t*8)*2:0;
 px(c,-7,-8+step,5,7,'#44362e');px(c,2,-8-step,5,7,'#44362e');
 px(c,-8,-22,16,16,base.robe);px(c,-9,-21,18,4,base.trim);px(c,-7,-13,14,2,'#453d34');
 if(dir===1||dir===2){px(c,dir===1?-10:7,-19,4,10,base.skin);px(c,dir===1?-11:8,-10,5,3,base.skin);}
 else{px(c,-10,-20,4,10,base.skin);px(c,6,-20,4,10,base.skin);}
 px(c,-6,-34,12,12,base.skin);px(c,-7,-36,14,5,base.hair);px(c,-7,-32,3,7,base.hair);px(c,4,-32,3,7,base.hair);
 if(base.beard)px(c,-5,-25,10,5,base.beard);
 if(name==='eve'||name==='mary')px(c,-8,-37,16,5,'#6c4935');
 if(base.staff){px(c,11,-37,2,34,'#805c39');px(c,10,-39,4,3,'#c9a56e');}
 if(name==='david')px(c,-9,-23,18,3,'#d5bb75');
 if(action==='talk'){px(c,dir===1?-9:6,-28,3,2,'#f4e6ca');}
 if(action==='interact'){px(c,dir===1?-13:9,-20,5,4,base.skin);}
 if(action==='special'){px(c,-12,-42,24,2,'#f0d28b');px(c,-15,-39,2,8,'#f0d28b');px(c,13,-39,2,8,'#f0d28b');}
 // face direction, eye pixels
 if(dir===0||dir===3){px(c,-3,-30,2,2,'#30251f');px(c,3,-30,2,2,'#30251f');}
 else px(c,dir===1?-5:3,-30,2,2,'#30251f');
 c.restore();
}
window.TLSArt={scene,character};
})();