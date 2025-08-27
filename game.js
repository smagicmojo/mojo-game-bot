(function(){
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let player, bananas, rocks, score, running, speed, lastSpawn, lastTime;
  const GRAVITY=0.4, JUMP_VELOCITY=-8.5;

  function reset(){
    player={x:W/2,y:H-80,r:18,vy:0,onGround:true};
    bananas=[]; rocks=[]; score=0; speed=2; lastSpawn=0; lastTime=performance.now();
  }
  function start(){
  const go = document.getElementById('gameover');
  if (go) go.classList.add('hidden');       // make sure overlay hides
  document.getElementById('score').textContent = 'Score: 0';
  reset();
  running = true;
  loop();
}

  function spawnStuff(dt){
    lastSpawn+=dt;
    if(lastSpawn>900){
      lastSpawn=0;
      bananas.push({x:Math.random()*(W-40)+20,y:-20,r:10});
      if(Math.random()<0.7){ rocks.push({x:Math.random()*(W-60)+30,y:-30,r:16}); }
      speed+=0.02;
    }
  }
  function update(dt){
    player.vy+=GRAVITY; player.y+=player.vy;
    if(player.y>H-80){ player.y=H-80; player.vy=0; player.onGround=true; } else player.onGround=false;

    for(const b of bananas) b.y+=speed*1.3;
    for(const r of rocks) r.y+=speed*1.4;

    for(let i=bananas.length-1;i>=0;i--){
      const b=bananas[i];
      if(dist(player,b)<player.r+b.r){
        bananas.splice(i,1); score+=10;
        document.getElementById('score').textContent='Score: '+score;
      } else if(b.y>H+30) bananas.splice(i,1);
    }
    for(let i=rocks.length-1;i>=0;i--){
      const r=rocks[i];
      if(dist(player,r)<player.r+r.r){ end(); return; }
      else if(r.y>H+40) rocks.splice(i,1);
    }
  }
  function drawBackground(){
    ctx.save();
    for(let i=0;i<40;i++){
      const x=(i*97%W),y=(i*53%H);
      ctx.globalAlpha=.25; ctx.fillStyle='#8fb5ff'; ctx.fillRect(x,y,2,2);
    }
    ctx.restore();
    ctx.fillStyle='#0a1a12'; ctx.fillRect(0,H-60,W,60);
    ctx.fillStyle='#113b2c';
    for(let i=0;i<8;i++){
      const x=(i*50+(Date.now()/20)%50)%(W+60)-30;
      ctx.beginPath(); ctx.arc(x,H-60,30,0,Math.PI*2); ctx.fill();
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    drawBackground();

    // Player
    ctx.save(); ctx.translate(player.x,player.y);
    ctx.beginPath(); ctx.fillStyle='#f5d28b'; ctx.arc(0,0,player.r,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#3b2a19';
    ctx.beginPath(); ctx.arc(-6,-4,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(6,-4,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(0,4,6,0,Math.PI); ctx.fill();
    ctx.restore();

    // Bananas
    for(const b of bananas) drawBanana(b.x,b.y,b.r);

    // Rocks
    ctx.fillStyle='#6b717a';
    for(const r of rocks){ ctx.beginPath(); ctx.arc(r.x,r.y,r.r,0,Math.PI*2); ctx.fill(); }
  }
  function drawBanana(x,y,r){
    const ang=-0.6;
    ctx.save(); ctx.translate(x,y); ctx.rotate(ang);
    ctx.fillStyle='#ffdf40';
    ctx.beginPath(); ctx.ellipse(0,0,r*1.6,r*0.8,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#d1a80e'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r*1.2,-0.9,0.9); ctx.stroke();
    ctx.restore();
  }
  function loop(){ if(!running) return; const now=performance.now(); const dt=now-lastTime; lastTime=now; spawnStuff(dt); update(dt); draw(); requestAnimationFrame(loop); }
  function dist(a,b){ const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy); }

  canvas.addEventListener('pointerdown',()=>{ if(player.onGround) player.vy=JUMP_VELOCITY; else player.vy=Math.min(player.vy,-2); });
  document.getElementById('btnStart').addEventListener('click',start);
  document.getElementById('btnRestart').addEventListener('click',start);

  function fit(){ const maxW=Math.min(window.innerWidth-16,420); const scale=maxW/W; canvas.style.width=(W*scale)+'px'; canvas.style.height=(H*scale)+'px'; }
  window.addEventListener('resize',fit); fit(); reset(); draw();

})();
