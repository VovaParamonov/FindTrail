import $ from 'jquery';

var startRow;
var startCol;

var finishRow;
var finishCol;

export function arrReset(arr){
    arr = arr.map(function(item, i){
      return item.map(function(item_k){
        if (item_k != 1 && item_k != -3 && item_k != -1){
          return 0;
        } else {
          return item_k;
        }
      })
    });
    return arr;
}

export function setStartPos(row, col) {
  startRow = row;
  startCol = col;
}
export function setFinishPos(row, col) {
  finishRow = row;
  finishCol = col;
}

export function arr_create(height, width) {
  var arr_field = [];
  for(var i = 0; i < height; i++){
    var pod_arr = [];
    for(var k = 0; k < width; k++){
      pod_arr.push(0);
    }
    arr_field.push(pod_arr);
  }

  return arr_field;
}

export function findTrail(arr) {
  let bool = true;
  let change;
  while (bool){
    change = false;
    for (let i=0;i < arr.length; i++){
      for (let k=0;k < arr[0].length; k++){
        if (arr[i][k] != 0 && arr[i][k] != -1 && arr[i][k] != -3) {
          var val = arr[i][k];
          if (i > 0) {
            if (arr[i-1][k] == 0){
              arr[i-1][k] = val+1;
              change = true;
            } else if (arr[i-1][k] == -3){
              change = true;
              bool = false;
              break;
            }
          }
          if (k < arr[0].length-1){
            if (arr[i][k+1] == 0){
              change = true;
              arr[i][k+1] = val+1;
            } else if (arr[i][k+1] == -3){
              change = true;
              bool = false;
              break;
            }
          }
          if (i < arr.length-1){
            if (arr[i+1][k] == 0){
              change = true;
              arr[i+1][k] = val+1;
            } else if (arr[i+1][k] == -3){
              change = true;
              bool = false;
              break;
            }
          }
          if (k > 0){
            if (arr[i][k-1] == 0){
              change = true;
              arr[i][k-1] = val+1;
            } else if (arr[i][k-1] == -3){
              change = true;
              bool = false;
              break;
            }
          }
        }
      }
      if (bool == false){
        break;
      }
    }
    if (change == false) {
      alert('Тупик, построение пути невозможно!');
      bool = false;
    }
  }
 //----Построение обратного пути-------
  if (change == true) {
    bool = true;
    let posRow;
    let posCol;
    arr.forEach(function(item, i){
      item.forEach(function(item_k, k){
        if(item_k == -3){
          posRow = i;
          posCol = k;
        }
        })
    })
    val++;
    while(bool){
      if (posRow > 0) {
        if (arr[posRow-1][posCol] == val-1) {
          arr[posRow][posCol] = -4;
          posRow--;
          val--;
          if (val == 1) {
            bool = false;
          }
          continue;
        }
      }
      if (posCol < arr[0].length-1) {
        if (arr[posRow][posCol+1] == val-1) {
          arr[posRow][posCol] = -4;
          posCol++;
          val--;
          if (val == 1) {
            bool = false;
          }
          continue;
        }
      }
      if (posRow < arr.length-1) {
        if (arr[posRow + 1][posCol] == val-1) {
          arr[posRow][posCol] = -4;
          posRow++;
          val--;
          if (val == 1) {
            bool = false;
          }
          continue;
        }
      }
      if (posCol > 0) {
        if (arr[posRow][posCol-1] == val-1) {
          arr[posRow][posCol] = -4;
          posCol--;
          val--;
          if (val == 1) {
            bool = false;
          }
          continue;
        }
      }
    }
  }
  return arr;
}

export function step(arr){
  var posRow;
  var posCol;

  arr.forEach(function(item, i){
    item.forEach(function(item_k, k){
      if (item_k == 1){
        posRow = i;
        posCol = k;
      }
    })
  })

  if (posRow > 0) {
    if (arr[posRow-1][posCol] == -4) {
      arr[posRow][posCol] = 0;
      arr[posRow-1][posCol] = 1;
      return arr;
    }
  }
  if (posCol < arr[0].length-1) {
    if (arr[posRow][posCol+1] == -4) {
      arr[posRow][posCol] = 0;
      arr[posRow][posCol+1] = 1;
      return arr;
    }
  }
  if (posRow < arr.length-1) {
    if (arr[posRow + 1][posCol] == -4) {
      arr[posRow][posCol] = 0;
      arr[posRow+1][posCol] = 1;
      return arr;
    }
  }
  if (posCol > 0) {
    if (arr[posRow][posCol-1] == -4) {
      arr[posRow][posCol] = 0;
      arr[posRow][posCol-1] = 1;
      return arr;
    }
  }

  return 'Finish';
}
