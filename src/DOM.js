import $ from "jquery";
import {arr_create, setStartPos, setFinishPos, arrReset, findTrail} from './funcs.js';


//---------Переменные---------------
var $input_height = $('.inputs__input_height');
var $input_width = $('.inputs__input_width');
var $table_wrapper = $('.osnov__wrapper');
var $osnov = $('.osnov');
var $btn_crate = $('.btn_create');
var $btn_find = $('.btn_find');
var $btn_walls_add = $('.nav__btn_walls_add');
var $btn_walls_remove = $('.nav__btn_walls_remove');
var $btn_player = $('.nav__btn_player');
var $btn_finish = $('.nav__btn_finish');
var $btn_find = $('.btn_find');

var arr_field = [[]];

//--------Активность модификаций-------
var btn_walls_add_active =false;
var btn_walls_remove_active = false;
var btn_player_active = false;
var btn_finish_active = false;

//----------------Функции----------------
function field_drow (arr) {
  var $table = $('<table>');

  arr.forEach(function(item, i, arr){
    var $tr =  $('<tr data-row="'+ i +'">');
    item.forEach(function(item_k, k, arr_k){
      var $td = $('<td class="td" data-row ="'+ i +'" data-col="'+ k +'">');
      if (arr[i][k] == -1){
        $td = $('<td class="td td_wall" data-row ="'+ i +'" data-col="'+ k +'">');
      } else if (arr[i][k] == 1) {
        $td.append('<i class="fas fa-male">');
      } else if (arr[i][k] == -3) {
        $td.append('<i class="fas fa-flag">');
      } else if (arr[i][k] == -4) {
        $td.addClass('td_trail');
      }

      if (btn_player_active == true || btn_finish_active == true || btn_walls_add_active == true || btn_walls_remove_active == true){
        $td.addClass('td_ready');
      }
      $tr.append($td);
    });
    $table.append($tr);
  });
  $('.osnov__wrapper').html($table);
}

function btnsDeactivated(){
   btn_walls_add_active =false;
   btn_walls_remove_active = false;
   btn_player_active = false;
   btn_finish_active = false;
   $btn_walls_add.removeClass('btn_active')
   $btn_walls_remove.removeClass('btn_active')
   $btn_player.removeClass('btn_active')
   $btn_finish.removeClass('btn_active')
}

//--------------Обработчики--------------
$btn_crate.on('click', function(){
  if (($input_height.val() > 0) && ($input_width.val() >0) ){
    $osnov.removeClass('hidden');
    $btn_find.removeClass('hidden');
    arr_field = arr_create($input_height.val(), $input_width.val());
    field_drow (arr_field);
  }
});

$btn_walls_add.on('click', function(){
  if (btn_walls_add_active == false){
    btnsDeactivated();
    btn_walls_add_active = true;
    $(this).addClass('btn_active');
    $('.td').addClass('td_ready');
  } else {
    btn_walls_add_active = false;
    $(this).removeClass('btn_active');
    $('.td').removeClass('td_ready');
  }
});

$btn_walls_remove.on('click', function(){
  if (btn_walls_remove_active == false){
    btnsDeactivated()
    btn_walls_remove_active = true;
    $(this).addClass('btn_active');
    $('.td').addClass('td_ready');
  } else {
    btn_walls_remove_active = false;
    $(this).removeClass('btn_active');
    $('.td').removeClass('td_ready');
  }
});

$btn_player.on('click', function(){
  if (btn_player_active == false){
    btnsDeactivated()
    btn_player_active = true;
    $(this).addClass('btn_active');
    $('.td').addClass('td_ready');
  } else {
    btn_player_active = false;
    $(this).removeClass('btn_active');
    $('.td').removeClass('td_ready');
  }
});

$btn_finish.on('click', function(){
  if (btn_finish_active == false){
    btnsDeactivated()
    btn_finish_active = true;
    $(this).addClass('btn_active');
    $('.td').addClass('td_ready');
  } else {
    btn_finish_active = false;
    $(this).removeClass('btn_active');
    $('.td').removeClass('td_ready');
  }
});

$btn_find.on('click', function(){
  var startResult = -1;
  var finishResult = -1;
  arr_field.forEach(function(item, i){
    if (item.indexOf(1) != -1) {
      startResult = item.indexOf(1);
    }
    if (item.indexOf(-3) != -1) {
      finishResult = item.indexOf(-3);
    }
  });
  if (startResult == -1){
    alert("Установите позицию для человечка");
  } else if (finishResult == -1){
    alert("Установите позицию финиша");
  } else {
    arr_field = findTrail(arr_field);
    field_drow(arr_field);
    arr_field = arrReset(arr_field);
  }
})

$table_wrapper.on('click', 'td', function(){
  if (btn_walls_add_active == true) {
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));
    arr_field[row][col] = -1;
    field_drow(arr_field);
  } else if (btn_walls_remove_active == true) {
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));
    arr_field[row][col] = 0;
    field_drow(arr_field);
  } else if (btn_player_active == true){
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));

    if (arr_field[row][col] != 1){
      arr_field.forEach(function(item, i){
        if(item.indexOf(1) != -1){
          item[item.indexOf(1)] = 0;
        }
      });
      arr_field[row][col] = 1;
      setStartPos(row, col);
    } else {
      arr_field[row][col] = 0;
    }
    field_drow(arr_field);
  } else if (btn_finish_active == true){
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));

    if (arr_field[row][col] != -3){
      arr_field.forEach(function(item, i){
        if(item.indexOf(-3) != -1){
          item[item.indexOf(-3)] = 0;
        }
      });
      arr_field[row][col] = -3;
      setFinishPos(row,col);
    } else {
      arr_field[row][col] = 0;
    }
    field_drow(arr_field);
  }
})




//-------------Обозначения для массива поля-----------
/*
0 = ничего
-1 = Стена
1 = игрок
-3 = финиш

*/
