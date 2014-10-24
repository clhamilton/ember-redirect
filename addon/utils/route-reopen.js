
export default function(route, options) {

    if(!route || !options || !options.redirect) {
        return;
    }

    route.reopen({
        beforeModel: function(transition) {
            var newDynamicObject = {},
                thisRouteName = this.routeName,
                routeNames = this.router.router.recognizer.names,
                segmentsOfNextRoute = routeNames[options.redirect].segments,
                segmentsOfThisRoute = routeNames[thisRouteName].segments;

            var dynamicSegmentsOfNextRoute = segmentsOfNextRoute.filterBy('name').mapBy('name');
            var dynamicSegmentsOfThisRoute = segmentsOfThisRoute.filterBy('name').mapBy('name');

            // Make sure that the lengths are the same else we are trying to transition to a route that needs more
            // segments then we can supply.
            if(dynamicSegmentsOfNextRoute.length <= dynamicSegmentsOfThisRoute.length) {

                dynamicSegmentsOfNextRoute.forEach(function(item, index) {
                    newDynamicObject[dynamicSegmentsOfNextRoute[index]] = transition.params[thisRouteName][dynamicSegmentsOfThisRoute[index]];
                });

                this.replaceWith(transition.router.recognizer.generate(options.redirect, newDynamicObject));
            }

            this._super.apply(this, arguments);
        }
    });
}
