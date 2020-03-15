/**
 * Author: Dominique
 * DateTime:2020/03/14
 */
var board = new Array();
var score = 0;
var hasConflicted = new Array();  //判断是否发生了碰撞

var startx = 0
var starty = 0
var endx = 0
var endy = 0


$(document).ready(function(){

  prepareForMobile();
  newgame();
});
function prepareForMobile() {
  if (documentWidth > 600 )
  {
    gridContainerWidth = 500;
    cellSpace = 20
    cellSideLength = 100
  }
  $('#grid-container').css('width',gridContainerWidth-2*cellSpace);
  $('#grid-container').css('height',gridContainerWidth-2*cellSpace);
  $('#grid-container').css('padding',cellSpace);
  $('#grid-container').css('border-radius',0.02*gridContainerWidth);

  $('.grid-cell').css('width',cellSideLength)
  $('.grid-cell').css('height',cellSideLength)
  $('.grid-cell').css('border-radius',0.02*cellSideLength)
}
function newgame(){
  //初始化棋盘格
  init();
  //在随机两个格子生成数字
  generateOneNumber();
  generateOneNumber();
}

function init(){
  for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 0 ; j < 4 ; j ++ ){

      var gridCell = $('#grid-cell-'+i+"-"+j);
      gridCell.css('top', getPosTop( i , j ) );
      gridCell.css('left', getPosLeft( i , j ) );
    }

  for( var i = 0 ; i < 4 ; i ++ ){
    board[i] = new Array();
    hasConflicted[i] = new Array();
    for( var j = 0 ; j < 4 ; j ++ ){
      board[i][j] = 0;
      hasConflicted[i][j] = false;
    }
  }
  updateBoardView()
  score = 0;
  $('#score').text( score );
}

function updateBoardView(){

  $(".number-cell").remove();
  for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 0 ; j < 4 ; j ++ ){
      $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
      var theNumberCell = $('#number-cell-'+i+'-'+j);

      if( board[i][j] === 0 ){
        theNumberCell.css('width','0px');
        theNumberCell.css('height','0px');
        theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );
        theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
      }
      else{
        theNumberCell.css('width',cellSideLength+'px');
        theNumberCell.css('height',cellSideLength+'px');
        theNumberCell.css('top',getPosTop(i,j));
        theNumberCell.css('left',getPosLeft(i,j));
        theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
        theNumberCell.css('color',getNumberColor( board[i][j] ) );
        theNumberCell.text( board[i][j] );
      }
      hasConflicted[i][j] = false;
    }
  $(".number-cell").css('line-height',cellSideLength+'px')
  $(".number-cell").css('font-size',0.6*cellSideLength+'px')
}

function generateOneNumber(){

  if( nospace( board ) )
    return false;

  //随机一个位置 -> 需优化 ---> 让计算机将随机生成位置 控制在猜50次
  var randx = parseInt( Math.floor( Math.random()  * 4 ) );
  var randy = parseInt( Math.floor( Math.random()  * 4 ) );

  var time = 0;
  while( time < 50 ){
    if( board[randx][randy] == 0 )
      break;

    randx = parseInt( Math.floor( Math.random()  * 4 ) );
    randy = parseInt( Math.floor( Math.random()  * 4 ) );

    time ++;
  }
  if (time === 50)
  {
    for (var i = 0 ; i < 4 ; i ++ )
      for (var j = 0 ; j < 4 ; j ++ )
      {
        if (board[i][j] === 0)
        {
          randx = i;
          randy = j;
        }
      }
  }
  //随机一个数字
  var randNumber = Math.random() < 0.5 ? 2 : 4;

  //在随机位置显示随机数字
  board[randx][randy] = randNumber;
  showNumberWithAnimation( randx , randy , randNumber );

  return true;
}

