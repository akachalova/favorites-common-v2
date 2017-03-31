# favorites-common-v2
Модуль избранного для новых тем InSales (использующих common.v2.js)

# Дополнительные элементы

Страница избранного создается через */page/* с названием "Избранное" и урлом */page/favorites*

Элемент для добавления товара в избранное:
<pre>
<a class="favorite-link favorite-add js-favorite-add" data-favorite-add="{{product.id}}" href="javascript:;">
        Добавить в избранное
</a>
</pre>

Элемент для удаления товара из избранного:
<pre>
<a href="javascript:;" class="js-favorite-remove favorite-remove" data-favorite-delete="<%= product.id %>">Удалить</a>
</pre>

Количество товаров в избранном задается в элементе с классом *js-favorites-amount*
