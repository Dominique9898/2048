/**
 * Author: Dominique
 * DateTime:2020/03/14
 */
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04*documentWidth;


function getPosTop(i,j) {
  return cellSpace+i*(cellSpace+cellSideLength);
}
function getPosLeft(i,j) {
  return cellSpace+j*(cellSpace+cellSideLength)
}
function getNumberBackgroundColor( number ){
  switch( number ){
    case 2:return "#eee4da";break;
    case 4:return "#ede0c8";break;
    case 8:return "#f2b179";break;
    case 16:return "#f59563";break;
    case 32:return "#f67c5f";break;
    case 64:return "#f65e3b";break;
    case 128:return "#edcf72";break;
    case 256:return "#edcc61";break;
    case 512:return "#9c0";break;
    case 1024:return "#33b5e5";break;
    case 2048:return "#09c";break;
    case 4096:return "#a6c";break;
    case 8192:return "#93c";break;
  }

  return "black";
}

function getNumberColor(number) {
  if (number <= 4)
  {
    return "#776e65"
  }
  return "white"
}

function nospace(board) {
  for (var i = 0 ; i < 4 ; i ++ )
  {
    for (var j = 0 ;j < 4 ; j++ )
    {
      if (board[i][j] === 0)
      {
         return false;
      }
    }
  }
  return true;
}


//左边没数字
//左边数字与自己相等
function canMoveLeft(board) {
  for (var i = 0 ; i < 4 ; i ++)
  for (var j = 1 ; j < 4 ; j ++)
  {
    if (board[i][j] !== 0)
    {
      if ((board[i][j-1] === 0 )|| (board[i][j-1] === board[i][j])){
        return true
      }
    }
  }
  return false;
}
function canMoveRight(board) {
  for (var i = 0 ; i < 4 ; i ++ )
    for (var j = 2 ; j >= 0 ; j--)
    {
      if (board[i][j]!==0)
      {
        if (board[i][j+1] === 0 || board[i][j+1] === board[i][j])  // *错误写成 board[i][j] === board[i][j]) 导致弹不出gameover
        return true;
      }
    }

  return false;

}

function canMoveUp(board){
  for (var i = 1 ; i < 4 ; i ++)
    for (var j = 0 ; j < 4 ; j ++)
    {
      if (board[i][j]!==0)
      {
        if (board[i-1][j] === 0 || board[i-1][j] === board[i][j]) return true
      }
    }
  return false;
}
function canMoveDown( board ){

  for( var j = 0 ; j < 4 ; j ++ )
    for( var i = 2 ; i >= 0 ; i -- )
      if( board[i][j] != 0 )
        if( board[i+1][j] == 0 || board[i+1][j] == board[i][j] )
          return true;

  return false;
}
function noBlockHorizontal( row , col1 , col2 , board ) {
  for (var i=col1+1;i<col2;i++)
  { //col1 要排除
    if (board[row][i]!==0)return false
  }
  return true
}
function noBlockVertical(col,row1,row2,board) {
  for (var i = row1 + 1 ; i < row2 ; i ++)
  {
    if (board[i][col]!==0)return false
  }
  return true;
}

//不可上下左右  //别忘记参数
function nomove( board ){
  if( canMoveLeft( board ) ||
    canMoveRight( board ) ||
    canMoveUp( board ) ||
    canMoveDown( board ) )
    return false;

  return true;
}
function updateScore(score) {
  $('#score').text( score );
}


window.οnlοad=function () {
  document.addEventListener('touchstart',function (event) {
    if(event.touches.length>1){
      event.preventDefault();
    }
  })
  var lastTouchEnd=0;
  document.addEventListener('touchend',function (event) {
    var now=(new Date()).getTime();
    if(now-lastTouchEnd<=300){
      event.preventDefault();
    }
    lastTouchEnd=now;
  },false)
}

var handle = function(event){
  event.preventDefault(); //阻止元素发生默认的行为
}
document.body.addEventListener('touchmove',handle,false);//添加监听事件--页面不可滚动
document.body.removeEventListener('touchmove',handle,false);//移除监听事件--页面恢复可滚动


