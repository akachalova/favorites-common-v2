// ============================================================================
//                              FAVORITES
// ============================================================================

InSales.Favorites = function( options ){
  var
    self = this;

  init = function( options ){
    options = options || {};

    // тянем классы элементов
    self.addSelector    = options.addSelector    || '.js-favorite-add';
    self.removeSelector = options.removeSelector || '.js-favorite-remove';
    self.triggerClass   = options.triggerClass   || 'favorite-trigger--added';

    // объявляем списки
    self.products  = [];
    self.favorites = [];

    self.update();
    addItemTrigger();
    removeItemTrigger();

    self.checkStatus();
  };

  // обновляем
  self.update = function(){
    var
      $data = {};

    // забираем данные из куки
    try{
      self.favorites = $.parseJSON( $.cookie( 'favorites' ) );
    }catch( e ){
      self.favorites = null;
    };

    // проверяем на пустоту
    if( !self.favorites ){
      self.products  = [];
      self.favorites = [];

      return;
    };

    if (document.location.href.indexOf('favorites') > -1) {
      show_preloader();
    // забираем данные по товарам
    InSales.getProductList( self.favorites )
      .then( function( response ){
      hide_preloader();
        self.setList( response );

        EventBus.publish('update_items:insales:favorites', self); //обновление полного списка избранного - вызываем только на странице избранного, чтобы не кидать лишний раз тяжелых запросов
      });
    }
    EventBus.publish('update_items_count:insales:favorites', self); //обновление только количества избарнных - для всех остальных страниц
    
  };

  // добавляем товар
  self.addItem = function( product_id, $link ){
    // есть ли такой товар в списке?
    if( self.isRepeated( product_id ) ){
      console.log( 'inList' );
    }else{

      if( $link ){
        $link
          .parent()
            .addClass( self.triggerClass );
      };

      self.added = product_id;
      self.jqObj = $link;

      // пинаем товар в список
      self.favorites.push( parseInt( product_id ) );

      // сохраняем куку
      $.cookie( 'favorites', JSON.stringify( self.favorites ), {
        path: '/'
      });
		EventBus.publish('add_items:insales:favories', self);

      self.update();
    };
  };

  addItemTrigger = function(){
    $( document ).on( 'click', self.addSelector, function( e ){
      e.preventDefault();

      var
        product_id = $(this).data( 'favorite-add' );

      self.addItem( product_id, $(this) );
    });
  };

  self.removeItem = function( product_id, $link ){
    var
      position;

    self.removed = product_id,
    self.jqObj   = $link,

    // удаляем элемент из списка
    $.each( self.favorites, function( index, id ){
      if( id == product_id ){
        position = index;
      };
    });

    if( typeof( position ) == 'number' ){
      self.favorites.splice( position, 1 );
    };

    // сохраняем куку
    $.cookie( 'favorites', JSON.stringify( self.favorites ), {
      path: '/'
    });

    // сбрасываем блокировку
    if( $link ){
      $link.data( 'processed', false );

      $link
        .parent()
          .removeClass( self.triggerClass );

      self.jqObj = $link;
    };
EventBus.publish('delete_items:insales:favorites', self);

    self.update();
  };

  removeItemTrigger = function(){
    $( document ).on( 'click', self.removeSelector, function( e ){
      e.preventDefault();

      // блокируем повторный клик
      if( $(this).data( 'processed') ){
        return;
      };

      $(this).data( 'processed', true );

      var
        product_id = $(this).data( 'favorite-delete' );

      self.removeItem( product_id, $(this) );
    });
  };

  // получаем список товаров в избранном
  self.getProducts = function(){
    return self.products;
  };

  // проверка, есть ли такой в списке
  self.isRepeated = function( product_id ) {
    var
      result = false;

    if( self.favorites ){
      $.each( self.favorites, function( index, id ) {
        if( id == product_id ) {
          result = true;
          return false;
        };
      });
    };

    return result;
  };

  // формируем правильный список с данными по товарам
  self.setList = function( product_list ){
    var
      products = convertProducts( product_list );

    self.products = [];
    $.each( self.favorites, function( index, id ){
      if( id ){
        self.products.push( products[ id ] );
      };
    });

    $.each( self.products, function( index, product ){
      product.price = product.variants[ 0 ].price;
      product.old_price = product.variants[ 0 ].old_priceprice;
    });
  };

  // првоеряем, добавлен ли товар в избранное или нет?
  // если да, то добавим класс контейнеру кнопки
  self.checkStatus = function(){
    $( self.addSelector ).each( function(){
      var
        product_id = $(this).data( 'product_id' );

      if( self.isRepeated( product_id ) ){
        $(this)
          .parent()
            .addClass( self.triggerClass );
      };
    });
  };

  //
  init( options );
};

// =============================================================
//                      FAVORITE
// =============================================================

var
  Favorite = new InSales.Favorites();

$(function(){
  EventBus.subscribe('update_items:insales:favorites', function( $data ){

    if( $data.products.length == 0 ){
      $( '.js-favorite-notice' ).show();
    }else{
      
      $( '.js-favorite-notice' ).hide();
	
      $( '.js-favorite-product_list' )
        .html( Template.render($data, 'favorites-list') ); //рендер избранных товаров - необходимо создать шаблон вывода data-template-id="favorites-list" в сниппете templates
    }
  });
   EventBus.subscribe('update_items_count:insales:favorites', function( $data ){
	if ($data.favorites.length > 0) {
     $('.bottom-toolbar-favorites-link').removeClass('disabled');
      $('.js-favorites-amount').html($data.favorites.length);
      $.each($data.favorites, function(i, id){
      	$('[data-favorite-add="' + id + '"]').addClass('is-active').html('<i class="fa fa-heart-o"></i> В избранном').attr('href', '/page/favorites').removeClass('js-favorite-add').removeAttr('data-favorite-add');
      });
    }
  });
  EventBus.subscribe('add_items:insales:favories', function( $data ){
    console.log( 'onFavorite_Add: ', $data );
    $($data.jqObj[0]).addClass('is-active').html('<i class="fa fa-heart-o"></i> В избранном').attr('href', '/page/favorites').removeClass('js-favorite-add').removeAttr('data-favorite-add');
	alertify.success('Товар добавлен в избранное');
    
  });
 EventBus.subscribe('delete_items:insales:favorites', function( $data ){
   $($data.jqObj[0]).parents('.product-card-favorites').fadeOut(300, function () {
          $(this).remove();
        });
	 alertify.message('Товар удален из избранного');
    console.log( 'onFavorite_Remove: ', $data );
  });
});