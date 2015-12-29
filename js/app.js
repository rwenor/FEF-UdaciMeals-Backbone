(function () {
    "use strict";
    
    var MenuItem = Backbone.Model.extend({
        defaults: {
	    id: '',
	    name: '',
	    img: '',
	    calories: 0,
	    rating: 0,
	    description: ''
        }
    });

    var MenuItemsCollection = Backbone.Collection.extend({
        model: MenuItem
    });

    var item1 = new MenuItem({
        id: 'chicken-pomegranate-salad',
        name: 'Chicken Pomegranate Salad',
        image: 'chicken-pomegranate-salad.jpg',
        calories: 430,
        rating: 4.1,
        description: 'A simple, sweet and delicious salad of chicken, pomegranates, spinach, and spiced candied walnuts. Served with a side of citrus vinaigrette.',
        source: 'https://www.pexels.com/photo/salad-pomegranate-chicken-spinach-5916/',
        photographer: 'Karolina Grabowska.STAFFAGE'
    });

    var item2 = new MenuItem({
        id: 'strawberry-pudding',
        name: 'Strawberry Pudding',
        image: 'strawberry-pudding.jpg',
        calories: 280,
        rating: 5,
        description: 'A sweet and tasty pudding filled with strawberries, blueberries, and raspberries.',
        source: 'https://www.pexels.com/photo/restaurant-dessert-pudding-strawberries-3674/',
        photographer: ''
    });

    var item3 = new MenuItem({
        id: 'ham-goat-cheese-croissant',
        name: 'Ham and Goat Cheese Croissant',
        image: 'ham-goat-cheese-croissant.jpg',
        calories: 670,
        rating: 3.9,
        description: 'A savory slice of ham topped with a wedge of goat cheese, all on a buttery, flaky croissant.',
        source: 'https://www.pexels.com/photo/croissant-bakery-plate-food-7390/',
        photographer: ''
    });

    var MenuItems = new MenuItemsCollection();
    MenuItems.add(item1);
    MenuItems.add(item2);
    MenuItems.add(item3);

    var MenuItemsView = Backbone.View.extend({

        el: '#table-body',

        initialize: function() {
	    this.render();
	    selectedItemView.render();
        },

        render: function() {
	    this.$el.html('');

	    MenuItems.each(function(model) {
	        var menuItem = new MenuItemView({
		    model: model
	        });

	        this.$el.append(menuItem.render().el);
	    }.bind(this));

	    return this;
        }

    });

    var MenuItemView = Backbone.View.extend({

        tagName: 'tr',

        events: {
	    'click .select-item': 'selectItem'
        },

        selectItem: function(e) {
	    e.preventDefault();
	    selectedItem.set('selected', true);
	    selectedItem.set('item', this.model);
	    selectedItemView.render();
        },

        template: _.template($('#menuItem-template').html(), {variable: 'menuItem'}),

        render: function() {
	    this.$el.html(this.template(this.model.attributes));
	    return this;
        }

    });

    var SelectedItem = Backbone.Model.extend({
        defaults: {
	    selected: false,
	    item: ''
        }
    });

    var selectedItem = new SelectedItem();

    var SelectedItemView = Backbone.View.extend({
        model: selectedItem,

        el: '#selected-item',

        initialize: function() {
	    this.model = selectedItem;
	    this.render();
        },

        render: function() {
	    var content;
	    if (this.model.get('selected')) {
	        content = "You are going to eat: " + this.model.get('item').get('name');
	    } else {
	        content = "Aren't you hungry? You have not picked anything to eat yet.";
	    }

	    this.$el.html(content);

	    return this;
        }
    });

    var ItemDetails = Backbone.View.extend({
        el: '#details',

        events: {
	    'click .close': 'hide'
        },

        template: _.template($('#itemDetails-template').html(), {variable: 'menuItem'}),

        hide: function() {
	    this.$el.html('');
	    foodRouter.navigate('');
        },

        render: function(id) {
	    this.$el.html(this.template(MenuItems.get(id).attributes));
	    return this;
        },

        clear: function() {
	    this.$el.html('');
        }
    });

    var selectedItemView = new SelectedItemView();
    var itemDetails = new ItemDetails();
    var app = new MenuItemsView();

    var FoodRouter = Backbone.Router.extend({
        routes: {
	    "": "home",
	    "item/:id": "item"
        },

        home: function(){
	    itemDetails.clear();
        },

        item: function(id) {
	    itemDetails.render(id);
        }
    });

    var foodRouter = new FoodRouter();

    Backbone.history.start();
}());

