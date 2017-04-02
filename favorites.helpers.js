
// разворачиваем массив продуктов в объект для более прозрачного доступа к информации
convertProducts = function( array ){
  var
    obj = {};

  $.each( array, function( index, product ){
    obj[ product.id ] = product;
  });

  return obj;
};

// получаем информацию о товарах
// 
// id_array - массив или объект, содержащий id товаров
getProductList = function( id_array ){

  // хелпер для склейки
  concatHelper = function( target, from ){
    //console.log( from );
    // делаем проверку, к нам пришло описание одного товара или пачки
    if( from.product ){
      target.push( from.product );
    }else{
      $.each( from.products, function( index, value ){
        target.push( value );
      });
    };

    return target;
  };

  var
    end   = 0,
    paths = [],
    temp;

  if( id_array == null ){
    id_array = [];
  };

  // разбиваем входной массив на пачки по 25 элементов
  paths = id_array.reduce( function( p, c, i ){
    if( i % 25 === 0 ){
      p.push([]);
    };

    p[ p.length - 1 ].push(c);
    return p;
  }, []);

  // и генерим массив путей для json
  $.each( paths, function( index, ids ){
    paths[ index ] = '/products_by_id/'+ ids.join() +'.json';
  });

  // собираем задачи 
  promises = $.map( paths, function( path ) {
    return $.ajax( path ).then( function( response ){
        return response;
      });
  });

  // в качель. микро чит. максимум в запрос - 100 товаров
  // ну кто еще хочет забрать инфу о более чем 100 товарах,
  // если в шаблон коллекции за раз отдается максимум 100??
  // склеиваем ответы
  temp = $.when.apply( this, promises )
    .then( function( response_1, response_2, response_3, response_4 ){
      var
        $result = [];

      //console.log( response_1, response_2, response_3, response_4 );
      if( response_1 ){
        $result = concatHelper( $result, response_1 );
      };

      if( response_2 ){
        $result = concatHelper( $result, response_2 );
      };

      if( response_3 ){
        $result = concatHelper( $result, response_3 );
      };

      if( response_4 ){
        $result = concatHelper( $result, response_4 );
      };

      return $result;
    })

  return temp;
};
