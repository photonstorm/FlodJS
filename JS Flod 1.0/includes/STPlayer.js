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
    function STVoice(idx) {
      return Object.create(null, {
        index   : { value:idx,  writable:true },
        next    : { value:null, writable:true },
        channel : { value:null, writable:true },
        sample  : { value:null, writable:true },
        enabled : { value:0,    writable:true },
        period  : { value:0,    writable:true },
        last    : { value:0,    writable:true },
        effect  : { value:0,    writable:true },
        param   : { value:0,    writable:true },

        initialize: {
          value: function() {
            this.channel = null;
            this.sample  = null;
            this.enabled = 0;
            this.period  = 0;
            this.last    = 0;
            this.effect  = 0;
            this.param   = 0;
        }}
      });
    }
    function STPlayer(mixer) {
      var o = AmigaPlayer(mixer);

      Object.defineProperties(o, {
        id         : { value:"STPlayer" },
        standard   : { value:0,    writable:true },
        track      : { value:null, writable:true },
        patterns   : { value:[],   writable:true },
        samples    : { value:[],   writable:true },
        length     : { value:0,    writable:true },
        voices     : { value:[],   writable:true },
        trackPos   : { value:0,    writable:true },
        patternPos : { value:0,    writable:true },
        jumpFlag   : { value:0,    writable:true },

        force: {
          set: function(value) {
            if (value < ULTIMATE_SOUNDTRACKER)
              value = ULTIMATE_SOUNDTRACKER;
            else if (value > DOC_SOUNDTRACKER_20)
              value = DOC_SOUNDTRACKER_20;

            this.version = value;
        }},
        ntsc: {
          set: function(value) {
            this.standard = value;
            this.frequency(value);

            if (this.version < MASTER_SOUNDTRACKER) {
              value = (value) ? 20.44952532 : 20.637767904;
              value = (value * (this.sampleRate / 1000)) / 120;
              this.mixer.samplesTick = ((240 - this.tempo) * value) >> 0;
            }
        }},

        initialize: {
          value: function() {
            var voice = this.voices[0];
            this.reset();
            this.ntsc = this.standard;

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
            var higher = 0, i, j, row, sample, score = 0, size = 0, value;
            if (stream.length < 1626) return;

            this.title = stream.readString(20);
            score += this.isLegal(this.title);

            this.version = ULTIMATE_SOUNDTRACKER;
            stream.position = 42;

            for (i = 1; i < 16; ++i) {
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
              sample.loop   = stream.readUshort();
              sample.repeat = stream.readUshort() << 1;

              stream.position += 22;
              sample.pointer = size;
              size += sample.length;
              this.samples[i] = sample;

              score += this.isLegal(sample.name);
              if (sample.length > 9999) this.version = MASTER_SOUNDTRACKER;
            }

            stream.position = 470;
            this.length = stream.readUbyte();
            this.tempo  = stream.readUbyte();

            for (i = 0; i < 128; ++i) {
              value = stream.readUbyte() << 8;
              if (value > 16384) score--;
              this.track[i] = value;
              if (value > higher) higher = value;
            }

            stream.position = 600;
            higher += 256;
            this.patterns.length = higher;

            i = (stream.length - size - 600) >> 2;
            if (higher > i) higher = i;

            for (i = 0; i < higher; ++i) {
              row = AmigaRow();

              row.note   = stream.readUshort();
              value      = stream.readUbyte();
              row.param  = stream.readUbyte();
              row.effect = value & 0x0f;
              row.sample = value >> 4;

              this.patterns[i] = row;

              if (row.effect > 2 && row.effect < 11) score--;
              if (row.note) {
                if (row.note < 113 || row.note > 856) score--;
              }

              if (row.sample) {
                if (row.sample > 15 || !this.samples[row.sample]) {
                  if (row.sample > 15) score--;
                  row.sample = 0;
                }
              }

              if (row.effect > 2 || (!row.effect && row.param != 0))
                this.version = DOC_SOUNDTRACKER_9;

              if (row.effect == 11 || row.effect == 13)
                this.version = DOC_SOUNDTRACKER_20;
            }

            this.mixer.store(stream, size);

            for (i = 1; i < 16; ++i) {
              sample = this.samples[i];
              if (!sample) continue;

              if (sample.loop) {
                sample.loopPtr = sample.pointer + sample.loop;
                sample.pointer = sample.loopPtr;
                sample.length  = sample.repeat;
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

            if (score < 1) this.version = 0;
        }},
        process: {
          value: function() {
            var chan, row, sample, value, voice = this.voices[0];

            if (!this.tick) {
              value = this.track[this.trackPos] + this.patternPos;

              while (voice) {
                chan = voice.channel;
                voice.enabled = 0;

                row = this.patterns[value + voice.index];
                voice.period = row.note;
                voice.effect = row.effect;
                voice.param  = row.param;

                if (row.sample) {
                  sample = voice.sample = this.samples[row.sample];

                  if (((this.version & 2) == 2) && voice.effect == 12) chan.volume = voice.param;
                    else chan.volume = sample.volume;
                } else {
                  sample = voice.sample;
                }

                if (voice.period) {
                  voice.enabled = 1;

                  chan.enabled = 0;
                  chan.pointer = sample.pointer;
                  chan.length  = sample.length;
                  chan.period  = voice.last = voice.period;
                }

                if (voice.enabled) chan.enabled = 1;
                chan.pointer = sample.loopPtr;
                chan.length  = sample.repeat;

                if (this.version < DOC_SOUNDTRACKER_20) {
                  voice = voice.next;
                  continue;
                }

                switch (voice.effect) {
                  case 11:  //position jump
                    this.trackPos = voice.param - 1;
                    this.jumpFlag ^= 1;
                    break;
                  case 12:  //set volume
                    chan.volume = voice.param;
                    break;
                  case 13:  //pattern break
                    this.jumpFlag ^= 1;
                    break;
                  case 14:  //set filter
                    this.mixer.filter.active = voice.param ^ 1;
                    break;
                  case 15:  //set speed
                    if (!voice.param) break;
                    this.speed = voice.param & 0x0f;
                    this.tick = 0;
                    break;
                }
                voice = voice.next;
              }
            } else {
              while (voice) {
                if (!voice.param) {
                  voice = voice.next;
                  continue;
                }
                chan = voice.channel;

                if (this.version == ULTIMATE_SOUNDTRACKER) {
                  if (voice.effect == 1) {
                    this.arpeggio(voice);
                  } else if (voice.effect == 2) {
                    value = voice.param >> 4;

                    if (value) voice.period += value;
                      else voice.period -= (voice.param & 0x0f);

                    chan.period = voice.period;
                  }
                } else {
                  switch (voice.effect) {
                    case 0: //arpeggio
                      this.arpeggio(voice);
                      break;
                    case 1: //portamento up
                      voice.period -= voice.param & 0x0f;
                      if (voice.period < 113) voice.period = 113;
                      chan.period = voice.period;
                      break;
                    case 2: //portamento down
                      voice.period += voice.param & 0x0f;
                      if (voice.period > 856) voice.period = 856;
                      chan.period = voice.period;
                      break;
                }

                if ((this.version & 2) != 2) {
                  voice = voice.next;
                  continue;
                }

                switch (voice.effect) {
                  case 12:  //set volume
                    chan.volume = voice.param;
                    break;
                  case 13:  //set filter
                    this.mixer.filter.active = 0;
                    break;
                  case 14:  //set speed
                    this.speed = voice.param & 0x0f;
                    break;
                }
              }
              voice = voice.next;
            }
          }

          if (++this.tick == this.speed) {
            this.tick = 0;
            this.patternPos += 4;

            if (this.patternPos == 256 || this.jumpFlag) {
              this.patternPos = this.jumpFlag = 0;

              if (++this.trackPos == this.length) {
                this.trackPos = 0;
                this.mixer.complete = 1;
              }
            }
          }
        }},
        arpeggio: {
          value: function(voice) {
            var chan = voice.channel, i = 0, param = this.tick % 3;

            if (!param) {
              chan.period = voice.last;
              return;
            }

            if (param == 1) param = voice.param >> 4;
              else param = voice.param & 0x0f;

            while (voice.last != PERIODS[i]) i++;
            chan.period = PERIODS[i + param];
        }},
        isLegal: {
          value: function(text) {
            var ascii, i = 0, len = text.length;
            if (!len) return 0;

            for (; i < len; ++i) {
              ascii = text.charCodeAt(i);
              if (ascii && (ascii < 32 || ascii > 127)) return 0;
            }
            return 1;
        }}
      });

      o.voices[0] = STVoice(0);
      o.voices[0].next = o.voices[1] = STVoice(1);
      o.voices[1].next = o.voices[2] = STVoice(2);
      o.voices[2].next = o.voices[3] = STVoice(3);

      o.track = new Uint16Array(128);
      return Object.seal(o);
    }

    var ULTIMATE_SOUNDTRACKER = 1,
        DOC_SOUNDTRACKER_9    = 2,
        MASTER_SOUNDTRACKER   = 3,
        DOC_SOUNDTRACKER_20   = 4,

        PERIODS = [
          856,808,762,720,678,640,604,570,538,508,480,453,
          428,404,381,360,339,320,302,285,269,254,240,226,
          214,202,190,180,170,160,151,143,135,127,120,113,0];

    window.neoart.STPlayer = STPlayer;
  })();