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
    function MKVoice(idx) {
      return Object.create(null, {
        index        : { value:idx,  writable:true },
        next         : { value:null, writable:true },
        channel      : { value:null, writable:true },
        sample       : { value:null, writable:true },
        enabled      : { value:0,    writable:true },
        period       : { value:0,    writable:true },
        effect       : { value:0,    writable:true },
        param        : { value:0,    writable:true },
        volume       : { value:0,    writable:true },
        portaDir     : { value:0,    writable:true },
        portaPeriod  : { value:0,    writable:true },
        portaSpeed   : { value:0,    writable:true },
        vibratoPos   : { value:0,    writable:true },
        vibratoSpeed : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel      = null;
            this.sample       = null;
            this.enabled      = 0;
            this.period       = 0;
            this.effect       = 0;
            this.param        = 0;
            this.volume       = 0;
            this.portaDir     = 0;
            this.portaPeriod  = 0;
            this.portaSpeed   = 0;
            this.vibratoPos   = 0;
            this.vibratoSpeed = 0;
        }}
      });
    }
    function MKPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id           : { value:"MKPlayer" },
        track        : { value:null, writable:true },
        patterns     : { value:[],   writable:true },
        samples      : { value:[],   writable:true },
        length       : { value:0,    writable:true },
        restart      : { value:0,    writable:true },
        voices       : { value:[],   writable:true },
        trackPos     : { value:0,    writable:true },
        patternPos   : { value:0,    writable:true },
        jumpFlag     : { value:0,    writable:true },
        vibratoDepth : { value:0,    writable:true },
        restartSave  : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < SOUNDTRACKER_23)
              value = SOUNDTRACKER_23;
            else if (value > NOISETRACKER_20)
              value = NOISETRACKER_20;

            this.version = value;

            if (value == NOISETRACKER_20) this.vibratoDepth = 6;
              else this.vibratoDepth = 7;

            if (value == NOISETRACKER_10) {
              this.restartSave = this.restart;
              this.restart = 0;
            } else {
              this.restart = this.restartSave;
              this.restartSave = 0;
            }
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();

            this.speed      = 6;
            this.trackPos   = 0;
            this.patternPos = 0;
            this.jumpFlag   = 0;

            while (voice) {
              voice.initialize();
              voice.channel = this.mixer.channels[voice.index];
              voice.sample  = this.samples[0];
              voice = voice.next;
            }
        }},
        loader: {
          value: function(stream) {
            var higher = 0, i, id, j, row, sample, size = 0, value;
            if (stream.length < 2150) return;

            stream.position = 1080;
            id = stream.readString(4);
            if (id != "M.K." && id != "FLT4") return;

            stream.position = 0;
            this.title = stream.readString(20);
            this.version = SOUNDTRACKER_23;
            stream.position += 22;

            for (i = 1; i < 32; ++i) {
              value = stream.readUshort();

              if (!value) {
                this.samples[i] = null;
                stream.position += 28;
                continue;
              }

              sample = AmigaSample();
              stream.position -= 24;

              sample.name = stream.readString(22);
              sample.length = value << 1;
              stream.position += 3;

              sample.volume = stream.readUbyte();
              sample.loop   = stream.readUshort() << 1;
              sample.repeat = stream.readUshort() << 1;

              stream.position += 22;
              sample.pointer = size;
              size += sample.length;
              this.samples[i] = sample;

              if (sample.length > 32768)
                this.version = SOUNDTRACKER_24;
            }

            stream.position = 950;
            this.length = stream.readUbyte();
            value = stream.readUbyte();
            this.restart = value < length ? value : 0;

            for (i = 0; i < 128; ++i) {
              value = stream.readUbyte() << 8;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 1084;
            higher += 256;
            this.patterns.length = higher;

            for (i = 0; i < higher; ++i) {
              row = AmigaRow();
              value = stream.readUint();

              row.note   = (value >> 16) & 0x0fff;
              row.effect = (value >>  8) & 0x0f;
              row.sample = (value >> 24) & 0xf0 | (value >> 12) & 0x0f;
              row.param  = value & 0xff;

              this.patterns[i] = row;

              if (row.sample > 31 || !this.samples[row.sample]) row.sample = 0;

              if (row.effect == 3 || row.effect == 4)
                this.version = NOISETRACKER_10;

              if (row.effect == 5 || row.effect == 6)
                this.version = NOISETRACKER_20;

              if (row.effect > 6 && row.effect < 10) {
                this.version = 0;
                return;
              }
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 32; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.name.indexOf("2.0") > -1)
                this.version = NOISETRACKER_20;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.length  = sample.loop + sample.repeat;
              } else {
                sample.loopPtr = this.mixer.memory.length;
                sample.repeat  = 2;
              }
              size = sample.pointer + 4;
              for (j = sample.pointer; j < size; ++j) this.mixer.memory[j] = 0;
            }

            sample = AmigaSample();
            sample.pointer = sample.loopPtr = this.mixer.memory.length;
            sample.length  = sample.repeat  = 2;
            this.samples[0] = sample;

            if (this.version < NOISETRACKER_20 && this.restart)
              this.version = NOISETRACKER_11;
        }},
        process: {
          value: function() {
            var chan, i, len, pattern, period, row, sample, slide, value, voice = this.voices[0];

            if (!this.tick) {
              pattern = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[pattern + voice.index];
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];
                  chan.volume = voice.volume = sample.volume;
                } else {
                  sample = voice.sample;
                }

                if (row.note) {
                  if (voice.effect == 3 || voice.effect == 5) {
                    if (row.note < voice.period) {
                      voice.portaDir = 1;
                      voice.portaPeriod = row.note;
                    } else if (row.note > voice.period) {
                      voice.portaDir = 0;
                      voice.portaPeriod = row.note;
                    } else {
                      voice.portaPeriod = 0;
                    }
                  } else {
                    voice.enabled = 1;
                    voice.vibratoPos = 0;

                    chan.enabled = 0;
                    chan.pointer = sample.pointer;
                    chan.length  = sample.length;
                    chan.period  = voice.period = row.note;
                  }
                }

                switch (voice.effect) {
                  case 11:  //position jump
                    this.trackPos = voice.param - 1;
                    this.jumpFlag ^= 1;
                    break;
                  case 12:  //set volume
                    chan.volume = voice.param;

                    if (this.version == NOISETRACKER_20)
                      voice.volume = voice.param;
                    break;
                  case 13:  //pattern break
                    this.jumpFlag ^= 1;
                    break;
                  case 14:  //set filter
                    this.mixer.filter.active = voice.param ^ 1;
                    break;
                  case 15:  //set speed
                    value = voice.param;

                    if (value < 1) value = 1;
                      else if (value > 31) value = 31;

                    this.speed = value;
                    this.tick = 0;
                    break;
                }

                if (voice.enabled) chan.enabled = 1;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;

                voice = voice.next;
              }
            } else {
              while (voice) {
                chan = voice.channel;

                if (!voice.effect && !voice.param) {
                  chan.period = voice.period;
                  voice = voice.next;
                  continue;
                }

                switch (voice.effect) {
                  case 0:   //arpeggio
                    value = this.tick % 3;

                    if (!value) {
                      chan.period = voice.period;
                      voice = voice.next;
                      continue;
                    }

                    if (value == 1) value = voice.param >> 4;
                      else value = voice.param & 0x0f;

                    period = voice.period & 0x0fff;
                    len = 37 - value;

                    for (i = 0; i < len; ++i) {
                      if (period >= PERIODS[i]) {
                        chan.period = PERIODS[i + value];
                        break;
                      }
                    }
                    break;
                  case 1:   //portamento up
                    voice.period -= voice.param;
                    if (voice.period < 113) voice.period = 113;
                    chan.period = voice.period;
                    break;
                  case 2:   //portamento down
                    voice.period += voice.param;
                    if (voice.period > 856) voice.period = 856;
                    chan.period = voice.period;
                    break;
                  case 3:   //tone portamento
                  case 5:   //tone portamento + volume slide
                    if (voice.effect == 5) {
                      slide = 1;
                    } else if (voice.param) {
                      voice.portaSpeed = voice.param;
                      voice.param = 0;
                    }

                    if (voice.portaPeriod) {
                      if (voice.portaDir) {
                        voice.period -= voice.portaSpeed;

                        if (voice.period <= voice.portaPeriod) {
                          voice.period = voice.portaPeriod;
                          voice.portaPeriod = 0;
                        }
                      } else {
                        voice.period += voice.portaSpeed;

                        if (voice.period >= voice.portaPeriod) {
                          voice.period = voice.portaPeriod;
                          voice.portaPeriod = 0;
                        }
                      }
                    }
                    chan.period = voice.period;
                    break;
                  case 4:   //vibrato
                  case 6:   //vibrato + volume slide
                    if (voice.effect == 6) {
                      slide = 1
                    } else if (voice.param) {
                      voice.vibratoSpeed = voice.param;
                    }

                    value = (voice.vibratoPos >> 2) & 31;
                    value = ((voice.vibratoSpeed & 0x0f) * VIBRATO[value]) >> this.vibratoDepth;

                    if (voice.vibratoPos > 127) chan.period = voice.period - value;
                      else chan.period = voice.period + value;

                    value = (voice.vibratoSpeed >> 2) & 60;
                    voice.vibratoPos = (voice.vibratoPos + value) & 255;
                    break;
                  case 10:  //volume slide
                    slide = 1;
                    break;
                }

                if (slide) {
                  value = voice.param >> 4;
                  slide = 0;

                  if (value) voice.volume += value;
                    else voice.volume -= voice.param & 0x0f;

                  if (voice.volume < 0) voice.volume = 0;
                    else if (voice.volume > 64) voice.volume = 64;

                  chan.volume = voice.volume;
                }
                voice = voice.next;
              }
            }

            if (++this.tick == this.speed) {
              this.tick = 0;
              this.patternPos += 4;

              if (this.patternPos == 256 || this.jumpFlag) {
                this.patternPos = this.jumpFlag = 0;
                this.trackPos = (++this.trackPos & 127);

                if (this.trackPos == this.length) {
                  this.trackPos = this.restart;
                  this.mixer.complete = 1;
                }
              }
            }
        }}
      });

      o.voices[0] = MKVoice(0);
      o.voices[0].next = o.voices[1] = MKVoice(1);
      o.voices[1].next = o.voices[2] = MKVoice(2);
      o.voices[2].next = o.voices[3] = MKVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var SOUNDTRACKER_23 = 1,
        SOUNDTRACKER_24 = 2,
        NOISETRACKER_10 = 3,
        NOISETRACKER_11 = 4,
        NOISETRACKER_20 = 5,

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,0],

        VIBRATO = [
            0, 24, 49, 74, 97,120,141,161,180,197,212,224,
          235,244,250,253,255,253,250,244,235,224,212,197,
          180,161,141,120, 97, 74, 49, 24];

    window.neoart.MKPlayer = MKPlayer;
  })();