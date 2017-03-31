// =============================================================
//                      FAVORITE
// =============================================================

var
  Favorite = new InSales.Favorites();

$(function(){
  EventBus.subscribe('update_items:insales:favorites', function( $data ){
//обновление и вывод состава избранного
    if( $data.products.length == 0 ){
      $( '.js-favorite-notice' ).show();
    }else{
      
      $( '.js-favorite-notice' ).hide();
	
      $( '.js-favorite-product_list' )
        .html( Template.render($data, 'favorites-list') ); //рендер избранных товаров - необходимо создать шаблон вывода data-template-id="favorites-list" в сниппете templates
    }
  });
   EventBus.subscribe('update_items_count:insales:favorites', function( $data ){
   	//обновление и вывод только количества избранных
	if ($data.favorites.length > 0) {
      $('.js-favorites-amount').html($data.favorites.length);
      $.each($data.favorites, function(i, id){
      	$('[data-favorite-add="' + id + '"]').addClass('is-active');
      });
    }
  });
  EventBus.subscribe('add_items:insales:favories', function( $data ){
  	// обработка добавления в избранное - кликнутому элементу добавляется класс is-active
    $($data.jqObj[0]).addClass('is-active');
  });
 EventBus.subscribe('delete_items:insales:favorites', function( $data ){
  //обработка удаления из избранного
	 alertify.message('Товар удален из избранного');
  });
});