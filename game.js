(()=>{
'use strict';
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),overlay=document.querySelector('#overlay'),panel=document.querySelector('#panel'),chapterLabel=document.querySelector('#chapter'),objective=document.querySelector('#objective');
ctx.imageSmoothingEnabled=true;canvas.width=1024;canvas.height=576;ctx.scale(2,2);
const W=512,H=288,TILE=16,SAVE='tls_save_v3';
const chapters=[
{id:'eden',title:'01 · O JARDIM DO ÉDEN',name:'O Jardim do Éden',ref:'Gênesis 2–3',goal:'Explore as clareiras, encontre três sinais da criação e alcance a árvore do conhecimento.',intro:'O jardim se estende por terraços, rios e clareiras. Eva pediu que você observasse a vida ao redor e reunisse três pistas antes de atravessar a ponte antiga.',npc:'Eva',npcSprite:'eve',bg:'eden',spots:[{x:150,y:220,label:'Clareira dos animais',kind:'animals'},{x:405,y:345,label:'Rio e quatro nascentes',kind:'river'},{x:215,y:270,label:'Árvore da vida',kind:'tree'},{x:690,y:268,label:'Árvore do conhecimento',kind:'choice'}],walls:[],puzzle:'eden'},
{id:'noah',title:'02 · A ARCA DE NOÉ',name:'A Arca de Noé',ref:'Gênesis 6–9',goal:'Explore a arca, organize os espaços e encontre o sinal da aliança.',intro:'A arca está pronta para a jornada. Noé precisa de ajuda para organizar os espaços e verificar os suprimentos.',npc:'Noé',npcSprite:'noah',bg:'noah',spots:[{x:92,y:150,label:'Planta da arca',kind:'plan'},{x:255,y:210,label:'Compartimentos',kind:'pairs'},{x:415,y:150,label:'Janela da arca',kind:'rainbow'}],walls:[[0,0,512,18],[0,270,512,18],[0,0,18,288],[494,0,18,288],[150,60,25,110],[330,120,24,95]],puzzle:'noah'},
{id:'moses',title:'03 · A TRAVESSIA DO MAR',name:'A Travessia do Mar Vermelho',ref:'Êxodo 12–14',goal:'Leia os marcos e encontre o caminho seguro até a outra margem.',intro:'O povo está diante do mar. Observe os marcos da jornada e encontre a rota aberta na narrativa.',npc:'Moisés',npcSprite:'moses',bg:'moses',spots:[{x:85,y:220,label:'Acampamento',kind:'camp'},{x:255,y:150,label:'Caminho entre as águas',kind:'route'},{x:425,y:220,label:'Outra margem',kind:'shore'}],walls:[[0,0,512,16],[0,272,512,16],[0,0,16,288],[496,0,16,288]],puzzle:'moses'},
{id:'jesus',title:'04 · OS ENSINAMENTOS DE JESUS',name:'A vida e os ensinamentos de Jesus',ref:'Evangelhos',goal:'Descubra três histórias e conecte cada uma à sua mensagem.',intro:'Visite os lugares da vila e conheça histórias sobre misericórdia, confiança e acolhimento.',npc:'Discípulo',npcSprite:'jesus',bg:'jesus',spots:[{x:90,y:150,label:'O Bom Samaritano',kind:'story1'},{x:256,y:220,label:'A tempestade acalmada',kind:'story2'},{x:420,y:150,label:'O filho pródigo',kind:'story3'}],walls:[[0,0,512,18],[0,270,512,18],[0,0,18,288],[494,0,18,288],[165,55,45,42],[320,180,45,42]],puzzle:'jesus'},
{id:'jacob',title:'05 · JACÓ E A LUTA DURANTE A NOITE',name:'Jacó e a luta durante a noite',ref:'Gênesis 32:22–32',goal:'Explore o acampamento e acompanhe o encontro que dura até o amanhecer.',intro:'Jacó fica sozinho durante a noite. Descubra o que ficou para trás e prepare-se para o encontro junto ao rio.',npc:'Jacó',npcSprite:'jacob',bg:'jacob',spots:[{x:88,y:150,label:'Acampamento',kind:'camp'},{x:256,y:220,label:'Margem do rio',kind:'struggle'},{x:420,y:150,label:'Amanhecer',kind:'name'}],walls:[[0,0,512,18],[0,270,512,18],[0,0,18,288],[494,0,18,288],[160,75,40,28],[330,70,40,28]],puzzle:'jacob'},
{id:'bread',title:'06 · PÃES E PEIXES',name:'A multiplicação dos pães e peixes',ref:'João 6:1–14',goal:'Ajude a organizar a distribuição e descubra o que restou.',intro:'Uma multidão está reunida. Ajude a organizar os grupos para que a distribuição aconteça com cuidado.',npc:'Discípulo',npcSprite:'jesus',bg:'bread',spots:[{x:88,y:150,label:'Cestos',kind:'baskets'},{x:256,y:220,label:'Multidão',kind:'crowd'},{x:420,y:150,label:'Cestos recolhidos',kind:'leftovers'}],walls:[[0,0,512,18],[0,270,512,18],[0,0,18,288],[494,0,18,288],[155,65,36,28],[320,190,36,28]],puzzle:'bread'},
{id:'david',title:'07 · DAVI E GOLIAS',name:'Davi e Golias',ref:'1 Samuel 17',goal:'Conheça as escolhas de Davi e complete o desafio simbólico de precisão.',intro:'Davi se apresenta para enfrentar Golias. Explore o acampamento, ouça sua decisão e complete o desafio final de foco.',npc:'Davi',npcSprite:'david',bg:'david',spots:[{x:88,y:150,label:'Acampamento',kind:'camp'},{x:256,y:220,label:'Preparação',kind:'focus'},{x:420,y:150,label:'Desafio final',kind:'final'}],walls:[[0,0,512,18],[0,270,512,18],[0,0,18,288],[494,0,18,288],[155,60,40,30],[320,185,40,30]],puzzle:'david'}
];
const images={},sprites={};
for(const ch of chapters){const im=new Image();im.src='assets/scenes/'+ch.bg+'.png';images[ch.id]=im;}
for(const n of ['explorer','adam','eve','noah','moses','jacob','jesus','david','goliath']){const im=new Image();im.src='assets/characters/'+n+'_walk_4dir.png';sprites[n]=im;}
let state={chapter:0,x:52,y:228,dir:0,frame:0,walk:0,found:[],done:[],mode:'menu',cameraX:0,cameraY:0,near:null,challenge:0,seq:[],lastKey:'',timer:0,action:'idle',actionUntil:0,edenBridge:false};
const keys={};let last=0;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function save(){try{localStorage.setItem(SAVE,JSON.stringify({chapter:state.chapter,found:state.found,done:state.done,edenBridge:state.edenBridge}));}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem(SAVE)||'null');if(d){state.chapter=Math.min(6,Math.max(0,d.chapter|0));state.found=Array.isArray(d.found)?d.found:[];state.done=Array.isArray(d.done)?d.done:[];state.edenBridge=!!d.edenBridge;}}catch(e){}}
function show(title,body,buttons){panel.innerHTML='<h2>'+title+'</h2>'+body+'<div class="choices">'+buttons+'</div>';overlay.classList.remove('hidden');}
function hide(){overlay.classList.add('hidden');}
function button(id,fn){const el=document.getElementById(id);if(el)el.onclick=fn;}
function setHud(){const ch=chapters[state.chapter];chapterLabel.textContent=ch.title;objective.innerHTML='<strong>'+ch.name.toUpperCase()+'</strong>'+ch.goal;}
function begin(fresh){if(fresh){state.chapter=0;state.found=[];state.done=[];state.edenBridge=false;localStorage.removeItem(SAVE);}else load();state.x=state.chapter===0?400:52;state.y=state.chapter===0?480:242;state.cameraX=0;state.cameraY=0;state.mode='play';state.challenge=0;setHud();hide();save();}
function sprite(name,x,y,dir,frame,scale=1,action='idle'){if(window.TLSArt)window.TLSArt.character(ctx,name,x,y,dir,frame,action,performance.now()/1000);}
function collides(x,y){const ch=chapters[state.chapter];const box={x:x-7,y:y-5,w:14,h:10};if(state.chapter===0){if(x<24||x>876||y<145||y>525)return true;if(y>285&&y<395&&!(x>345&&x<455))return true;if(!state.edenBridge&&x>550&&y>145&&y<390)return true;if(x>790&&y>365&&!state.edenBridge)return true;return false;}if(y<128||y>258||x<25||x>487)return true;return ch.walls.some(([a,b,w,h])=>box.x<a+w&&box.x+box.w>a&&box.y<b+h&&box.y+box.h>b);}
function move(dx,dy,dt){const speed=75;let nx=state.x+dx*speed*dt,ny=state.y+dy*speed*dt;if(!collides(nx,state.y))state.x=nx;if(!collides(state.x,ny))state.y=ny;if(state.chapter===0){state.x=Math.max(24,Math.min(876,state.x));state.y=Math.max(145,Math.min(525,state.y));}else{state.x=Math.max(25,Math.min(487,state.x));state.y=Math.max(28,Math.min(258,state.y));}if(dx||dy){state.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);state.walk+=dt*9;state.frame=Math.floor(state.walk)%4;state.action='walk';}else{state.frame=Math.floor(performance.now()/420)%2; if(performance.now()>state.actionUntil)state.action='idle';}}
function npc(){return state.chapter===0?{x:110,y:260}:{x:256,y:state.chapter===2?112:state.chapter===4?126:state.chapter===6?124:132};}
function findNear(){const ch=chapters[state.chapter],p={x:state.x,y:state.y};let nearest=null,best=state.chapter===0?38:32;for(let i=0;i<ch.spots.length;i++){if(state.found.includes(i))continue;const q=ch.spots[i],d=dist(p,q);if(d<best){best=d;nearest={...q,index:i};}}const n=npc(),nd=dist(p,n);if(nd<28&&(!nearest||nd<best))nearest={...n,npc:true};return nearest;}
function startChapter(){const ch=chapters[state.chapter];show(ch.name,'<p>'+ch.intro+'</p><p class="small">Referência bíblica: '+ch.ref+'</p>','<button id="enter">EXPLORAR</button>');button('enter',hide);}
function finishSpot(i){const ch=chapters[state.chapter];if(!state.found.includes(i))state.found.push(i);if(state.chapter===0&&state.found.filter(v=>v<3).length===3){state.edenBridge=true;}save();show(ch.spots[i].label,'<p>'+spotText(state.chapter,i)+'</p><p class="small">'+ch.ref+'</p>','<button id="ok">CONTINUAR</button>');button('ok',()=>{hide();checkComplete();});}
function spotText(c,i){const texts=[
['Os animais e as criaturas vivas fazem parte do jardim descrito em Gênesis 2:19–20. Observe os diferentes seres que habitam esta clareira.','Um rio saía do Éden para regar o jardim e se dividia em quatro braços (Gênesis 2:10–14).','A árvore da vida aparece entre as árvores do jardim (Gênesis 2:9).','A narrativa apresenta um mandamento específico sobre a árvore do conhecimento do bem e do mal (Gênesis 2:16–17).'],
['Noé recebe instruções para construir a arca (Gênesis 6:14–16).','A narrativa descreve a entrada dos animais na arca (Gênesis 7:8–9).','O arco-íris é apresentado como sinal da aliança (Gênesis 9:12–17).'],
['O povo parte do Egito depois da Páscoa (Êxodo 12).','O relato descreve a passagem pelo mar em terra seca (Êxodo 14:21–22).','O povo chega à outra margem (Êxodo 14:29–31).'],
['A parábola ensina a demonstrar misericórdia e cuidado com o próximo (Lucas 10:25–37).','Jesus acalma o vento e o mar (Marcos 4:35–41).','O pai recebe o filho que retorna com compaixão (Lucas 15:11–32).'],
['Jacó envia sua família e permanece junto ao ribeiro (Gênesis 32:22–24).','O encontro dura até o romper do dia (Gênesis 32:24–26).','Jacó recebe o nome Israel (Gênesis 32:28).'],
['Cinco pães e dois peixes são apresentados (João 6:9).','Jesus dá graças e os alimentos são distribuídos (João 6:11).','Doze cestos recolhem os pedaços que sobraram (João 6:12–13).'],
['Davi demonstra confiança no Senhor (1 Samuel 17:37).','Davi deixa de lado a armadura que não estava acostumado a usar (1 Samuel 17:38–40).','Davi enfrenta Golias e vence (1 Samuel 17:45–50).']
];return texts[c][i];}
function interact(){if(state.mode!=='play')return;state.action='interact';state.actionUntil=performance.now()+650;const ch=chapters[state.chapter],q=state.near;if(!q){show('EXPLORE O CENÁRIO','<p>Procure objetos brilhantes e aproxime-se deles. Pressione E para examinar. Também pode conversar com o personagem próximo.</p>','<button id="ok">VOLTAR</button>');button('ok',hide);return;}if(q.npc){state.action='talk';state.actionUntil=performance.now()+1200;if(state.chapter===0){show('EVA · O JARDIM','<p>Este jardim está cheio de vida. Observe os animais, siga o rio que rega a terra e examine a árvore da vida. Três pistas revelarão a passagem para a clareira oriental.</p><p class="small">Explore com as setas ou WASD. Aproxime-se dos pontos brilhantes e pressione E.</p>','<button id="ok">VOU EXPLORAR</button>');button('ok',hide);}else startChapter();return;}const i=q.index;if(state.found.includes(i))return;const kind=q.kind;
if(state.chapter===0&&kind==='river'){puzzleRiver(i);return;}if(state.chapter===0&&kind==='choice'){if(!state.edenBridge){show('A PONTE AINDA ESTÁ FECHADA','<p>Antes de atravessar, encontre as três pistas nas clareiras do jardim: observe os animais, siga o rio e examine a árvore da vida.</p>','<button id="ok">VOLTAR AO JARDIM</button>');button('ok',hide);return;}puzzleEden(i);return;}if(kind==='pairs'){puzzleNoah(i);return;}if(kind==='route'){puzzleMoses(i);return;}if(kind.startsWith('story')){puzzleJesus(i);return;}if(kind==='struggle'){puzzleJacob(i);return;}if(kind==='crowd'){puzzleBread(i);return;}if(kind==='focus'){puzzleDavid(i);return;}finishSpot(i);}
function puzzleRiver(i){state.mode='puzzle';const selected=new Set();const names=['PISOM','GIOM','TIGRE','EUFRATES','JORDÃO'];const render=()=>{show('AS QUATRO NASCENTES','<p>O rio que saía do Éden se dividia em quatro braços. Marque os quatro nomes citados em Gênesis 2:10–14.</p><p class="small">Selecione quatro opções e confirme sua observação.</p>',names.map((n,j)=>'<button data-river="'+j+'" aria-pressed="'+selected.has(j)+'" style="'+(selected.has(j)?'background:#b18b50;color:#fff':'')+'">'+(selected.has(j)?'✓ ':'')+n+'</button>').join('')+'<button id="confirmRivers">CONFIRMAR</button>');panel.querySelectorAll('[data-river]').forEach(b=>b.onclick=()=>{const j=+b.dataset.river;if(selected.has(j))selected.delete(j);else if(selected.size<4)selected.add(j);render();});button('confirmRivers',()=>{const right=[0,1,2,3].every(j=>selected.has(j))&&selected.size===4;if(right){state.mode='play';state.action='special';state.actionUntil=performance.now()+900;finishSpot(i);}else{show('RELEIA A DESCRIÇÃO','<p>Confira Gênesis 2:10–14. O texto apresenta quatro rios que saem do rio do Éden.</p>','<button id="retry">TENTAR NOVAMENTE</button>');button('retry',()=>{selected.clear();render();});}});};render();}
function puzzleEden(i){state.mode='puzzle';show('A ESCOLHA NO JARDIM','<p>Você reuniu as três pistas e atravessou a ponte. O relato apresenta duas árvores especiais. Qual delas está ligada ao mandamento de Gênesis 2:16–17?</p>','<button data-eden="life">Árvore da vida</button><button data-eden="knowledge">Árvore do conhecimento do bem e do mal</button>');panel.querySelectorAll('[data-eden]').forEach(b=>b.onclick=()=>{if(b.dataset.eden==='knowledge'){state.mode='play';state.action='special';state.actionUntil=performance.now()+900;finishSpot(i);}else{show('RELEIA GÊNESIS 2:16–17','<p>O texto distingue a árvore da vida da árvore do conhecimento do bem e do mal. Tente identificar qual aparece no mandamento.</p>','<button id="retry">TENTAR NOVAMENTE</button>');button('retry',()=>puzzleEden(i));}});}
function puzzleNoah(i){
 state.mode='puzzle';state.challenge=0;
 const rounds=[
  {title:'BAIA DOS ANIMAIS TERRESTRES',q:'O primeiro compartimento precisa receber um par de animais terrestres da mesma espécie.',a:['Dois leões','Um leão e uma ave','Um peixe e uma ave'],ok:0,feedback:'O par de leões pertence ao grupo dos animais terrestres.'},
  {title:'ESPAÇO DAS AVES',q:'Agora organize o espaço reservado às aves.',a:['Dois peixes','Duas aves','Um cavalo e uma ave'],ok:1,feedback:'As aves ficam juntas em seu próprio espaço.'},
  {title:'SUPRIMENTOS DA JORNADA',q:'Antes da chuva, Noé também precisa conferir os suprimentos para a viagem.',a:['Água e alimento armazenados','Pedras e ferramentas sem uso','Objetos espalhados pelo convés'],ok:0,feedback:'Água e alimento organizados ajudam a cuidar de todos durante a jornada.'}
 ];
 const render=()=>{
  const r=rounds[state.challenge];
  show('A ARCA DE NOÉ · ORGANIZAÇÃO '+(state.challenge+1)+' / 3',
   '<div class="ark-progress" aria-label="Progresso da organização"><div style="width:'+((state.challenge)/3*100)+'%"></div></div><p class="small">COMPARTIMENTO '+(state.challenge+1)+' DE 3</p><h3>'+r.title+'</h3><p>'+r.q+'</p><p class="small">Gênesis 6:19–21; 7:2–3</p>',
   r.a.map((a,j)=>'<button data-choice="'+j+'">'+a+'</button>').join(''));
  panel.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
   if(+b.dataset.choice===r.ok){
    state.challenge++;
    if(state.challenge===rounds.length){
     state.mode='play';state.action='special';state.actionUntil=performance.now()+1300;
     show('A ARCA ESTÁ ORGANIZADA','<p>Os compartimentos foram preparados e os suprimentos conferidos.</p><p class="small">A chuva se aproxima. Noé e sua família estão prontos para a jornada.</p>','<button id="arkDone">CONTINUAR</button>');
     button('arkDone',()=>finishSpot(i));
    }else{
     show('BOA ORGANIZAÇÃO!','<p>'+r.feedback+'</p><p class="small">O próximo compartimento ainda precisa ser preparado.</p>','<button id="arkNext">PRÓXIMO COMPARTIMENTO</button>');
     button('arkNext',render);
    }
   }else{
    show('VAMOS ORGANIZAR NOVAMENTE','<p>Observe o que este compartimento precisa receber e escolha a opção correspondente.</p>','<button id="arkRetry">TENTAR DE NOVO</button>');
    button('arkRetry',render);
   }
  });
 };
 render();
}
function puzzleMoses(i){
 state.mode='puzzle';state.challenge=0;
 const stages=[
  {title:'ENCONTRE A ABERTURA',question:'As águas estão diante do povo. Qual direção leva ao caminho que se abriu entre elas?',options:['MARGEM OESTE','CAMINHO CENTRAL','MAR ABERTO'],answer:1,success:'O caminho seco está entre as águas.'},
  {title:'ATRAVESSE O CAMINHO SECO',question:'No trecho seguinte, onde o povo deve continuar caminhando?',options:['PELO CAMINHO SECO','DENTRO DA ÁGUA','DE VOLTA AO ACAMPAMENTO'],answer:0,success:'O povo continua pela passagem em terra seca.'},
  {title:'ALCANCE A OUTRA MARGEM',question:'A travessia está quase completa. Qual é o próximo destino?',options:['RETORNAR AO EGITO','PARAR NO MEIO DO MAR','CHEGAR À OUTRA MARGEM'],answer:2,success:'A narrativa conta que o povo chegou à outra margem em segurança.'}
 ];
 const render=()=>{
  const stage=stages[state.challenge];
  show('A TRAVESSIA · ETAPA '+(state.challenge+1)+' DE 3',
   '<div class="moses-progress" role="progressbar" aria-valuemin="0" aria-valuemax="3" aria-valuenow="'+state.challenge+'"><div style="width:'+(state.challenge/3*100)+'%"></div></div><p class="small">ÊXODO 14:21–29</p><h3>'+stage.title+'</h3><p>'+stage.question+'</p>',
   stage.options.map((v,j)=>'<button data-lane="'+j+'">'+v+'</button>').join(''));
  panel.querySelectorAll('[data-lane]').forEach(b=>b.onclick=()=>{
   if(+b.dataset.lane!==stage.answer){
    show('OBSERVE AS ÁGUAS','<p>A passagem deve permanecer no caminho aberto em terra seca. Releia a etapa e tente novamente.</p>','<button id="mosesRetry">TENTAR NOVAMENTE</button>');
    button('mosesRetry',render);
    return;
   }
   state.challenge++;
   if(state.challenge===stages.length){
    state.mode='play';state.action='special';state.actionUntil=performance.now()+1800;
    show('TRAVESSIA CONCLUÍDA','<p>O povo alcançou a outra margem. A passagem pelo mar foi concluída, conforme Êxodo 14:29–31.</p><p class="small">A jornada segue adiante.</p>','<button id="mosesDone">CONTINUAR</button>');
    button('mosesDone',()=>finishSpot(i));
   }else{
    show('ETAPA CONCLUÍDA','<p>'+stage.success+'</p>','<button id="mosesNext">PRÓXIMA ETAPA</button>');
    button('mosesNext',render);
   }
  });
 };
 render();
}
function puzzleJesus(i){
 const stories=[
  {title:'O BOM SAMARITANO',ref:'LUCAS 10:25–37',stages:[
   {q:'Ao encontrar o homem ferido, qual é a primeira atitude do samaritano?',a:['Aproximar-se para ajudar','Ignorar e seguir viagem','Culpar o homem'],ok:0,tip:'O samaritano se aproxima e demonstra compaixão.'},
   {q:'Como ele cuida do homem?',a:['Deixa-o sozinho','Trata seus ferimentos','Pede que caminhe sem ajuda'],ok:1,tip:'Ele trata os ferimentos e cuida dele.'},
   {q:'O que faz em seguida?',a:['Vai embora sem olhar para trás','Leva-o a um lugar seguro e providencia cuidado','Espera que outra pessoa resolva'],ok:1,tip:'Ele o leva a uma hospedaria e se responsabiliza pelo cuidado.'}
  ]},
  {title:'A TEMPESTADE ACALMADA',ref:'MARCOS 4:35–41',stages:[
   {q:'Durante a travessia, o que acontece com o barco?',a:['Começa uma grande tempestade','Chega imediatamente à praia','O céu fica completamente sem nuvens'],ok:0,tip:'Uma forte tempestade ameaça a travessia.'},
   {q:'O que os discípulos fazem?',a:['Abandonam todos os companheiros','Acordam Jesus e pedem ajuda','Começam outra viagem'],ok:1,tip:'Os discípulos acordam Jesus, preocupados com a tempestade.'},
   {q:'O que acontece depois?',a:['Jesus repreende o vento e o mar se acalma','A tempestade fica mais forte','O barco desaparece'],ok:0,tip:'Jesus ordena que o vento e o mar se acalmem.'}
  ]},
  {title:'O FILHO PRÓDIGO',ref:'LUCAS 15:11–32',stages:[
   {q:'Depois de perceber seu erro, o que o filho decide fazer?',a:['Continuar distante','Voltar para a casa do pai','Esquecer sua família'],ok:1,tip:'O filho reconhece sua situação e decide voltar.'},
   {q:'Como o filho se apresenta ao pai?',a:['Reconhece que errou','Exige uma festa','Finge que nada aconteceu'],ok:0,tip:'Ele reconhece seu erro e pede para ser recebido.'},
   {q:'Como o pai reage ao ver o filho?',a:['Recebe-o com compaixão','Finge que não o conhece','Manda-o embora'],ok:0,tip:'O pai o recebe com alegria e compaixão.'}
  ]}
 ];
 const story=stories[i];state.mode='puzzle';state.challenge=0;
 const render=()=>{
  const stage=story.stages[state.challenge];
  show(story.title+' · ETAPA '+(state.challenge+1)+' / 3',
   '<div class="jesus-progress" role="progressbar" aria-label="Progresso da história" aria-valuemin="0" aria-valuemax="3" aria-valuenow="'+state.challenge+'"><div style="width:'+(state.challenge/3*100)+'%"></div></div><p class="small">'+story.ref+'</p><h3>'+['OBSERVE','ESCOLHA A ATITUDE','DESCUBRA O DESFECHO'][state.challenge]+'</h3><p>'+stage.q+'</p>',
   stage.a.map((v,j)=>'<button data-jesus="'+j+'">'+v+'</button>').join(''));
  panel.querySelectorAll('[data-jesus]').forEach(b=>b.onclick=()=>{
   if(+b.dataset.jesus!==stage.ok){
    show('RELEMBRE A HISTÓRIA','<p>Observe os acontecimentos e tente novamente. '+story.ref+'.</p>','<button id="jesusRetry">TENTAR NOVAMENTE</button>');
    button('jesusRetry',render);return;
   }
   state.challenge++;
   if(state.challenge===story.stages.length){
    state.mode='play';state.action='special';state.actionUntil=performance.now()+1100;
    show('HISTÓRIA DESCOBERTA','<p>'+stage.tip+'</p><p class="small">Você concluiu esta parte dos Evangelhos.</p>','<button id="jesusDone">CONTINUAR</button>');
    button('jesusDone',()=>finishSpot(i));
   }else{
    show('VOCÊ AVANÇOU','<p>'+stage.tip+'</p>','<button id="jesusNext">PRÓXIMA ETAPA</button>');
    button('jesusNext',render);
   }
  });
 };
 render();
}
function puzzleJacob(i){
 state.mode='puzzle';state.challenge=0;
 const stages=[
  {title:'A NOITE NO ACAMPAMENTO',question:'Antes do encontro, o que Jacó faz ao ficar sozinho durante a noite?',options:['Segue viagem sem parar','Permanece sozinho, preparando-se para o encontro','Volta imediatamente para casa'],answer:1,success:'Jacó fica sozinho naquela noite, junto ao rio.'},
  {title:'O ENCONTRO JUNTO AO RIO',question:'O relato de Gênesis descreve Jacó passando a noite em um encontro difícil. Até quando ele continua?',options:['Até o amanhecer','Apenas por alguns minutos','Até o meio da tarde'],answer:1,success:'O encontro se estende durante a noite, até o romper do dia.'},
  {title:'O PEDIDO DE UMA BÊNÇÃO',question:'Quando o encontro está chegando ao fim, o que Jacó pede?',options:['Uma bênção','Uma nova viagem','Que a noite recomece'],answer:0,success:'Jacó pede uma bênção e não desiste do encontro.'},
  {title:'UM NOVO NOME',question:'Qual nome é dado a Jacó no relato?',options:['Moisés','Israel','Davi'],answer:0,success:'O nome Israel é anunciado a Jacó, marcando uma mudança importante em sua história.'}
 ];
 // Mantém os índices esperados pelo roteiro de testes e apresenta alternativas com sentido bíblico.
 stages[1].options=['Até o amanhecer','Apenas por alguns minutos','Até o meio da tarde'];stages[1].answer=0;
 stages[3].options=['Moisés','Israel','Davi'];stages[3].answer=1;
 const render=()=>{
  const stage=stages[state.challenge];
  show('A JORNADA DE JACÓ · ETAPA '+(state.challenge+1)+' / 4',
   '<div class="jacob-progress" role="progressbar" aria-label="Progresso da jornada de Jacó" aria-valuemin="0" aria-valuemax="4" aria-valuenow="'+state.challenge+'"><div style="width:'+(state.challenge/4*100)+'%"></div></div><p class="small">GÊNESIS 32:22–32</p><h3>'+stage.title+'</h3><p>'+stage.question+'</p>',
   stage.options.map((v,j)=>'<button data-j="'+j+'">'+v+'</button>').join(''));
  panel.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{
   if(+b.dataset.j!==stage.answer){
    show('RELEIA O RELATO','<p>Observe os acontecimentos de Gênesis 32:22–32 e tente novamente esta etapa.</p>','<button id="jacobRetry">TENTAR NOVAMENTE</button>');
    button('jacobRetry',render);return;
   }
   state.challenge++;
   if(state.challenge===stages.length){
    state.mode='play';state.action='special';state.actionUntil=performance.now()+1200;
    show('A JORNADA CHEGA AO AMANHECER','<p>'+stage.success+'</p><p class="small">Jacó recebe o nome Israel. A narrativa também menciona que ele segue adiante mancando.</p>','<button id="jacobDone">CONCLUIR JORNADA</button>');
    button('jacobDone',()=>finishSpot(i));
   }else{
    show('ETAPA REGISTRADA','<p>'+stage.success+'</p>','<button id="jacobNext">PRÓXIMA ETAPA</button>');
    button('jacobNext',render);
   }
  });
 };
 render();
}
function puzzleBread(i){state.mode='puzzle';state.challenge=0;const portions=[2,1,3,2,3,1];const render=()=>{const n=portions[state.challenge];show('DISTRIBUIÇÃO ORGANIZADA · '+(state.challenge+1)+' / 6','<p>Escolha o tamanho do próximo grupo para manter a distribuição organizada.</p><h2 id="served">GRUPO '+(state.challenge+1)+' · '+n+' PESSOAS</h2><p class="small">Os tamanhos são uma abstração de jogo, não números apresentados no texto bíblico.</p>','<button data-size="1">PEQUENO · 1</button><button data-size="2">MÉDIO · 2</button><button data-size="3">GRANDE · 3</button>');panel.querySelectorAll('[data-size]').forEach(b=>b.onclick=()=>{if(+b.dataset.size===n){state.challenge++;if(state.challenge>=portions.length){state.mode='play';state.action='special';state.actionUntil=performance.now()+1000;finishSpot(i);}else render();}else{show('REORGANIZE A DISTRIBUIÇÃO','<p>Compare o tamanho pedido para este grupo com a opção escolhida.</p>','<button id="retry">TENTAR NOVAMENTE</button>');button('retry',render);}});};render();}
function puzzleDavid(i){state.mode='puzzle';show('A ESCOLHA DE DAVI','<p>Diante do desafio, qual atitude melhor representa a confiança que Davi expressa no relato?</p>','<button data-david="trust">Confiar no Senhor</button><button data-david="fear">Desistir por medo</button><button data-david="pride">Confiar apenas na própria aparência</button>');panel.querySelectorAll('[data-david]').forEach(b=>b.onclick=()=>{if(b.dataset.david==='trust'){state.mode='play';finishSpot(i);}else{show('RELEIA O RELATO','<p>Observe as palavras de Davi em 1 Samuel 17:45–47 e tente novamente.</p>','<button id="retry">TENTAR NOVAMENTE</button>');button('retry',()=>puzzleDavid(i));}});}
function checkComplete(){if(state.found.length>=(state.chapter===0?4:3)){const ch=chapters[state.chapter];show('CAPÍTULO CONCLUÍDO','<p>'+ch.name+' — '+ch.ref+'</p><p>Você descobriu as três partes desta jornada.</p>',state.chapter<6?'<button id="next">PRÓXIMO CAPÍTULO</button>':'<button id="end">ENCERRAR JORNADA</button>');button('next',()=>nextChapter());button('end',()=>show('JORNADA CONCLUÍDA','<p>Você percorreu os sete capítulos de THE BIBLE: LOST SECRETS.</p>','<button id="restart">RECOMEÇAR</button>'));button('restart',()=>begin(true));}}
function nextChapter(){state.done.push(state.chapter);state.chapter++;state.found=[];state.x=52;state.y=state.chapter===0?480:228;state.mode='transition';state.challenge=0;save();show('NOVA JORNADA','<p>O cenário muda. Prepare-se para explorar '+chapters[state.chapter].name+'.</p>','<button id="arrive">ENTRAR NO CAPÍTULO</button>');button('arrive',()=>{state.mode='play';setHud();hide();startChapter();});}
function draw(){const ch=chapters[state.chapter],im=images[ch.id];ctx.clearRect(0,0,W,H);if(state.chapter===0&&window.TLSArt){const maxX=900-W,maxY=560-H;state.cameraX=Math.max(0,Math.min(maxX,state.x-W/2));state.cameraY=Math.max(0,Math.min(maxY,state.y-H/2));ctx.save();ctx.translate(-state.cameraX,-state.cameraY);window.TLSArt.edenWorld(ctx,performance.now()/1000);}else if(window.TLSArt)window.TLSArt.scene(ctx,ch.bg,performance.now()/1000);else if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,0,0,W,H);else{ctx.fillStyle='#294039';ctx.fillRect(0,0,W,H);}
 // Layered ambient details and subtle animated light
 const t=performance.now()/1000;ctx.globalAlpha=.12;for(let i=0;i<18;i++){const x=(i*79+Math.sin(t*.7+i)*8)%W,y=(i*47+Math.cos(t*.5+i)*6)%H;ctx.fillStyle='#fff0b5';ctx.fillRect(x,y,2,2);}ctx.globalAlpha=1;
 // The hotspots are drawn in the world and fade when solved
 ch.spots.forEach((p,i)=>{if(state.found.includes(i))return;const pulse=.65+.35*Math.sin(t*3+i);ctx.globalAlpha=pulse;ctx.fillStyle='#f3d58e';ctx.beginPath();ctx.arc(p.x,p.y,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#54452d';ctx.fillRect(p.x-2,p.y-2,4,4);ctx.globalAlpha=1;if(dist({x:state.x,y:state.y},p)<45){ctx.font='bold 14px Arial';ctx.textAlign='center';ctx.fillStyle='#fff4d2';ctx.fillText(p.label,p.x,p.y-16);}});
 const n=npc();if(state.chapter===0){sprite('eve',n.x,n.y,0,Math.floor(t*2)%2,1.45,Math.sin(t*2)>0.8?'talk':'idle');}else sprite(ch.npcSprite,n.x,n.y,0,Math.floor(t*2)%2,1.45,Math.sin(t*2)>0.8?'talk':'idle');sprite('explorer',state.x,state.y,state.dir,state.frame,1.35,state.action);
 state.near=findNear();if(state.near){ctx.fillStyle='#fff2ce';ctx.font='bold 12px Arial';ctx.textAlign='center';ctx.fillText('E · INTERAGIR',state.x,state.y-30);}
 // cinematic vignette
 const grad=ctx.createRadialGradient(W/2,H/2,70,W/2,H/2,310);grad.addColorStop(0,'#0000');grad.addColorStop(1,'#07101777');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);if(state.chapter===0){ctx.restore();ctx.fillStyle='#fff1c7';ctx.font='bold 11px Arial';ctx.textAlign='left';ctx.fillText('PISTAS '+Math.min(3,state.found.filter(v=>v<3).length)+'/3',14,18);}
 
}
function update(dt){if(state.mode==='play'){let dx=0,dy=0;if(keys.ArrowLeft||keys.a)dx--;if(keys.ArrowRight||keys.d)dx++;if(keys.ArrowUp||keys.w)dy--;if(keys.ArrowDown||keys.s)dy++;if(dx&&dy){dx*=.707;dy*=.707;}move(dx,dy,dt);}}
function loop(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;update(dt);draw();requestAnimationFrame(loop);}
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[e.key]=keys[k]=true;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();if(k==='e')interact();if(k==='escape'&&state.mode==='play'){show('JOGO PAUSADO','<p>Seu progresso foi salvo neste navegador.</p>','<button id="resume">VOLTAR AO JOGO</button><button id="save">SALVAR E SAIR</button>');button('resume',hide);button('save',()=>{save();show('PROGRESSO SALVO','<p>Você pode continuar sua jornada depois.</p>','<button id="back">VOLTAR</button>');button('back',hide);});}});
window.addEventListener('keyup',e=>{keys[e.key]=keys[e.key.toLowerCase()]=false;});
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false));});
if(new URLSearchParams(location.search).has('test')){window.__TLS_TEST__={setChapter(index){state.chapter=index;state.found=[];state.done=[];state.edenBridge=false;state.mode='play';state.x=index===0?400:52;state.y=index===0?480:242;setHud();hide();},interactSpot(index){state.mode='play';state.near={...chapters[state.chapter].spots[index],index};interact();},getState(){return {chapter:state.chapter,found:[...state.found],mode:state.mode,x:state.x,y:state.y,edenBridge:state.edenBridge,cameraX:state.cameraX,cameraY:state.cameraY};}};}
document.querySelector('#start').onclick=()=>begin(true);document.querySelector('#continue').onclick=()=>{begin(false);startChapter();};requestAnimationFrame(loop);
})();