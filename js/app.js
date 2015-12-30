(function () {
    "use strict";
    
    var MenuItem = Backbone.Model.extend({
        defaults: {
	    id: '',
	    name: '',
	    img: '',
	    calories: 0,
	    rating: 0,
	    description: '',
	    selected: false,
        }
    });

    var MenuItemsCollection = Backbone.Collection.extend({
        model: MenuItem
    });

    var MenuItems; // <<< temporary shim to keep the selected item view working
    
    
    var MenuItemView = Backbone.View.extend({

        tagName: 'tr',

        events: {
	    'click .select-item': 'selectItem'
        },
          
        initialize: function( item ) {
            this.model = item;
            this.render();
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

    var SelectedItemView = Backbone.View.extend({
        el: 'div',

        initialize: function( item ) {
	        this.model = item;
	        this.render();
        },

        render: function() {
	        var content;
	        if (this.model.get('selected')) {
	            // TODO this belongs in a template
	            content = "You are going to eat: " + this.model.get('item').get('name');
	        } else {
	            // TODO as does this
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

    var itemDetails = new ItemDetails();

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

    var AppView = Backbone.View.extend({

        el: '#app',

        initialize: function( initialMenu ) {
            this.collection = new MenuItemsCollection( initialMenu );
            MenuItems = this.collection; // <<< temporary shim to keep the selected item view working
            this.menu = $("#table-body"); 
            this.selections = $("#selected-items");
            this.render();
            Backbone.history.start();
        },

        render: function() {
            // Build the menu
            this.collection.each(function( item ) {
                if (item.selected) {
                    this.renderSelectedItem( item );
                }
                this.renderMenuItem( item );
            }, this );
            return this;
        },
        
        renderSelectedItem: function( item ) {
	        var selectedItem = new SelectedItemView( item );
	        this.selections.append(selectedItem.render().el);
        },
        
        renderMenuItem: function( item ) {
	        var menuItem = new MenuItemView( item );
	        this.menu.append(menuItem.render().el);
        }
        

    });
    
    // Start the app
    var initialMenuItems = [{
        id: 'chicken-pomegranate-salad',
        name: 'Chicken Pomegranate Salad',
        image: 'chicken-pomegranate-salad.jpg',
        calories: 430,
        rating: 4.1,
        description: 'A simple, sweet and delicious salad of chicken, pomegranates, spinach, and spiced candied walnuts. Served with a side of citrus vinaigrette.',
        source: 'https://www.pexels.com/photo/salad-pomegranate-chicken-spinach-5916/',
        photographer: 'Karolina Grabowska.STAFFAGE'
    },
    {
        id: 'strawberry-pudding',
        name: 'Strawberry Pudding',
        image: 'strawberry-pudding.jpg',
        calories: 280,
        rating: 5,
        description: 'A sweet and tasty pudding filled with strawberries, blueberries, and raspberries.',
        source: 'https://www.pexels.com/photo/restaurant-dessert-pudding-strawberries-3674/',
        photographer: ''
    },
    {
        id: 'ham-goat-cheese-croissant',
        name: 'Ham and Goat Cheese Croissant',
        image: 'ham-goat-cheese-croissant.jpg',
        calories: 670,
        rating: 3.9,
        description: 'A savory slice of ham topped with a wedge of goat cheese, all on a buttery, flaky croissant.',
        source: 'https://www.pexels.com/photo/croissant-bakery-plate-food-7390/',
        photographer: ''
    }];


    var app = new AppView( initialMenuItems );
    
})();

