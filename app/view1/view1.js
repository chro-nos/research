'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {
    var dogBarkingBuffer;
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.createBufferSource();
    var req = new XMLHttpRequest();
    req.open('GET', 'resource/track.mp3', true);
    req.responseType = 'arraybuffer';

    req.onload = function() {
      ctx.decodeAudioData(req.response, function(buffer) {
        dogBarkingBuffer = buffer;
        var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
        var source = offlineContext.createBufferSource();
        source.buffer = buffer;

        var filter = offlineContext.createBiquadFilter();
        filter.type = "lowpass";
        source.connect(filter);
        filter.connect(offlineContext.destination);


        offlineContext.oncomplete = function(e) {
          console.log(e);
          var filteredBuffer = e.renderedBuffer;
        };
        source.start(0);

        //source.start(0);
        console.log(offlineContext);
      });

    };
    req.send();
}])
  .service('options', function(){
    var self = this;
    self.center = {};
  })
  .service('draw', function(options){
    var self = this;
    self.coordOnCircle = function(angle, radius){
      var angleRad = angle * Math.PI / 180;
      var cX = options.center.x + Math.cos(angleRad) * radius;
      var cY = options.center.y + Math.sin(angleRad) * radius;
      return {
        x: Math.floor(cX),
        y: Math.floor(cY)
      }
    };

    self.lineOnCircle = function(paper, obj){
      var element = [];
      var deg = 0;
      var degV = 360/obj.count;
      console.log(degV);
      self.itteration(obj, function(t, i){
        var coordStart = self.coordOnCircle(deg, t.radius);
        if(i%4){
          var coordEnd = self.coordOnCircle(deg, t.radius + t.length);
        }
        else {
          var coordEnd = self.coordOnCircle(deg, t.radius + t.length);
        }
        obj.coord = {
          start: {x: coordStart.x, y: coordStart.y},
          end: {x: coordEnd, y: coordEnd.y}
        };
        var str = 'M' + coordStart.x + ',' + coordStart.y + 'L' + coordEnd.x + ',' + coordEnd.y;
        element.push(paper.path(str));
        element[i].attr("stroke", "#EA2D2D");
        element[i].attr("stroke-width", obj.width);
        deg += degV;
      });
      return element;
    };

    self.itteration = function(obj, callback){
      if(obj.count){
        for(var i = 0; i < obj.count; i++) {
          callback(obj, i);
        }
      } else {
        throw 'property obj.count not found';
      }
    }


  })
  .directive('screen', function(options, draw){
    return {
      scope: {},
      controller: function($scope){
        $scope.init = function(){

        }
      },
      link: function (scope, element, attr) {
/*        element.css('height', window.innerHeight + 'px');
        element.css('width', window.innerWidth + 'px');*/
        options.width = window.innerWidth;
        options.height = window.innerHeight;
        options.center = {x: window.innerWidth/2, y: window.innerHeight/2};
        options.circleBeat = {
          count: 12,
          elementRadius: 12,
          radius: 170,
          element: []
        };
        options.circleBeat.deg = 360/options.circleBeat.count;
        /*
         {
         height: window.innerHeight,
         width: window.innerWidth
         }
         */
        var paper = Raphael(element[0], options.width, options.height);
        options.lineOnCircle = {
          count: 64,
          length: 10,
          radius: 175,
          element: [],
          width: 3
        };
        options.lineOnCircle.element = draw.lineOnCircle(paper, options.lineOnCircle);
        options.lineOnCircle.element.forEach(function(el, i){
          if(i%2){
            var anim = Raphael.animation({transform: "r-360"}, 2000).repeat(Infinity);
          }
          else {
            var anim =Raphael.animation({transform: "r360"}, 2000).repeat(Infinity);
          }
          el.animate(anim);
        });

        options.lineOnCircle2 = {
          count: 64,
          length: 10,
          radius: 185,
          element: [],
          width: 3
        };
        options.lineOnCircle2.element = draw.lineOnCircle(paper, options.lineOnCircle2);
        options.lineOnCircle2.element.forEach(function(el, i){
          if(i%2){
            var anim = Raphael.animation({transform: "r360"}, 2000).repeat(Infinity);
          }
          else {
            var anim =Raphael.animation({transform: "r-360"}, 2000).repeat(Infinity);
          }
          el.animate(anim);
        });

        var st = paper.set();
        options.lineOnCircle3 = {
          count: 64,
          length: 100,
          radius: 195,
          element: [],
          width: 3
        };
        options.lineOnCircle3.element = draw.lineOnCircle(paper, options.lineOnCircle3);
        options.lineOnCircle3.element.forEach(function(el, i){
          var coord = draw.coordOnCircle();
          st.push(el);
        });

/*         var anim = Raphael.animation({transform: "r360"}, 2000).repeat(Infinity);
         st.animate(anim);
         console.log(st);*/

/*        for(var i = 0; i < options.lineOnCircle.count; i++) {
          var coordStart = coordOnCircle(deg, options.lineOnCircle.radius);
          var coordEnd = coordOnCircle(deg, options.lineOnCircle.length);
          var str = 'M' + coordStart.x + ',' + coordStart.y + 'L' + coordEnd.x + ',' + coordEnd.y;
          console.log(str);
          options.lineOnCircle.element.push(paper.path(str));
          options.lineOnCircle.element[i].attr("stroke", "#EA2D2D");
          options.lineOnCircle.element[i].attr("stroke-width", "10");
          deg += options.lineOnCircle.deg;
          fg += 'L' + coordEnd.x + ',' + coordEnd.y;
        }

        paper.path(fg);*/



/*        for(var i = 0; i < options.circleBeat.count; i++) {
          var coord = coordCircle(deg);
          options.circleBeat.element.push(paper.circle(coord.x, coord.y, options.circleBeat.elementRadius));
          options.circleBeat.element[i].attr("stroke", "#fff");
          deg += options.circleBeat.deg;
          var animCircle = Raphael.animation({scale: "50"}, 2000).repeat(Infinity);
          options.circleBeat.element[i].animate(animCircle);
        }*/
/*        for(var i = 0; i < options.circleBeat.count; i++) {
          var coord = coordCircle(deg);
          options.circleBeat.element.push(paper.rect(coord.x, coord.y, 170, 170));
          options.circleBeat.element[i].attr("stroke", "#fff");
          deg += options.circleBeat.deg;
          var animCircle = Raphael.animation({cx: 50, cy: 200}, 4000).repeat(Infinity);
          options.circleBeat.element[i].animate(animCircle);
        }*/
        // Creates canvas 320 ? 200 at 10, 50

/*        var rect = paper.rect(options.center.x - 25, options.center.y - 25, 50, 50);
        rect.attr("fill", "#DA543C");
        var anim = Raphael.animation({transform: "r360"}, 2000).repeat(Infinity);
        rect.animate(anim);*/

// Creates circle at x = 50, y = 40, with radius 10

      }
    }
  })
  .service('audio', function(){
    var self = this;
    self.loops = [];
    var prefixUrl = '../resource/';



    console.log('sdfsdfsfd');

    self.init = function(){
      for(var i in self.loops){
        console.log(i);
        var req = new XMLHttpRequest();
        var url = prefixUrl + self.loops[i].file;
        console.log(url);
        req.open('GET', url, true);
        req.responseType = 'arraybuffer';
        req.onload = function() {
          self.ctx.decodeAudioData(
            req.response,
            function(buffer) {
              self.loops[i].buffer = buffer;
              console.log(buffer, 121212);
              /*audio.source_loop[i] = {};
              var button = document.getElementById('button-loop-' + i);
              button.addEventListener('click', function(e) {
                e.preventDefault();
                audio.play(this.value);
              });
              */
            },
            function() {
              console.log('Error decoding audio "' + audio.files[i - 1] + '".');
            }
          );
        };
      }
    };
    self.play = function (n) {
      console.log(self.loops[n]);
      if(self.loops[n].play){
        //self.stop(n)
      }
      else {
        self.loops[n].source = self.ctx.createBufferSource();
        self.loops[n].buffer = '';
      }
    }
  })
  .directive('sequence', [function() {
    return {
      controller: function($scope, audio){
        console.log(audio.ctx);
        $scope.tracks = [
          {
            name: 'House',
            time: 7700,
            samples: [
              {name: 'pad', file: 'pad.wav'},
              {name: 'lead', file: 'lead.wav'},
              {name: 'kick', file: 'kick.wav'}
            ]
          }
        ];
        audio.loops = $scope.tracks[0].samples;
        audio.init();
      },
      link: function(scope, element, attr){

      }
    }
  }])
  .directive('sample', function(audio) {
    return {
      require: '^sequence',
      scope: {
        sample: '=',
        key: '='
      },
      link: function(scope, element, attr){
        element.on('click', function(event){
/*          event.preventDefault();
          audio.init();
          audio.play(scope.key);

          scope.sample.play = scope.sample.play ? false : true;
          console.log(scope.sample.play);*/
/*          if(scope.sample.play){
            element.addClass('-type_play');
          }
          else {
            element.removeClass('-type_play');
          }*/
          scope.$apply();
        });
      }
    }
  });