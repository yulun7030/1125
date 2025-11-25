let spriteSheet;
let animation = [];
const totalFrames = 5;
let currentFrame = 0;
let frameWidth;

// ----- 遊戲變數 -----
let gameState = 'start'; // 遊戲狀態: 'start' 或 'playing'

// ----- 角色屬性 -----
let characterX;
let characterY;
let groundY; // 地面高度
let moveSpeed = 8; // 增加移動速度
let facingDirection = 1; // 1: 向右, -1: 向左

// ----- 跳躍物理屬性 -----
let isJumping = false;
let velocityY = 3.5;
const jumpPower = -25; // 讓跳躍更有力
const gravity = 3.5;   // 讓角色更快落地

function preload() {
  spriteSheet = loadImage('1/all.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#e6ccb2');

  frameWidth = spriteSheet.width / totalFrames;

  for (let i = 0; i < totalFrames; i++) {
    let frame = spriteSheet.get(i * frameWidth, 0, frameWidth, spriteSheet.height);
    animation.push(frame);
  }

  // 設定角色初始位置
  characterX = width / 2 - frameWidth / 2;
  groundY = height / 2 - spriteSheet.height / 2;
  characterY = groundY;

  // 提高動畫播放速度以配合移動
  frameRate(15);

  // 初始時不播放動畫
  noLoop();
}

function draw() {
  background('#e6ccb2');

  if (gameState === 'playing') {
    let isMoving = false;

    // ----- 鍵盤控制 -----
    if (keyIsDown(RIGHT_ARROW)) {
      characterX += moveSpeed;
      facingDirection = 1;
      isMoving = true;
    }
    if (keyIsDown(LEFT_ARROW)) {
      characterX -= moveSpeed;
      facingDirection = -1;
      isMoving = true;
    }
    if (keyIsDown(UP_ARROW) && !isJumping) {
      isJumping = true;
      velocityY = jumpPower;
    }

    // ----- 跳躍邏輯 -----
    if (isJumping) {
      characterY += velocityY;
      velocityY += gravity;

      if (characterY >= groundY) {
        characterY = groundY;
        isJumping = false;
        velocityY = 0;
      }
    }

    // ----- 動畫更新 -----
    if (isJumping) {
      // 根據跳躍速度決定顯示哪一格動畫，創造更自然的跳躍感
      if (velocityY < -5) {
        // 上升速度快時
        currentFrame = 0;
      } else if (velocityY < 5) {
        // 到達最高點附近時
        currentFrame = 1;
      } else {
        // 開始下落時
        currentFrame = 2;
      }
    } else if (isMoving) {
      // 只有在地面上移動時才播放走路動畫
      currentFrame = floor(frameCount / 4) % 4;
    } else {
      currentFrame = 4; // 靜止時固定顯示最後一個畫格 (站立姿勢)
    }
  }

  // ----- 繪製角色 -----
  push();
  // 將畫布原點移動到角色的中心，以便進行翻轉
  translate(characterX + frameWidth / 2, 0);
  // 根據面向方向進行水平翻轉
  scale(facingDirection, 1);
  // 繪製角色 (因為已經 translate，所以 x 座標設為相對位置)
  image(animation[currentFrame], -frameWidth / 2, characterY);
  pop();

  // ----- 開始畫面提示 -----
  if (gameState === 'start') {
    fill(0);
    textAlign(CENTER);
    textSize(24);
    text('Click to Start', width / 2, height / 2 + 150);
  }
}

// ----- 事件處理 -----

function mousePressed() {
  // 如果在開始畫面點擊滑鼠，則開始遊戲
  if (gameState === 'start') {
    gameState = 'playing';
    loop(); // 開始 draw() 迴圈
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新計算地面高度
  groundY = height / 2 - spriteSheet.height / 2;
  if (!isJumping) {
    characterY = groundY;
  }
}
