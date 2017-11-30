var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');
var EventDispatcher = require('../events/EventDispatcher');
//  Phaser.Sound.BaseSoundManager
var BaseSoundManager = new Class({
    initialize: function BaseSoundManager(game) {
        /**
         * Local reference to game.
         *
         * @property {Phaser.Game} game
         */
        this.game = game;
        /**
         * An array containing all added sounds.
         *
         * @property {Array} sounds
         */
        this.sounds = [];
        /**
         * Global mute setting.
         *
         * @property {boolean} mute
         */
        this.mute = false;
        /**
         * Global volume setting.
         *
         * @property {number} volume
         */
        this.volume = 1;
        /**
         * Global playback rate at which all the audio assets will be played.
         * Value of 1.0 plays the audio at full speed, 0.5 plays the audio at half speed
         * and 2.0 doubles the audio's playback speed.
         *
         * @property {number} rate
         */
        this.rate = 1;
        /**
         * Global detuning of all sounds in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
         * The range of the value is -1200 to 1200, but we recommend setting it to [50](https://en.wikipedia.org/wiki/50_Cent).
         *
         * @property {number} detune
         */
        this.detune = 0;
        /**
         * Global amount of panning to apply.
         * The value can range between -1 (full left pan) and 1 (full right pan).
         * @property  {number} pan
         */
        this.pan = 0;
        // TODO add fields for global spatialization options
        /**
         * Flag indicating if sounds should be paused when game looses focus,
         * for instance when user switches tabs or to another program/app.
         *
         * @property {boolean} pauseOnBlur
         */
        this.pauseOnBlur = true;
        game.events.on('ON_BLUR', function () {
            if (this.pauseOnBlur) {
                this.onBlur();
            }
        }.bind(this));
        game.events.on('ON_FOCUS', function () {
            if (this.pauseOnBlur) {
                this.onFocus();
            }
        }.bind(this));
        /**
         * [description]
         *
         * @property {Phaser.Events.EventDispatcher} events
         */
        this.events = new EventDispatcher();
        /**
         * Property that actually holds the value of global playback rate.
         *
         * @property {number} _rate
         * @private
         */
        this._rate = 1;
        /**
         * Property that actually holds the value of global detune.
         *
         * @property {number} _detune
         * @private
         */
        this._detune = 0;
    },
    add: NOOP,
    addAudioSprite: function (key, config) {
        var sound = this.add(key, config);
        /**
         * Local reference to 'spritemap' object form json file generated by audiosprite tool.
         *
         * @property {object} spritemap
         */
        sound.spritemap = this.game.cache.json.get(key).spritemap;
        for (var markerName in sound.spritemap) {
            if (!sound.spritemap.hasOwnProperty(markerName)) {
                continue;
            }
            var marker = sound.spritemap[markerName];
            sound.addMarker({
                name: markerName,
                start: marker.start,
                duration: marker.end - marker.start,
                config: config
            });
        }
        return sound;
    },
    addOscillator: NOOP,
    remove: NOOP,
    removeByKey: NOOP,
    pauseAll: NOOP,
    resumeAll: NOOP,
    stopAll: NOOP,
    onBlur: NOOP,
    onFocus: NOOP,
    /**
     * Update method called on every game step.
     *
     * @param {number} time - The current timestamp as generated by the Request Animation Frame or SetTimeout.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: function (time, delta) {
        this.sounds.forEach(function (sound) {
            sound.update(time, delta);
        });
    },
    destroy: NOOP
});
/**
 * Global playback rate.
 * @property {number} rate
 */
Object.defineProperty(BaseSoundManager.prototype, 'rate', {
    get: function () {
        return this._rate;
    },
    set: function (value) {
        this._rate = value;
        this.sounds.forEach(function (sound) {
            sound.setRate();
        }, this);
    }
});
/**
 * Global detune.
 * @property {number} detune
 */
Object.defineProperty(BaseSoundManager.prototype, 'detune', {
    get: function () {
        return this._detune;
    },
    set: function (value) {
        this._detune = value;
        this.sounds.forEach(function (sound) {
            sound.setRate();
        }, this);
    }
});
module.exports = BaseSoundManager;
