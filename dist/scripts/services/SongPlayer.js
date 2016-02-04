(function() {
     function SongPlayer($rootScope, Fixtures) {
/**
 * @desc Object containing other objects for playing and pausing songs
 * @type {Object}
 */
     var SongPlayer = {};/**
 * @desc Object containing Currenet Album information obtained from Fixtures.js
 * @type {Object}
 */
     var currentAlbum = Fixtures.getAlbum();
/**
 * @desc Buzz object audio file
 * @type {Object}
 */
     var currentBuzzObject = null;

/**
 * @function playSong
 * @desc Plays the loaded audio file as currentBuzzObject
 * @param {Object} song
 */
    var playSong = function(song) {
         currentBuzzObject.play();
         song.playing = true;
     };  
         
/**
 * @function stopSong
 * @desc Stops the loaded audio file as currentBuzzObject
 * @param {Object} song
 */
    var stopSong = function(song) {     
         song = SongPlayer.currentSong;
         currentBuzzObject.stop();
         song.playing = null;
     }; 
         
 /**
 * @function setSong
 * @desc Stops currently playing song and loads new audio file as currentBuzzObject
 * @param {Object} song
 */
     var setSong = function(song) {
        if (currentBuzzObject) { 
        stopSong(song);
            }
        currentBuzzObject = new buzz.sound(song.audioUrl, {
            formats: ['mp3'],
            preload: true
        });
         
         currentBuzzObject.bind('timeupdate', function() {
            $rootScope.$apply(function() {
                SongPlayer.currentTime = currentBuzzObject.getTime();
            });
         });
         
         currentBuzzObject.bind('volumechange', function() {
         $rootScope.$apply(function() {
             SongPlayer.volume = currentBuzzObject.getVolume();
         });
     });
         
     SongPlayer.currentSong = song;  
      };          
/**
 * @function getSongIndex
 * @desc Gets the index number of the song used as a parameter
 * @param {Object} song
 */    
         var getSongIndex = function(song) {
         return currentAlbum.songs.indexOf(song);
     };
         
 /**
 * @desc Active song object from list of songs
 * @type {Object}
 */
         SongPlayer.currentSong = null;

/**
 * @desc Current playback time (in seconds) of currently playing song
 * @type {Number}
 */
         SongPlayer.currentTime = null;
         
/**
 * @desc Current volume of the player
 * @type {Number}
 */
         SongPlayer.volume = null;

/**
 * @function SongPlayer.play
 * @desc Plays the selected song if it is not already playing
 * @param {Object} song
 */    
         SongPlayer.play = function(song) {
             song = song || SongPlayer.currentSong;
         if (SongPlayer.currentSong !== song) {
             setSong(song);
             playSong(song);
             
         } 
        else if (SongPlayer.currentSong === song) {
         if (currentBuzzObject.isPaused()) {
             playSong(song);

         }
     }
     };
         
/**
 * @function SongPlayer.pause
 * @desc Pauses the selected song if it is already playing
 * @param {Object} song
 */           
          SongPlayer.pause = function(song) {
              song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
            };

/**
 * @function SongPlayer.previous
 * @desc Changes the current song to the song with an index value lower by 1
 * @param {Object} song
 */    
          SongPlayer.previous = function() {
          var currentSongIndex = getSongIndex(SongPlayer.currentSong);
          currentSongIndex--;
              
            if (currentSongIndex < 0) {
                var song = currentAlbum.songs[currentSongIndex];
                stopSong(song);
            } 
            else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
          };
/**
 * @function SongPlayer.previous
 * @desc Changes the current song to the song with an index value lower by 1
 * @param {Object} song
 */    
          SongPlayer.next = function() {
          var currentSongIndex = getSongIndex(SongPlayer.currentSong);
          currentSongIndex++;
              
            if (currentSongIndex > (currentAlbum.songs.length - 1)) {
                var song = currentAlbum.songs[currentSongIndex];
                stopSong(song);
            } 
            else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
          };
         
/**
 * @function setCurrentTime
 * @desc Set current time (in seconds) of currently playing song
 * @param {Number} time
 */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

/**
 * @function setVolume
 * @desc Sets volume of player
 * @param {Number} time
 */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };
         
          return SongPlayer;
    
     };
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();