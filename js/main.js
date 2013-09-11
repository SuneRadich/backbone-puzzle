/*global jQuery*/

(function ($) {

    /* MODELS */
    var OrganisationModel = Backbone.Model.extend({
    });

    var OrganisationCollection = Backbone.Collection.extend({
        model: OrganisationModel,
        url: 'data/data.json',
        parse: function (response) {
            var rtn = {};
            rtn.areas = response;
            return rtn;
        }
    });

    var OrganisationView = Backbone.View.extend({
        el: ".menu > div input",
        template: [
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

        //The html that will be appended to the DOM
        output: "",
        events: {
            'click': 'inputKeyup'
        },
        inputKeyup: function () {
            console.log('filt', this);

        },
        initialize: function () {
            var self = this;
            this.collection = new OrganisationCollection();
            this.collection.fetch().complete(function () {
                self.render();
            });
        },
        render: function () {
            var self = this;
            this.collection.each(function (model) {
                self.output += Mustache.render(self.template, model.attributes);
            });

            self.$el.after(self.output);
        }
    });

    var spacesview = new OrganisationView();

}(jQuery));

$('.menu a').on('click', function (event) {
    //Prevent this click event to bubble up
    event.stopPropagation();
    event.preventDefault();
    $(this).parent().toggleClass('open');

});
