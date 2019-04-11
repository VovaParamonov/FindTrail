import $ from "jquery";
import {arr_create, setStartPos, setFinishPos, arrReset, findTrail, step} from './funcs.js';
import {arrSave, arrLoad, setCookies, getCookies} from "./api.js";

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
var $btn_ajax_load = $('.btn_ajax_load');
var $btn_ajax_save = $('.btn_ajax_save');
var $btn_cookies_save = $('.btn_cookie_save');
var $btn_cookies_load = $('.btn_cookie_load');
var $checkbox = $('.checkbox_goes');
var $slider_osnov = $('.slider_osnov');
var $slider_hand = $('.slider_hand');
var $slider_fill = $('.slider_fill');
var $nav = $('nav');

var arr_field = [[]];
var speed = 50;

//--------Активность модификаций-------
var btn_walls_add_active =false;
var btn_walls_remove_active = false;
var btn_player_active = false;
var btn_finish_active = false;

var addingWall = false;
var removingWall = false;

var slider_active = false;

var go_active = false;
//----------------Функции----------------

function slider_move(pos1, pos2){
  if (pos2 - pos1 < -8 && parseInt($slider_fill.css('height'))>=15){
      $slider_fill.attr("data-val", Number($slider_fill.attr("data-val"))+1);
      $slider_fill.css('height', parseInt($slider_fill.css('height'))-10+'%');
      document.mouse_posY1 = pos2;
  } else if (pos2 - pos1 > 8 && parseInt($slider_fill.css('height'))<90) {
    $slider_fill.attr("data-val", Number($slider_fill.attr("data-val"))-1);
    $slider_fill.css('height', parseInt($slider_fill.css('height'))+10+'%');
    document.mouse_posY1 = pos2;
  }
}


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

$slider_hand.on("mousedown", function(eventObj){
  slider_active = true;
  document.mouse_posY1 = eventObj.pageY;
})

$btn_cookies_save.on('click', function(){
  setCookies('arr1', JSON.stringify(arr_field));
  $btn_cookies_save.addClass('btn_done');
  setTimeout(function(){
    $btn_cookies_save.removeClass('btn_done');
  },500);
});

$btn_cookies_load.on('click', function(){
  if (getCookies('arr1')){
    $btn_cookies_load.addClass('btn_done');
    setTimeout(function(){
      $btn_cookies_load.removeClass('btn_done');
    },500);
    arr_field = getCookies('arr1');
    field_drow(arr_field);
  } else {
    $btn_cookies_load.addClass('btn_fail');
    setTimeout(function(){
      $btn_cookies_load.removeClass('btn_fail');
    },500);
  }

})

$btn_ajax_load.on('click', function(eventObj){
  $osnov.removeClass('hidden');
  $btn_find.removeClass('hidden');
  arrLoad('1', function(result){
    arr_field = result;
    field_drow (arr_field);
    $('.info').addClass('hidden');
  })
})

$btn_ajax_save.on('click', function(eventObj){
  arrSave(arr_field, '1', function(result){
    alert(result);
  })
})


$btn_crate.on('click', function(){
  if (($input_height.val() > 0) && ($input_width.val() >0) ){
    $osnov.removeClass('hidden');
    $btn_find.removeClass('hidden');
    arr_field = arr_create($input_height.val(), $input_width.val());
    field_drow (arr_field);
    $('.info').addClass('hidden');
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

$checkbox.change(function(){
  if ($checkbox.attr('data-val') == "true"){
    $checkbox.attr('data-val', 'false');
  } else {
    $checkbox.attr('data-val', 'true');
  }
  if ($slider_osnov.attr('style') == 'display: none;'){
    $slider_osnov.slideDown(300);
  } else {
    $slider_osnov.slideUp(300);
  }

})

$btn_find.on('click', function(){
  if (go_active){
    return;
  }
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
    if ($checkbox.attr("data-val") == "true"){
      go_active = true;
      var timerID = setInterval(function(){
        var step_result = step(arr_field);
        if (typeof(step_result) == 'object'){
            arr_field = step_result;
            field_drow(arr_field);
        } else {
          clearInterval(timerID);
          arr_field = arrReset(arr_field);
          field_drow(arr_field);
          go_active = false;
        }
      }, speed*10/parseInt($slider_fill.attr('data-val')));
    } else {
      arr_field = arrReset(arr_field);
    }
  }
})

$(document).on('mouseup', function(){
  addingWall = false;
  removingWall = false;
  slider_active = false;
})

$(document).mousemove(function(eventObj){
  if (slider_active){
    slider_move(document.mouse_posY1 ,eventObj.pageY);
    //console.log(document.mouse_posY1, eventObj.pageY);
  }
})

$table_wrapper.on('mouseup', function(){
  addingWall = false;
  removingWall = false;
});

$table_wrapper.delegate('td','mousemove',function(){
  if (addingWall == true) {
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));
    arr_field[row][col] = -1;
    field_drow(arr_field);
  } else if (removingWall == true) {
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));
    arr_field[row][col] = 0;
    field_drow(arr_field);
  }
})

