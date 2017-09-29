function game2048(container)
{
    this.container = container;
    this.tiles = new Array(16);
}
 var scores=0;
game2048.prototype = {
    init: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            var tile = this.newTile(0);//所有方块value全部初始化为零
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }//建立16个方块，为tiles[]赋值16个方块，设置index属性，输出方块子节点
        this.randomTile();
        this.randomTile();//初始化产生两个方块
    },
    newTile: function(val){
        var tile = document.createElement('div');
        this.setTileVal(tile, val)
        return tile;
    },//②为方块建立并返回节点
    setTileVal: function(tile, val){
        tile.className = 'tile tile' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },//①建立方块，设置ClassName，Attribute，设置value属性，输出数字大小
    randomTile: function(){
        var zeroTiles = [];
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                zeroTiles.push(this.tiles[i]);
            }
        }//建立当前的零方块数组
        var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];//随机选中当前的一个零方块
        this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);//随机建立一个初始值为二或四的方块，为二的概率为0.8
    },
    move:function(direction){
        var j;
        switch(direction){
            case 'W':
                for(var i = 4, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j >= 4){
                        this.merge(this.tiles[j - 4], this.tiles[j]);
                        j -= 4;
                    }
                }
                break;
            case 'S':
                for(var i = 11; i >= 0; i--){
                    j = i;
                    while(j <= 11){
                        this.merge(this.tiles[j + 4], this.tiles[j]);
                        j += 4;
                    }
                }
                break;
            case 'A':
                for(var i = 1, len = this.tiles.length; i < len; i++){
                    j = i;
                    while(j % 4 != 0){
                        this.merge(this.tiles[j - 1], this.tiles[j]);
                        j -= 1;
                    }
                }
                break;
            case 'D':
                for(var i = 14; i >= 0; i--){
                    j = i;
                    while(j % 4 != 3){
                        this.merge(this.tiles[j + 1], this.tiles[j]);
                        j += 1;
                    }
                }
                break;
        }
        this.randomTile();//随即再次产生一个方块
    },
    merge: function(prevTile, currTile){
        var prevVal = prevTile.getAttribute('val');
        var currVal = currTile.getAttribute('val');
        if(currVal != 0){
            if(prevVal == 0){
                this.setTileVal(prevTile, currVal);
                this.setTileVal(currTile, 0);//如果当前不为空而目标方向为空，当前设为零，目标方向获得当前值
            }
            else if(prevVal == currVal){
                this.setTileVal(prevTile, prevVal * 2);
                this.setTileVal(currTile, 0);//如果当前方向和目标方向均不为空，融合，当前设为零
                scores+=prevVal*2;
                this.getScores();
            }
        }
    },
    equal: function(tile1, tile2){
        return tile1.getAttribute('val') == tile2.getAttribute('val');
    },
    max: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 2048){
                return true;
            }
        }
    },//判定游戏胜利
    over: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                return false;
            }//判定是否可以随机产生方块
            if(i % 4 != 3){
                if(this.equal(this.tiles[i], this.tiles[i + 1])){
                    return false;
                }
            }//判定左右是否可以操作
            if(i < 12){
                if(this.equal(this.tiles[i], this.tiles[i + 4])){
                    return false;
                }//判定上下是否可以操作
            }
        }
        return true;
    },//判定游戏是否结束
    clean: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            this.container.removeChild(this.tiles[i]);
        }
        this.tiles = new Array(16);//清屏
    },
    getScores:function(){
        var scoresnd=document.getElementById('scores');
        scoresnd.innerHTML=scores;
    }
}
 
var game, startBtn;
 
window.onload = function(){
    var container = document.getElementById('div2048');
    startBtn = document.getElementById('start');
    startBtn.onclick = function(){
        this.style.display = 'none';
        scores=0;
        game = new game2048(container);//建立游戏框架
        game.init();//初始化游戏
    }
}
 
window.onkeydown = function(e){
    var keynum, keychar;
    if(window.event){       // IE
        keynum = e.keyCode;
    }
    else if(e.which){       // Netscape/Firefox/Opera
        keynum = e.which;
    }//获取按下的键的Unicode字符代码
    keychar = String.fromCharCode(keynum);//获取按下的键对应的字符
    if(['W', 'S', 'A', 'D'].indexOf(keychar) > -1){//如果按下了w、a、s、d键
        if(game.over()){
            game.clean();
            startBtn.style.display = 'block';
            startBtn.innerHTML = 'game over, replay?';
            return;
        }
        game.move(keychar);
    }
}
