import "phaser";

export class WarScene extends Phaser.Scene {
    private sky: Phaser.GameObjects.Image
    private bomb: Phaser.Physics.Arcade.Sprite
    private ground: Phaser.Physics.Arcade.Body
    private cane: Phaser.GameObjects.Sprite
    private soldier_static: Phaser.GameObjects.Image
    private soldier_dinamic: Phaser.GameObjects.Sprite
    private plane1: Phaser.Physics.Arcade.Sprite
    private tank: Phaser.Physics.Arcade.Sprite
    private tankShadow: Phaser.Physics.Arcade.Sprite
    private isBombReleased: boolean = false;
    private bullets: Phaser.Physics.Arcade.Group
    private isPlaneExploding: boolean = false;
    private isBombExploding: boolean = false;
    private bombReleasePosition:number;
    private isTankDestroid:boolean = false;
    private TankInterval:any;

    
    constructor() {
        super({
        key: "WarScene"
        });
    }
    init(params): void {
        // TODO
    }
    preload(): void {
        this.load.image("bullet", "assets/bullet.png");
        this.load.image("sky", "assets/sky.png");
        this.load.image("soldier_static", "assets/soldier_static.png");
        this.load.spritesheet("bomb", "assets/bomb.png",{
          frameWidth: 500,
          frameHeight: 183
        });
    
        this.load.spritesheet("cane", "assets/cane.png", {
          frameWidth: 160,
          frameHeight: 160
        });
        this.load.spritesheet("soldier_dinamic", "assets/soldier_dinamic.png", {
          frameWidth: 140,
          frameHeight: 140
        });
        this.load.spritesheet("plane1", "assets/plane1.png", {
          frameWidth: 256,
          frameHeight: 258
        });
    
        this.load.spritesheet("tank", "assets/tank.png", {
          frameWidth: 256,
          frameHeight: 256
        });
        this.load.spritesheet("explosion", "assets/explosion.png", {
          frameWidth: 157,
          frameHeight: 229
        });
        this.load.spritesheet("explosion2", "assets/explosion2.png", {
          frameWidth: 200,
          frameHeight: 247
        });
        this.load.audio('explosion', 'assets/explosion.mp3', {
          instances: 1
        });
        this.load.audio('explosion1', 'assets/explosion1.ogg', {
          instances: 1
        });
        this.load.audio('cannon', 'assets/cannon.mp3', {
          instances: 1
        });
        this.load.audio('tank', 'assets/explosion3.wav', {
          instances: 1
        });
        this.load.audio('dive', 'assets/dive.wav', {
          instances: 1
        });
        this.load.audio('explosion2', 'assets/explosion2.wav', {
          instances: 1
        });
    }
  
