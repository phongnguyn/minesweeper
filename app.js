

class Grid {
    bombArray = [];
    #inc(x, y) {
        for (let i = -1; i <= 1; i ++)
            for (let j = -1; j <= 1; j ++) 
                if ((i || j) && x + i >= 0 && x + i < this.height && y + j >= 0 && y + j < this.width && this.bombArray[x + i][y + j] >= 0) {
                    this.bombArray[x + i][y + j] ++;
                } 
    }
    #initArray() {
        for (let i = 0; i < this.height; i ++) {
            this.bombArray[i] = [];
            for (let j = 0; j < this.width; j ++) {
                this.bombArray[i][j] = 0;
            }
        }
        for (let t = 0; t < this.numBombs; t ++) {
            let i = 0, j = 0;
            do {
                i = Math.floor(Math.random() * (this.height - 1));
                j = Math.floor(Math.random() * (this.width - 1));
            } while (this.bombArray[i][j] === -1);
            this.bombArray[i][j] = -1;
            this.#inc(i,j);
        }
        for (let i = 0; i < this.width * this.height; i ++) {
            let box = $('.box').clone();
            box.prop('id', i);
            box.removeClass();
            box.appendTo('.grid');
        }
    }
    #easy_start() {
        let i = 0, j = 0;
        do {
            i = Math.floor(Math.random() * (this.height - 1));
            j = Math.floor(Math.random() * (this.width - 1));
        } while (this.bombArray[i][j] !== 0);
        let id = i * this.width + j;
        $(`.grid #${id}`).css('background-color', 'rgb(200, 235, 215)');
    }

    constructor(width, height, numBombs) {
        $('.grid').empty();
        this.height = height;
        this.width = width;
        $('.grid').css({'width': `${width * 30}px`, 'height': `${height * 30}px`});
        this.orgBombs = numBombs;
        this.numBombs = numBombs;
        this.#initArray();
        addListner();
        this.#easy_start();
        $('.FLags span').text(`${numBombs}`);
    }
}

function reveal(box, num) {
    if (box.css('border-style') === 'none') return null;
    box.css("border-style", "none");
    if (num > 0) box.text(num);
}

function leftclick(id) {

    let y = Math.floor(id / grid.width), x = id % grid.width;
    let initBomb = parseInt($(`#${id}`).text());
    if ($(`.grid #${id}`).css('border-style') === 'none' && isNaN(initBomb)) {return null;}
    if ($(`.grid #${id}`).css('border-style') === 'none') {
        let tags = 0;
        let hiddens = 0;
        for (let i = -1; i <= 1; i ++)
            for (let j = -1; j <= 1; j ++) 
                if ((i || j) && y + i >= 0 && y + i < grid.height && x + j >= 0 && x + j < grid.width) {
                    if ($(`#${(y + i) * grid.width + x + j}`).text() === '🚩')
                        tags ++;
                }
        if (tags === grid.bombArray[y][x]) {
            for (let i = -1; i <= 1; i ++)
                for (let j = -1; j <= 1; j ++) 
                    if ((i || j) && y + i >= 0 && y + i < grid.height && x + j >= 0 && x + j < grid.width 
                    && $(`.grid #${(y + i) * grid.width + x + j}`).css('border-style') !== 'none' 
                    && $(`#${(y + i) * grid.width + x + j}`).text() !== '🚩') {
                        leftclick((y + i) * grid.width + x + j);
                    }
        }
    }
    if (grid.bombArray[y][x] < 0) {grid = new Grid(grid.width, grid.height, grid.orgBombs);return null;}
    reveal($(`.grid #${id}`), grid.bombArray[y][x]);
    if (grid.bombArray[y][x] === 0) {
        for (let i = -1; i <= 1; i ++)
            for (let j = -1; j <= 1; j ++) 
                if ((i || j) && y + i >= 0 && y + i < grid.height && x + j >= 0 && x + j < grid.width) {
                    leftclick((y + i) * grid.width + x + j);
                }
    } 
}

function rightclick(id) {
    if ($(`#${id}`).css('border-style') === 'none' && $(`#${id}`).text() === '🚩') {
        $(`#${id}`).css('border-style', 'solid');
        $(`#${id}`).empty();
        grid.numBombs ++;
        $('.FLags span').text(`${grid.numBombs}`);
        return null;
    }
    if ($(`#${id}`).css('border-style') === 'solid') {
        $(`#${id}`).css('border-style', 'none');
        $(`#${id}`).text('🚩');
        grid.numBombs --;
        $('.FLags span').text(`${grid.numBombs}`);
    } 
}

const addListner = () => {
    const boxes = $(".grid").children();
    boxes.each(function() {
        $(this).on("mousedown", function( event ) {
            if (event.which === 1) leftclick($(this).attr('id'));
            else if (event.which === 3) rightclick($(this).attr('id'));
        });
    });
}

let grid = new Grid(8,8, 10);

document.querySelector('.btn1').addEventListener('click', () => {
    grid = new Grid(8,8, 10);
});

document.querySelector('.btn2').addEventListener('click', () => {
    grid = new Grid(16,16, 40);

});

document.querySelector('.btn3').addEventListener('click', () => {
    grid = new Grid(30,16, 99);
});

