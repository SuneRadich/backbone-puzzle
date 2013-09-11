/*global jQuery*/

(function($){

    /* MODELS */
    var SpacesModel = Backbone.Model.extend({});

    var SpacesCollection = Backbone.Collection.extend({
        model: SpacesModel,
        url: 'data/data.json',
        parse: function(response) {
            var rtn = {};
            rtn.areas = response;
            return rtn;
        }
    });

    var SpacesView = Backbone.View.extend({
        el: ".menu > div input",
        //template: _.template("<h1><%= name %></h1>"),
        template_area: [
            '<div>',
            '<ol>',
            '{{#areas}}',
            '<li>',
            '<div>',
            '<img src="{{image.thumbnail_link}}" alt="{{hosted_by_humanized_name}}">',
            '</div>',
            '<div class="areaContainer">',
            '<a href="{{url}}">{{{name}}}</a>',
            '<ol>',
            '{{#spaces}}',
            '<li><a href="{{url}}">{{{name}}}</a></li>',
            '{{/spaces}}',
            '</ol>',
            '</div>',
            '</li>',
            '{{/areas}}',
            '</ol>',
            '</div>'
        ].join(''),
        template: (function(){

            //Partial template, to display an area
            var template_area = [
                '<div>',
                '<ol>',
                '{{#areas}}',
                '<li>',
                '<div>',
                '<img src="{{image.thumbnail_link}}" alt="{{hosted_by_humanized_name}}">',
                '</div>',
                '<div class="areaContainer">',
                '<a href="{{url}}">{{{name}}}</a>',
                '<ol>',
                '{{#spaces}}',
                '<li><a href="{{url}}">{{{name}}}</a></li>',
                '{{/spaces}}',
                '</ol>',
                '</div>',
                '</li>',
                '{{/areas}}',
                '</ol>',
                '</div>'
            ].join('');

            var template = [
                '<div>',
                '<span class="tab"></span>',
                '<input type="text">',
                '{{> template_area}}',
                '</div>'].join('');

            //Compile partial template for faster reference and usage in the main template
            return Mustache.compile(template);
        }()),
        output: "",

        initialize: function() {
            var self = this;
            this.collection = new SpacesCollection();

            console.log('self', this);
            this.collection.fetch().complete(function(){
                self.render();
            });
        },

        renderCollection: function(){
            var self = this;
            this.collection.each(function(model) {
                self.output += Mustache.render(self.template_area, model.attributes);
                //console.log(self.output);
            });

            self.$el.after(self.output);
            //console.log('Rendering collection', this.collection);
        },

        render: function() {
            //this.$el.html(this.template({"name": "Dummy"}));
            //this.$el.html(Mustache.render(this.template, config))
            this.renderCollection();
        }
    });

    var spacesview = new SpacesView();

}(jQuery));

$('.menu a').on('click', function (event) {
    //Prevent this click event to bubble up
    event.stopPropagation();
    event.preventDefault();
    $(this).parent().toggleClass('open');

});