  create(): void {
    let { width, height } = this.sys.game.canvas;
    //Sounds 
    this.sound.add('explosion');
    this.sound.add('explosion1');
    this.sound.add('explosion2');
    this.sound.add('cannon');
    this.sound.add('tank');
    this.sound.add('dive');

    //Sky Properties
    this.sky = this.add.image(0, 0, "sky").setOrigin(0, 0);
    this.sky.setDisplaySize(this.sky.displayWidth, height);
  
    //Cane Properties
    this.cane = this.add.sprite(0, 0, "cane");
    this.cane.x = width - this.cane.displayWidth;
    this.cane.y = height - this.cane.displayHeight + 50;

     //Soldier Static Properties
     this.soldier_static = this.add.image(0, 0, "soldier_static");
     this.soldier_static.x = width - 50;
     this.soldier_static.y = height - 50;
     this.soldier_static.setScale(0.5);
     this.soldier_static.setActive(true);

     //Soldier Dinamic Properties
     this.soldier_dinamic = this.add.sprite(0, 0, "soldier_dinamic");
     this.soldier_dinamic.y = height - 50;
     this.soldier_dinamic.x = width/2 + 120;
     this.soldier_dinamic.setScale(0.5);
     this.soldier_dinamic.setActive(true);
  
    //Bombs
    this.bomb = this.physics.add.sprite(0, 0, "bomb").setOrigin(0.5,1);
    this.bomb.setScale(0.08);
    this.bomb.setAngle(40)
    this.bombReleasePosition = Math.random() * (this.sys.game.canvas.width);
    this.bomb.on("animationcomplete", e => {
      this.isBombExploding = false;
      this.isBombReleased = false;
    });

    //Plane 1 Properties
    this.plane1 = this.physics.add.sprite(0, 0, "plane1");
    this.plane1.x = 0 - this.plane1.displayWidth;
    this.plane1.y = 90;
    this.plane1.setGravityY(-500);
    this.plane1.setScale(0.6);
    this.plane1.setActive(true);
    this.plane1.on("animationcomplete", e => {});
  
    //Bullets
    this.bullets = this.physics.add.group({
      defaultKey: "bullet",
      maxSize: 2
    });

    
    
    //Tank Shadow
    this.tankShadow = this.physics.add.sprite(0, 0, "tank");
    this.tankShadow.tint = 0x000000;
    this.tankShadow.alpha = 0.6;
    this.tankShadow.setScale(-0.7, 0.7);
    this.tankShadow.setGravityY(-500);
    this.tankShadow.x = width/2;
    this.tankShadow.y = height - this.tankShadow.displayHeight + 130;

    //tank 1 Properties
    this.tank = this.physics.add.sprite(0, 0, "tank");
    this.tank.x = width/2;
    this.tank.y = height - this.tank.displayHeight + 200;
    this.tank.setScale(-0.7, 0.7);
    this.tank.setGravityY(-500);
    this.tank.setActive(true);
    this.tank.on("animationcomplete", e => {});
    this.TankInterval = setInterval(()=>{
      if(!this.isTankDestroid){
        this.time.addEvent({
          delay: 1000,
          callback: this.fireTank,
          callbackScope: this
        })
      }
    }, 3000)
    
  
    //Animations
    this.anims.create({
      key: "blast",
      frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 17 }),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "soldier",
      frames: this.anims.generateFrameNumbers("soldier_dinamic", { start: 0, end: 11 }),
      frameRate: 20,
      repeat: 0
    });
  
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("plane1", { start: 1, end: 3 }),
      frameRate: 20,
      repeat: 0
    });
    this.anims.create({
      key: "explode2",
      frames: this.anims.generateFrameNumbers("explosion2", { start: 0, end: 24 }),
      frameRate: 20,
      repeat: 0
    });
  
    this.anims.create({
      key: "fire",
      frames: this.anims.generateFrameNumbers("cane", { start: 1, end: 8 }),
      frameRate: 30,
      repeat: 0
    });

    this.anims.create({
      key: "TankFire",
      frames: this.anims.generateFrameNumbers("tank", { start: 1, end: 9 }),
      frameRate: 20,
      repeat: 0
    });

    this.anims.create({
      key: "TankExplode",
      frames: this.anims.generateFrameNumbers("tank", { start: 10, end: 19 }),
      frameRate: 30,
      repeat: 0
    });

    this.input.on("pointerdown", this.shoot, this);
  
   
  }
    update(time): void {
        //Get Canvas dimentions
        let { width, height } = this.sys.game.canvas;

        //Set Plane to move
        this.plane1.x = this.plane1.x + 10;
        if(!this.isBombReleased && !this.isBombExploding){
          this.bomb.x = this.plane1.x;
          this.bomb.y = this.plane1.y;
        }
        this.checkReleaseBomb();
    
        //Reset Plane 
        if (this.plane1.x > width + width/2) {
        this.isPlaneExploding = false;
        this.plane1.x = -200;
        this.plane1.setVelocityY(0);
        this.plane1.setVisible(true);
        this.plane1.setTexture("plane1");
        this.plane1.y = height / 2 - Math.random() * ((height/5) - 0) + 0;
        this.isBombReleased = false;
        this.bombReleasePosition = Math.random() * (this.sys.game.canvas.width);
        this.bomb.setTexture('bomb');
        this.bomb.setScale(0.08);
        this.bomb.setAngle(40);
        this.bomb.anims.stop();
        this.isBombExploding = false;
        this.soldier_dinamic.anims.play('soldier');
        }
    
        //Reset Bullet
        this.bullets.children.each(
        function(b) {
            if (b.active) {
            if (b.body.velocity.y > -50 && !b.isExploding) {
                b.setScale(0.5, 0.5);
                b.anims.play("blast");
                this.sound.play('explosion1');
                b.isExploding = true;
                const windx = Math.random() * (350 - 150) + 150;
                b.body.setVelocityY(-windx);
                const windy = Math.random() * (150 - 50) + 50;
                b.body.setVelocityX(-windy);
            }
            }
        }.bind(this)
        );


        this.physics.add.overlap(
          this.plane1,
          this.bullets,
          this.explodeAirplane,
          null,
          this
        );
    
        this.physics.add.overlap(
          this.tank,
          this.bomb,
          this.explodeTank,
          null,
          this
        );

        this.physics.add.overlap(
          this.cane,
          this.bomb,
          this.explodeTank,
          null,
          this
        );
  
    }

    explodeAirplane(plane, bullet) {
        if (bullet.isExploding && !this.isPlaneExploding) {
          this.sound.play('explosion2');
          this.sound.play('dive');
          plane.anims.play("explode");
          plane.setVelocityY(100);
          plane.isExploding = true;
          this.isPlaneExploding = true;
        }
      }
    
    checkReleaseBomb() {
      if (this.plane1.x > (this.bombReleasePosition - this.sys.game.canvas.width/3) && !this.isPlaneExploding && !this.isBombExploding) {
        this.bomb.x = this.plane1.x;
        this.bomb.setVelocityY(450);
        this.bomb.setVelocityX(450);
        this.isBombReleased = true;
      }
      if(
        this.bomb.y > this.sys.game.canvas.height 
        && !this.isBombExploding
        && this.isBombReleased
        ){
        this.bomb.setScale(1);
        this.bomb.setRotation(0);
        this.bomb.anims.play('explode2');
        this.sound.play('explosion');
        this.isBombExploding = true;
        this.bomb.setVelocity(0);
        this.bomb.setVelocityY(-210);
      }
    }

    fireTank(){
      this.tank.play('TankFire');
      this.sound.play('tank');
      this.tankShadow.play('TankFire');
    }

    explodeTank(){
      if(!this.isTankDestroid && this.isBombExploding){
        clearInterval(this.TankInterval);
        this.tankShadow.play('TankExplode');
        this.tank.play('TankExplode');
        this.isTankDestroid = true;
        this.soldier_dinamic.setVisible(false);
        this.soldier_dinamic.setAlpha(0);
      }
    }
      
    shoot(pointer) {
        let { width, height } = this.sys.game.canvas;

        this.cane.play("fire");
        this.sound.play('cannon');
        var bullet = this.bullets.get(
          width - this.cane.displayWidth - 50,
          height - this.cane.displayHeight
        );
      
        if (bullet) {
            bullet.setTexture("bullet");
            bullet.angle = -145;
            bullet.setScale(0.1, 0.1);
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -700 + pointer.downY / 5;
            bullet.body.velocity.x = pointer.downX - width / 2 - 300;
            bullet.on("animationcomplete", function() {
                bullet.isExploding = false;
                bullet.isExploding = false;
                bullet.setActive(false);
                bullet.setVisible(false);
            });
        }
    }

    saveScore(score) {
      if (localStorage.getItem("score")) {
        const lastScore = parseFloat(localStorage.getItem("score"));
        if (lastScore < score) {
          localStorage.setItem("score", score);
        }
      } else {
        localStorage.setItem("score", score);
      }
    }
  
    getScore(score) {
      if (localStorage.getItem("score")) {
        return parseFloat(localStorage.getItem("score")).toFixed(2);
      }
      return 0;
    }
};