/*
  JavaScript Flod 1.0
  2012/02/08
  Christian Corti
  Neoart Costa Rica

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
  IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  This work is licensed under the Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License.
  To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to
  Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
*/
  (function() {
    function FileLoader() {
      var o = Object.create(null, {
        player : { value:null, writable:true },
        index  : { value:0,    writable:true },
        amiga  : { value:null, writable:true },
        mixer  : { value:null, writable:true },

        tracker: {
          get: function() {
            return (this.player) ? TRACKERS[this.index + this.player.version] : "";
        }},

        load: {
          value: function(stream) {
            var archive, id;
            if (!stream.view) stream = ByteArray(stream);
            stream.endian = 1;
            stream.position = 0;

            if (stream.readUint() == 67324752) {
              if (window.neoart.Unzip) {
                archive = ZipFile(stream);
                stream = archive.uncompress(archive.entries[0]);
              } else {
                throw "Unzip support is not available.";
              }
            }

            if (this.player && this.player.id != "STPlayer") {
              this.player.load(stream);
              if (this.player.version) return player;
            }

            if (stream.length > 336) {
              stream.position = 38;
              id = stream.readString(20);

              if (id == "FastTracker v2.00   " ||
                  id == "Sk@le Tracker"        ||
                  id == "MadTracker 2.0"       ||
                  id == "MilkyTracker        " ||
                  id.indexOf("OpenMPT") != -1) {

                this.player = window.neoart.F2Player(this.mixer);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = FASTTRACKER;
                  return this.player;
                }
              }
            }

            if (stream.length > 2149) {
              stream.position = 1080;
              id = stream.readString(4);

              if (id == "M.K." || id == "FLT4") {
                this.player = window.neoart.MKPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = NOISETRACKER;
                  return this.player;
                }
              } else if (id == "FEST") {
                this.player = window.neoart.HMPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = HISMASTER;
                  return this.player;
                }
              }
            }

            if (stream.length > 2149) {
              stream.position = 1080;
              id = stream.readString(4);

              if (id == "M.K." || id == "M!K!") {
                this.player = window.neoart.PTPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = PROTRACKER;
                  return this.player;
                }
              }
            }

            if (stream.length > 1685) {
              stream.position = 60;
              id = stream.readString(4);

              if (id != "SONG") {
                stream.position = 124;
                id = stream.readString(4);
              }

              if (id == "SONG" || id == "SO31") {
                this.player = window.neoart.FXPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = SOUNDFX;
                  return this.player;
                }
              }
            }

            if (stream.length > 4) {
              stream.position = 0;
              id = stream.readString(4);

              if (id == "ALL ") {
                this.player = window.neoart.D1Player(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = DELTAMUSIC;
                  return this.player;
                }
              }
            }

            if (stream.length > 3018) {
              stream.position = 3014;
              id = stream.readString(4);

              if (id == ".FNL") {
                this.player = window.neoart.D2Player(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = DELTAMUSIC;
                  return this.player;
                }
              }
            }

            if (stream.length > 30) {
              stream.position = 26;
              id = stream.readString(3);

              if (id == "BPS" || id == "V.2" || id == "V.3") {
                this.player = window.neoart.BPPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = BPSOUNDMON;
                  return this.player;
                }
              }
            }

            if (stream.length > 4) {
              stream.position = 0;
              id = stream.readString(4);

              if (id == "SMOD" || id == "FC14") {
                this.player = window.neoart.FCPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = FUTURECOMP;
                  return this.player;
                }
              }
            }

            if (stream.length > 10) {
              stream.position = 0;
              id = stream.readString(9);

              if (id == " MUGICIAN") {
                this.player = window.neoart.DMPlayer(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = DIGITALMUG;
                  return this.player;
                }
              }
            }

            if (stream.length > 86) {
              stream.position = 58;
              id = stream.readString(28);

              if (id == "SIDMON II - THE MIDI VERSION") {
                this.player = window.neoart.S2Player(this.amiga);
                this.player.load(stream);

                if (this.player.version) {
                  this.index = SIDMON;
                  return this.player;
                }
              }
            }

            if (stream.length > 5220) {
              this.player = window.neoart.S1Player(this.amiga);
              this.player.load(stream);

              if (this.player.version) {
                this.index = SIDMON;
                return this.player;
              }
            }

            if (stream.length > 1625) {
              this.player = window.neoart.STPlayer(this.amiga);
              this.player.load(stream);

              if (this.player.version) {
                this.index = SOUNDTRACKER;
                return this.player;
              }
            }

            this.player = window.neoart.DWPlayer(this.amiga);
            this.player.load(stream);

            if (this.player.version) {
              this.index = WHITTAKER;
              return this.player;
            }

            stream.clear();
            this.index = 0;
            return this.player = null;
        }}
      });

      o.amiga = Amiga();
      return Object.seal(o);
    }

    var SOUNDTRACKER = 0,
        NOISETRACKER = 4,
        PROTRACKER   = 9,
        HISMASTER    = 12,
        SOUNDFX      = 13,
        BPSOUNDMON   = 17,
        DELTAMUSIC   = 20,
        DIGITALMUG   = 22,
        FUTURECOMP   = 24,
        SIDMON       = 26,
        FASTTRACKER  = 28,

        TRACKERS = [
          "Unknown Format",
          "Ultimate SoundTracker",
          "D.O.C. SoundTracker 9",
          "Master SoundTracker",
          "D.O.C. SoundTracker 2.0/2.2",
          "SoundTracker 2.3",
          "SoundTracker 2.4",
          "NoiseTracker 1.0",
          "NoiseTracker 1.1",
          "NoiseTracker 2.0",
          "ProTracker 1.0",
          "ProTracker 1.1/2.1",
          "ProTracker 1.2/2.0",
          "His Master's NoiseTracker",
          "SoundFX 1.0/1.7",
          "SoundFX 1.8",
          "SoundFX 1.945",
          "SoundFX 1.994/2.0",
          "BP SoundMon V1",
          "BP SoundMon V2",
          "BP SoundMon V3",
          "Delta Music 1.0",
          "Delta Music 2.0",
          "Digital Mugician",
          "Digital Mugician 7 Voices",
          "Future Composer 1.0/1.3",
          "Future Composer 1.4",
          "SidMon 1.0",
          "SidMon 2.0",
          "FastTracker II",
          "Sk@leTracker",
          "MadTracker 2.0",
          "MilkyTracker",
          "OpenMPT"];

    window.neoart.FileLoader = FileLoader();
  })();