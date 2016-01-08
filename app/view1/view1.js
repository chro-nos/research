'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function() {

}])
  .service('audio', function(){
    var self = this;
    self.loops = [];
    var prefixUrl = '/resource/';
    self.ctx = new (window.AudioContext || window.webkitAudioContext)();
    self.init = function(){
      for(var i in self.loops){
        console.log(i);
        var req = new XMLHttpRequest();
        console.log(req);
        var url = prefixUrl + self.loops[i].file;
        req.open('GET', '', true);
        req.responseType = 'arraybuffer';
        req.onload = function() {
          console.log(url);
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
          event.preventDefault();
          audio.init();
          audio.play(scope.key);

          scope.sample.play = scope.sample.play ? false : true;
          console.log(scope.sample.play);
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