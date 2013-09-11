var podio = podio || {};

(function ($) {

    podio.SpaceModel = Backbone.Model.extend({
        initialize: function () {
            this.name = this.get('name');
            this.url = this.get('url');
        }
    });

    podio.SpaceCollection = Backbone.Collection.extend({
        model: podio.SpaceModel
    });

    podio.OrganisationModel = Backbone.Model.extend({
        initialize: function(){
            this.name = this.get('name');
            this.image = this.get('image');
        }
    });

    podio.OrganisationCollection = Backbone.Collection.extend({
        model: podio.OrganisationModel,
        url: 'data/data.json'
    });

    var data = new podio.OrganisationCollection();
    data.fetch().complete(function(){
       setTimeout(function(){
           console.log(data);
       },50);
    });

}(jQuery));