var podio = podio || {};

(function ($) {

    podio.SpaceModel = Backbone.Model.extend({
        initialize: function () {
        }
    });

    podio.SpaceCollection = Backbone.Collection.extend({
        model: podio.SpaceModel,
        initialize: function(){

        },

        /**
         *
         * @param searchTerm
         * @returns {*}
         */
        search: function (searchTerm) {
            if (searchTerm == "") {
                return this;
            }

            var regexp = new RegExp(searchTerm, "gi");

            return _(this.filter(function (model) {
                return regexp.test(model.get("name"));
            }));

        }

    });

    podio.OrganisationModel = Backbone.Model.extend({
        initialize: function () {
        },

        parse: function (response) {
            response.spaces = new podio.SpaceCollection(response.spaces);

            return response;
        }
    });

    podio.OrganisationCollection = Backbone.Collection.extend({
        model: podio.OrganisationModel,
        url: 'data/data.json',
        parse: function (response) {
            return response;
        }
    });

    podio.SpaceView = Backbone.View.extend({
        initialize: function (collection) {
            var self = this;
console.log('init');
            this.collection = collection;

            //Ugly ;(
            $('.menu input').on('keyup', function(){
                //Pass in the collection
                self.search(this);
            });
        },

        //copy of the collection, only showing the results after a filter
        filteredCollection: '',

        template: '<li><a href="{{url}}">{{{name}}}</a></li>',

        search: function(input) {

            //Perform a search
            this.filteredCollection = this.collection.search( $(input).val() );

        },
        render: function () {

            var self = this;
            var output = "";
            var coll = this.collection;

            if (this.filteredCollection != "") {
                coll = this.filteredCollection;
            }

            console.log(coll);
            coll.each(function (model) {
                output += Mustache.render(self.template, model.attributes);
            });

            return output;
        }
    });

    podio.OrganisationView = Backbone.View.extend({

        el: ".menu .spaces",

        templateBefore: [
            '<li>',
            '<div>',
            '<img src="{{image.thumbnail_link}}" alt="{{hosted_by_humanized_name}}">',
            '</div>',
            '<div class="areaContainer">',
            '<a href="{{url}}">{{{name}}}</a>',
            '<ol>'
        ].join(''),

        templateAfter: '</ol></div></li>',

        //The html that will be appended to the DOM
        output: "",

        events: {
            //'click': 'inputKeyup'
        },

        inputKeyup: function () {
            //console.log('filt', this);
        },

        initialize: function () {
            var self = this;
            this.collection = new podio.OrganisationCollection();

            this.collection.fetch().complete(function () {
                //when data is fetched, render the view
                self.render();
            });


        },

        render: function () {
            var self = this;

            this.collection.each(function (model) {

                self.output += Mustache.render(self.templateBefore, model.attributes);

                $(model.attributes.spaces).each(function () {
                   // self.output += new podio.SpaceView(this).render();
                });

                self.output += self.templateAfter;
            });

            self.$el.append(self.output);
        }
    });

    var spacesview = new podio.OrganisationView();

}(jQuery));

$('.menu a').on('click', function (event) {
    //Prevent this click event to bubble up
    event.stopPropagation();
    event.preventDefault();
    $(this).parent().toggleClass('open');
});