//捕捉键盘事件
$(document).keydown( function( event ){
  // event.preventDefault(); //阻挡*所有按键的默认效果 -> 当出现滚动条时,按方向键不会滚动
  switch( event.keyCode ){
    case 37: //left
      event.preventDefault();
      if( moveLeft() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    case 38: //up
      event.preventDefault();
      if( moveUp() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    case 39: //right
      event.preventDefault();
      if( moveRight() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    case 40: //down
      event.preventDefault();
      if( moveDown() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    default: //default
      break;
  }
});

// document.addEventListener('touchmove',function (event) {
//   event.preventDefault();
// });

//捕捉触摸事件
document.addEventListener('touchstart',function (event) {
  starty = event.touches[0].pageY;
  startx = event.touches[0].pageX;
});

document.addEventListener('touchend',function (event) {
  // *用户进行点击也会产生一次touchend事件,则需要对变化后的x,y的值做出判断,如果小于摸一个值视为点击

  endx = event.changedTouches[0].pageX;
  endy = event.changedTouches[0].pageY;

  var deltaX = endx - startx;
  var deltaY = endy - starty;

  if (Math.abs(deltaX) < 0.3*documentWidth && Math.abs(deltaY)<0.3*documentWidth)
    return;
  if (Math.abs(deltaX) >= Math.abs(deltaY))
  {
    // x方向
    if (deltaX > 0){
      // right
      if( moveRight() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }else {
      //left
      if( moveLeft() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
  }else {
    // y方向
    if (deltaY > 0){
      // down
      if( moveDown() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }else {
      //up
      if( moveUp() ){
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
  }
});


// 满足条件
// -.无空格
// -.不可任何的移动操作
function isgameover(){

 if (nospace( board ) && nomove( board ))
  {
    alert("Game Over");
  }

}


function moveRight() {
  if (!canMoveRight(board)) return false;
  for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 2 ; j >= 0 ; j -- ){
      if (board[i][j]!==0)
      {
        for (var k = 3;k>j;k--)
        {
          if (board[i][k] === 0 && noBlockHorizontal(i,j,k,board)){
            showMoveAnimation(i,j,i,k);
            board[i][k] = board[i][j];
            board[i][j] = 0;
          }
          else if (board[i][k] === board[i][j] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k])
          {
            showMoveAnimation(i,j,i,k)
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            hasConflicted[i][k] = true;
            updateScore(score)
            //封装成函数放到support2048 运行会出错
          }
        }
      }
    }
  setTimeout("updateBoardView()",200);
  return true;
}
function moveLeft(){

  if( !canMoveLeft( board ))
    return false;

  //moveLeft
  for( var i = 0 ; i < 4 ; i ++ )
    for( var j = 1 ; j < 4 ; j ++ ){
      if( board[i][j] != 0 ){

        for( var k = 0 ; k < j ; k ++ ){
          if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
            //move
            showMoveAnimation( i , j , i , k );
            board[i][k] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k]){
            //move
            showMoveAnimation( i , j , i , k );
            //add
            board[i][k] += board[i][j];
            board[i][j] = 0;
            score += board[i][k];
            hasConflicted[i][k] = false;
            updateScore(score)
          }
        }
      }
    }

  setTimeout("updateBoardView()",200);
  return true;
}

function moveDown(){
  if( !canMoveDown( board ) )
    return false;

  //moveDown
  for( var j = 0 ; j < 4 ; j ++ )
    for( var i = 2 ; i >= 0 ; i -- ){
      if( board[i][j] != 0 ){
        for( var k = 3 ; k > i ; k -- ){

          if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
            showMoveAnimation( i , j , k , j );
            board[k][j] = board[i][j];
            board[i][j] = 0;
            continue;
          }
          else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ){
            showMoveAnimation( i , j , k , j );
            board[k][j] *= 2;
            board[i][j] = 0;
            score += board[k][j];
            hasConflicted[k][j] = true;
            updateScore(score)
          }
        }
      }
    }

  setTimeout("updateBoardView()",200);
  return true;
}
function moveUp(){
  if (!canMoveUp(board))return false;
  for (var i = 1 ; i < 4 ; i++)
    for (var j = 0 ; j < 4 ; j ++ )
    {
      if (board[i][j] !== 0)
      {
        for (var k = 0 ; k < i ; k ++ )
        {
            if (board[k][j]===0 && noBlockVertical(j,k,i,board))
            {
              showMoveAnimation( i , j , k , j );
              board[k][j] = board[i][j];
              board[i][j] = 0;
              continue;
            }
            else if (board[k][j] === board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j])
            {
              showMoveAnimation( i , j , k , j );
              board[k][j] += board[i][j];
              board[i][j] = 0;
              score += board[k][j];
              hasConflicted[k][j] = true
              updateScore(score)
              // continue;
            }
        }
      }
    }
  setTimeout("updateBoardView()",200);
    return true
}
