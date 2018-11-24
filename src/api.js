import $ from 'jquery';

export function arrSave (arr, id, callback){
  $.ajax({
    url: 'http://dev.bittenred.com:61536/table/' + id,
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(arr)
  }).done(function(res){
    alert(arr[0][0]);
      callback('Done');
  }).fail(function(res){
    callback('Fail');
  })
}

export function arrLoad(id, callback){
  $.get('http://dev.bittenred.com:61536/table/' + id, function(data){
    callback(data);
  }).fail(function(res){
    callback('Fail');
  })
}

//-------cookies--------

export function setCookies(name, value){
  document.cookie = name + "=" + value;
}

export function getCookies(name){
  name = name || '';
  var result;
  if (name == ''){
    return document.cookie;
  } else {
    var arrCookies = document.cookie.split('; ');
    arrCookies = arrCookies.map(function(item, i, arr){
      return item.split('=');
    });
    arrCookies.forEach(function(item, i){
      if (item[0] == name){
        result = JSON.parse(item[1]);
      }
    })
    return result;
  }

}
