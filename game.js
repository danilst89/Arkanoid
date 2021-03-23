const KEYS = {
    left: 37,
    right: 39,
    space: 32
}

const game = {
    ctx: null,
    platform: null,
    ball: null,
    blocks: [],
    rows: 4,
    cols: 8,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null
    },

    init() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.setEvents();
    },

    setEvents() {
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === KEYS.space) {
                this.ball.start();
            } else if (e.keyCode === KEYS.left || e.keyCode === KEYS.right) {
                this.platform.start(e.keyCode);
            }
        });

        window.addEventListener('keyup', (e) => {
            this.platform.stop();
        });
    },

    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;

        const onImageLoad = () => {
            ++loaded;
            if (loaded >= required) {
                callback();
            }
        };

        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/${key}.png`;
            this.sprites[key].addEventListener('load', onImageLoad);
        }
    },

    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    x: 64 * col + 65,
                    y: 24 * row + 35
                });
            }
        }
    },

    update() {
        this.platform.move();
    },

    run() {
        window.requestAnimationFrame(() => {
            this.update();
            this.render();
            this.run();
        });
    },

    render() {
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, 0, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);

        this.renderBlocks();
    },

    renderBlocks() {
        for (let block of this.blocks) {
            this.ctx.drawImage(this.sprites.block, block.x, block.y);
        }
    },

    start() {
        this.init();
        this.preload(() => {
            this.create();
            this.run();
        });
    }
};

game.ball = {
    dy: 0,
    velocity: 3,
    x: 320,
    y: 280,
    width: 20,
    height: 20,
    start() {
        this.dy = this.velocity;
    }
};

game.platform = {
    velocity: 6,
    dx: 0,
    x: 280,
    y: 300,
    start(direction) {
        if (direction === KEYS.left) {
            this.dx = -this.velocity;
        } else if (direction === KEYS.right) {
            this.dx = this.velocity;
        }
    },
    move() {
        if (this.dx) {
            this.x += this.dx;
            game.ball.x += this.dx;
        }
    },
    stop() {
        this.dx = 0;
    }
};

window.addEventListener("load", () => {
    game.start();
});
