(function () {
    'use strict';

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

    var MenuItemView = Backbone.View.extend({

        tagName: 'tr',      // Will create a new tag on render

        events: {
	    'click .select-item': 'selectItem'
        },

        initialize: function( item ) {
            this.model = item;
            this.render();
        },

        selectItem: function(e) {
	        e.preventDefault();
	        Backbone.trigger('app:select', this.model.id); // post a message using Backbone as a global bus
        },

        template: _.template($('#menuItem-template').html(), {variable: 'menuItem'}),

        render: function() {
	        this.$el.html(this.template(this.model.attributes));
	        return this;
        }

    });

    var SelectedItemView = Backbone.View.extend({
        el: '#selected-item',

        initialize: function( item ) {
            this.select( item );
        },

        select: function ( item ) {
	        this.model = item;
	        this.render();
        },

        template: _.template($('#selectedItem-template').html(), {variable: 'menuItem'}),

        render: function() {
            this.$el.html(this.template(this.model));
            return this;
        }
    });

    var ItemDetailView = Backbone.View.extend({
        el: '#details',

        // events: {
	      //    'click .close': 'hide'
        // },

        template: _.template($('#itemDetails-template').html(), {variable: 'menuItem'}),

        show: function ( item ) {
	        this.model = item;
	        this.render();
          var dialog = $('#itemDetails-modal');
          dialog.modal({backdrop: true });
        },

        render: function() {
            var content = this.model ? this.template(this.model.attributes) : '';
	        this.$el.html(content);
	        return this;
        },

    });

    var FoodRouter = Backbone.Router.extend({
        routes: {
	    '': 'home',
      'item/:id': 'item',
      'detail/:id': 'detail'
        },

        home: function(){
	        Backbone.trigger('app:clearSelection');
        },

        item: function(id) {
	        Backbone.trigger('app:select', id);
        },

        detail: function(id) {
	        Backbone.trigger('app:showDetail', id);
        }
    });

    var AppView = Backbone.View.extend({

        el: '#app',

        initialize: function( initialMenu ) {
            this.collection = new MenuItemsCollection( initialMenu );
            this.selectedItem = null;

            var menu = $('#table-body');
            this.collection.each(function( item ) {
                this.addMenuItem( menu, item );
            }, this );

            this.selectedItemView = new SelectedItemView( );
	         $('#selected-item').append(this.selectedItemView.render().el);


            this.itemDetailView = new ItemDetailView ( );
            $('#details').append(this.itemDetailView.render().el);

            this.listenTo(Backbone, 'app:clearSelection', this.clearSelection);
            this.listenTo(Backbone, 'app:select', this.select);
            this.listenTo(Backbone, 'app:showDetail', this.showDetailPopup);

            this.router = new FoodRouter( this );
            Backbone.history.start();
        },

        clearSelection: function() {
            this.select(null);
            Backbone.history.navigate('');
        },

        select: function( id ) {
            // Note: Only one item will ever be selected
            var oldSelection = this.collection.findWhere({ selected: true });
            if (oldSelection) {
                if (oldSelection.get('id') === id) { return; }// no change
                oldSelection.set('selected', false);
            }

            var newSelection = this.collection.findWhere({ id: (id) });
            if (newSelection) {
                newSelection.set('selected', true);
            }
            this.selectedItemView.select(newSelection);
        },

        showDetailPopup: function (id) {
          var item = this.collection.findWhere({ id: (id) });
          if (!item) { return; }
          this.itemDetailView.show(item);
        },

        render: function() {
            return this; // all views will re-render on update
        },

        addMenuItem: function( menu, item ) {
	        var menuItem = new MenuItemView( item );
	        menu.append(menuItem.render().el);
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


    new AppView( initialMenuItems );

})();