$table_wrapper.on('click', 'td', function(){
  if (btn_player_active == true){
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

$table_wrapper.on('mousedown', 'td', function(){
  if (btn_walls_add_active == true) {
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));
    arr_field[row][col] = -1;
    field_drow(arr_field);
    addingWall = true;
  } else if (btn_walls_remove_active == true) {
    var row = parseInt($(this).attr('data-row'));
    var col = parseInt($(this).attr('data-col'));
    arr_field[row][col] = 0;
    field_drow(arr_field);
    removingWall = true;
  }
})


$(document).keydown(function(eventObj){

  let posX;
  let posY;
  let existence = false;

  arr_field.forEach((item, i) => {item.forEach((item_k, k) => {
    if (item_k == 1){
      posX = k;
      posY = i;
      existence = true;
    }
  })});

  if (arr_field != '' && existence){
      switch(eventObj.which){
          case 37:
            if (posX > 0) {
                if (arr_field[posY][posX - 1] == 0 || arr_field[posY][posX - 1] == -3 || arr_field[posY][posX - 1] == -4) {
                    arr_field[posY][posX] = 0;
                    arr_field[posY][posX - 1] = 1;
                    field_drow(arr_field);
                }
            }
            break;
          case 38:
            if (posY > 0) {
                if (arr_field[posY - 1][posX] == 0 || arr_field[posY - 1][posX] == -3 || arr_field[posY - 1][posX] == -4) {
                    arr_field[posY][posX] = 0;
                    arr_field[posY - 1][posX] = 1;
                    field_drow(arr_field);
                }
            }
            break;
          case 39:
            if (posX < arr_field[0].length) {
                if (arr_field[posY][posX + 1] == 0 || arr_field[posY][posX + 1] == -3 || arr_field[posY][posX + 1] == -4) {
                    arr_field[posY][posX] = 0;
                    arr_field[posY][posX + 1] = 1;
                    field_drow(arr_field);
                }
            }
            break;
          case 40:
            if (posY < arr_field.length-1) {
                if (arr_field[posY + 1][posX] == 0 || arr_field[posY + 1][posX] == -3 || arr_field[posY + 1][posX] == -4) {
                    arr_field[posY][posX] = 0;
                    arr_field[posY + 1][posX] = 1;
                    field_drow(arr_field);
                }
            }
            break;
      }
  }

})

// $('body').attr('onwheel', 'return false');

// $(document).scroll(function(){
//   $nav.css('transform', 'translateY('+($(document).scrollTop())+'px)')
// })

//----Аналог для сенсора------
// $table_wrapper.on('ontouchstart', 'td', function(){
//     if (btn_walls_add_active == true) {
//         var row = parseInt($(this).attr('data-row'));
//         var col = parseInt($(this).attr('data-col'));
//         arr_field[row][col] = -1;
//         field_drow(arr_field);
//     } else if (btn_walls_remove_active == true) {
//         var row = parseInt($(this).attr('data-row'));
//         var col = parseInt($(this).attr('data-col'));
//         arr_field[row][col] = 0;
//         field_drow(arr_field);
//         removingWall = true;
//     }
// })
//
// $table_wrapper.on('touchmove', function(eventObj){
//     $(eventObj.target).trigger('ontouchstart');
//     console.log(12312)
//
//     if (btn_walls_add_active == true) {
//         var row = parseInt($(eventObj.target).attr('data-row'));
//         var col = parseInt($(eventObj.target).attr('data-col'));
//         arr_field[row][col] = -1;
//         field_drow(arr_field);
//     } else if (btn_walls_remove_active == true) {
//         var row = parseInt($(eventObj.target).attr('data-row'));
//         var col = parseInt($(eventObj.target).attr('data-col'));
//         arr_field[row][col] = 0;
//         field_drow(arr_field);
//         removingWall = true;
//     }
// })

//-------------Обозначения для массива поля-----------
/*
0 = ничего
-1 = Стена
1 = игрок
-3 = финиш

*/
