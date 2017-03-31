# favorites-common-v2
Модуль избранного для новых тем InSales (использующих common.v2.js)

# Порядок подключения файлов
```
#= require favorites.helpers
#= require favorites.master
#= require favorites.init
```

# Дополнительные элементы

Для работы модуля необходимо создать шаблон вывода избранного ```data-template-id="favorites-list"``` в сниппете templates

Страница избранного создается через ```/page/``` с названием "Избранное" и урлом ```/page/favorites```

Элемент для добавления товара в избранное:
```
<a class="favorite-link favorite-add js-favorite-add" data-favorite-add="{{product.id}}" href="javascript:;">
        Добавить в избранное
</a>
```

Элемент для удаления товара из избранного:
```
<a href="javascript:;" class="js-favorite-remove favorite-remove" data-favorite-delete="<%= product.id %>">Удалить</a>
```

Количество товаров в избранном задается в элементе с классом ```js-favorites-amount```

# Примечания

Шаблон вывода избранного сильно зависит от темы.
Например, в одном из моих проектов он выглядит так:

```
<script type="text/template" data-template-id="favorites-list">
 <div class="favorites-wrapper ">
        <div class="row row--nopad products-wrapper">
        	<% _.forEach(products, function (product){ %>
             <% labelsList = '' %>
<% _.forEach(product.characteristics, function (characteristic){ %> // вывод лейбла, id 2785702 в данном проекте имеет параметр, отвечающий за лейбл
	<% if (characteristic.property_id == 2785702) { %>
    <% console.log(characteristic) %>    
      <% labelsList += '<div class="stiker stiker-' + characteristic.permalink + '">' + characteristic.title + '</div>' %>
    <% } %>  
<% }) %>

<form class="product-card {{ card_prefix }} {{cell_style}}" action="{{ cart_url }}" method="post" data-product-id="<%= product.id %>">
  <div class="card-info">
    <div class="card-image">
      <%= labelsList %>
        <a href="<%= product.url %>" class="image-inner">
          <div class="image-wraps">
            <span class="image-container is-square">
              <img src="<%= product.first_image.medium_url %>">
            </span>
          </div>
        </a>
    </div>
    <div class="card-title">
      <a href="<%= product.url %>">
        <%= product.title %>
      </a>
    </div>
    <div class="card-prices">
      <% if (product.variants[0].old_price != null && product.variants[0].old_price != 'null') { %>
        <div class="card-old_price old_price">
          <%= Shop.money.format(product.variants[0].old_price) %>
        </div>
        <% } %>  
        <div class="card-price price">
          <%= Shop.money.format(product.variants[0].price) %>
        </div>
    </div>
  </div>
  {% if card_prefix == 'product-card-favorites' %}
  <a href="javascript:;" class="js-favorite-remove favorite-remove" data-favorite-delete="<%= product.id %>"><i class="fa fa-times-circle"></i> Удалить</a>
  {% endif %}
</form>
          	<% }) %>
        </div>
</div>
</script>
```

В целом в цикл foreach часто можно просто скопировать содержимое сниппета ```product-card``` с заменой ликвид-переменных на переменные js-шаблонизатора
